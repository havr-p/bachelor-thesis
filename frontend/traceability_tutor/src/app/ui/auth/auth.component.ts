import {Component, OnInit} from '@angular/core';
import {AxiosService} from "../../services/axios/axios.service";
import {NgForOf} from "@angular/common";
import {AppModule} from "../../app.module";
import {LoginFormComponent} from "../forms/login-form/login-form.component";
import {EventService} from "../../services/event/event.service";
import {Router} from "@angular/router";
import {AppRoutingModule} from "../../app-routing.module";
import {StateManager} from "../../models/state";
import {AuthControllerService} from "../../../../gen/services/auth-controller";
import {AUTH_TOKEN, LocalStorageService} from "../../services/local-storage/local-storage.service";
import {CredentialsDTO, SignUpDTO, UserDTO} from "../../../../gen/model";
import {Subscription} from "rxjs";
import {error} from "@angular/compiler-cli/src/transformers/util";
import {HttpErrorResponse} from "@angular/common/http";
import {UserResourceService} from "../../../../gen/services/user-resource";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  standalone: true,
  imports: [
    NgForOf, LoginFormComponent
  ],
  styleUrl: './auth.component.scss'

})
export class AuthComponent implements OnInit{
    data: any;
    constructor(private authService: AuthControllerService, private eventService: EventService, private router: Router, private stateManager: StateManager, private localStorageService: LocalStorageService, private userService: UserResourceService) {
    }

    ngOnInit(): void {

      if (this.stateManager.currentUser) {
        const token = this.localStorageService.getData(AUTH_TOKEN);
        const observer = {
          next: (userDTO: UserDTO) => {
            if (userDTO.id === this.stateManager.currentUser.id) {
              const token = this.authService.renewToken(userDTO.id!);
              this.localStorageService.saveData(AUTH_TOKEN, token);
            }
          },
          error: (err: HttpErrorResponse) => {
          }
        }

        this.userService.getUserByToken(token).subscribe(observer)
      }


    }


  onLogin(input: CredentialsDTO): void {
    const observer = {
      next: (value: UserDTO) => {
        this.localStorageService.saveData(AUTH_TOKEN, value.token);
        this.stateManager.currentUser = value;
        this.router.navigateByUrl('/projects');
      },
      error: (err: HttpErrorResponse) => {
        this.eventService.notify("Login failed: " + err.message, 'error')
      }
      }

    this.authService.login( {
      email: input.email,
      password: input.password
    }).subscribe(observer);
  }

  onRegister(input: SignUpDTO): void {
    const observer = {
      next: (value: UserDTO) => {
        this.eventService.notify("New user was successfully registered.", 'success')
      },
      error: (err: HttpErrorResponse) => {
        this.eventService.notify("Login failed: " + err.message, 'error')
      }
    }

    this.authService.register( {
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      password: input.password
    }).subscribe(observer);
  }

}
