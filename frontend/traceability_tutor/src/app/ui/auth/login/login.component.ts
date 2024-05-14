import {Component, EventEmitter, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {CredentialsDTO} from "../../../../../gen/model";
import {FloatLabelModule} from "primeng/floatlabel";
import {PasswordModule} from "primeng/password";
import {EventService} from "../../../services/event/event.service";

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
  @Output() onSubmitLoginEvent = new EventEmitter<CredentialsDTO>(false);

  loginForm = new FormGroup({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    }
  )

  constructor(private eventService: EventService) { }


  onSubmitLogin(): void {
    if (this.loginForm.valid) {
      const credentials: CredentialsDTO = {
        email: this.loginForm.get('email')?.value!,
        password: this.loginForm.get('password')?.value!,
      };
      this.onSubmitLoginEvent.emit(credentials);
    } else {
      this.eventService.notify("Both fields are required", 'error');
    }
  }

}
