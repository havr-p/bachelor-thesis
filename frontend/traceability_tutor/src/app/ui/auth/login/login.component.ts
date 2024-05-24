import {Component, EventEmitter, Output} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {FloatLabelModule} from "primeng/floatlabel";
import {PasswordModule} from "primeng/password";
import {EventService} from "../../../services/event/event.service";
import {LoginRequest} from "../../../../../gen/model";

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        FormsModule,
        InputTextModule,
        ReactiveFormsModule,
        FloatLabelModule,
        PasswordModule
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {
    @Output() onSubmitLoginEvent = new EventEmitter<LoginRequest>(false);

    loginForm = new FormGroup({
            email: new FormControl('', [Validators.required]),
            password: new FormControl('', [Validators.required])
        }
    )

    constructor(private eventService: EventService) {
    }

    loginAsTestUser(): void {
        const credentials = {
            email: 'admin@test.com',
            password: 'admin'
        }
        this.onSubmitLoginEvent.emit(credentials);
    }


    onSubmitLogin(): void {
        if (this.loginForm.valid) {
            const credentials: LoginRequest = {
                email: this.loginForm.get('email')?.value!,
                password: this.loginForm.get('password')?.value!,
            };
            this.onSubmitLoginEvent.emit(credentials);
            this.loginForm.reset();
        } else {
            this.eventService.notify("Both fields are required", 'error');
        }
    }

}
