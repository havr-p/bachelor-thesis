import {Component, ViewChild} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';
import {EventService} from '../../../services/event/event.service';
import {ProjectResourceService} from '../../../../../gen/services/project-resource';
import {StateManager} from '../../../models/state';
import {AuthService} from '../../../services/auth/auth.service';
import {NavigationService} from '../../../services/navigation.service';
import {OrderList, OrderListModule} from 'primeng/orderlist';
import {LevelDTO} from '../../../../../gen/model';
import {ButtonModule} from 'primeng/button';
import {ColorPickerModule} from 'primeng/colorpicker';
import {NgxColorsModule} from "ngx-colors";
import {NgIf} from "@angular/common";

export const babokLevels: LevelDTO[] = [
    {name: 'Business', color: '#fcf6bd'},
    {name: 'Stakeholder', color: '#ff99c8'},
    {name: 'Solution', color: '#d0f4de'},
    {name: 'Design', color: '#FFD275'},
    {name: 'Code', color: '#a9def9'},
    {name: 'Test', color: '#e4c1f9'},
];

@Component({
    selector: 'app-create-project-form',
    templateUrl: './create-project.form.component.html',
    styleUrls: ['./create-project.form.component.scss'],
    standalone: true,
    imports: [
        ReactiveFormsModule,
        InputTextModule,
        OrderListModule,
        ButtonModule,
        ColorPickerModule,
        FormsModule,
        NgxColorsModule,
        NgIf
    ]
})
export class CreateProjectFormComponent {
    @ViewChild('orderList') orderList: OrderList | undefined;
    projectForm: FormGroup;
    private initialized = false;

    constructor(
        private fb: FormBuilder,
        private eventService: EventService,
        private projectService: ProjectResourceService,
        private stateManager: StateManager,
        private authService: AuthService,
        private navigationService: NavigationService
    ) {
        this.projectForm = this.fb.group({
            name: ['Traceability Tutor', Validators.required],
            repoUrl: ['https://github.com/havr-p/traceability-tutor.git', Validators.required],
            accessToken: ['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', Validators.required],
            levels: this.fb.array([], levelsValidator())
        });
        this.setDefaultLevels();
    }

    get levels(): FormArray {
        return this.projectForm.get('levels') as FormArray;
    }

    get levelsArray(): any[] {
        return this.levels.controls;
    }

    get form() {
        return this.projectForm.controls
    }

    forceUpdateOrderList() {
        if (this.orderList) {
            this.orderList.cd.detectChanges();
        }
    }

    addLevel(index: number, name: string = '', color: string = '#fff') {
        const level = this.fb.group({
            name: [name, Validators.required],
            color: [color, Validators.required]
        });
        this.levels.insert(index, level);
        this.forceUpdateOrderList();
    }

    setDefaultLevels() {
        this.levels.clear();
        babokLevels.forEach((level, index) => this.addLevel(index, level.name, level.color));
    }

    onSubmit() {
        if (!this.authService.isAuthenticated()) {
            this.eventService.notify('Please log in to create a project', 'error');
            return;
        }
        this.projectForm.markAllAsTouched();
        this.forceUpdateOrderList();
        console.log(this.levels.errors);

        //console.log('Form Submitted!', this.projectForm.value);
        if (this.projectForm.valid) {
            const createProjectDTO = {
                owner: this.authService.currentUserValue?.id!,
                repoUrl: this.projectForm.value.repoUrl!,
                name: this.projectForm.value.name!,
                accessToken: this.projectForm.value.accessToken!,
                levels: this.levels.value,
            };
            //console.log(createProjectDTO);
            this.projectService.createProject(createProjectDTO).subscribe({
                next: (projectId) => {
                    this.eventService.notify('Project was created successfully', 'success');
                    this.navigationService.navigateToEditor(projectId);
                },
                error: (error) => {
                    console.log(error)
                    this.eventService.notify('Failed to create project: ' + error.error.message, 'error');
                }
            });
        } else {
            this.eventService.notify('Form data are invalid. Please make sure that</br>'
                + '- all fields are filled;</br>'
                + '- levels for code items with name "Code" and test items with name "Test" are defined;</br>'
                + '- there is at least 3 levels</br>'
                + ' - level colors and names are unique.', 'error');
        }
    }


    deleteLevel(levelCtrl: any) {
        const index = this.getIndex(levelCtrl);
        if (index !== -1) {
            this.levels.removeAt(index);
            this.forceUpdateOrderList();
        }
    }

    getIndex(levelCtrl: any): number {
        return this.levelsArray.indexOf(levelCtrl);
    }

    canAddDeleteButton(levelCtrl: any) {
        const control = this.levels.at(this.getIndex(levelCtrl));
        const name = control.get('name')?.value;
        return this.levels.length > 3 || !['Code', 'Test'].includes(name);
    }


}

export function levelsValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const levelsArray = control as FormArray;
        const errors: ValidationErrors = {};

        if (levelsArray.length < 3) {
            errors['minLevels'] = true;
        }


        const names: string[] = levelsArray.controls.map(level => level.get('name')?.value);
        const colors: string[] = levelsArray.controls.map(level => level.get('color')?.value);
        if (!names.includes('Code')) {
            errors['missingCode'] = true;
        }

        if (!names.includes('Test')) {
            errors['missingTest'] = true;
        }

        if ((new Set(names)).size !== names.length) {
            errors['duplicateNames'] = true;
        }
        if ((new Set(colors)).size !== colors.length) {
            errors['duplicateColors'] = true;
        }

        return Object.keys(errors).length ? errors : null;
    };

}
