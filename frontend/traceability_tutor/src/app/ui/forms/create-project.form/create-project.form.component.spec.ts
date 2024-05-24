import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CreateProjectFormComponent} from './create-project.form.component';

describe('CreateProjectFormComponent', () => {
    let component: CreateProjectFormComponent;
    let fixture: ComponentFixture<CreateProjectFormComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CreateProjectFormComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(CreateProjectFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
