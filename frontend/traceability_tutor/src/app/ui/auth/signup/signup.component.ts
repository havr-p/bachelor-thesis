import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {FloatLabelModule} from "primeng/floatlabel";
import {PasswordModule} from "primeng/password";
import {EventService} from "../../../services/event/event.service";
import {SignUpRequest} from "../../../../../gen/model";

@Component({
    selector: 'app-signup',
    standalone: true,
    imports: [
        FormsModule,
        InputTextModule,
        FloatLabelModule,
        ReactiveFormsModule,
        PasswordModule
    ],
    templateUrl: './signup.component.html',
    styleUrl: './signup.component.scss'
})
export class SignupComponent implements OnInit {
    registerForm: FormGroup | undefined;
    @Output() onSubmitRegisterEvent = new EventEmitter<SignUpRequest>();

    constructor(private eventService: EventService) {
    }

    ngOnInit(): void {
        this.registerForm = new FormGroup({
            name: new FormControl('', Validators.required),
            signupEmail: new FormControl('', Validators.required),
            signupPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
            confirmPassword: new FormControl('', [Validators.required])
        });
    }

    onSubmitRegister(): void {
        const pass = this.registerForm!.get('signupPassword')?.value;
        const confirm = this.registerForm!.get('confirmPassword')?.value;
        if (this.registerForm?.valid && pass == confirm) {
            this.onSubmitRegisterEvent.emit({
                name: this.registerForm.get('name')?.value,
                email: this.registerForm.get('signupEmail')?.value,
                password: this.registerForm.get('signupPassword')?.value,
            });
            this.registerForm?.reset();
        } else {
            this.eventService.notify("Password should be minimum 6 characters long. " +
                "Please make sure that you entered the same password twice", 'warning');
        }
    }

}
