import {Component, OnInit} from '@angular/core';
import {AxiosService} from "../../services/axios/axios.service";
import {NgForOf} from "@angular/common";
import {AppModule} from "../../app.module";
import {LoginFormComponent} from "../login-form/login-form.component";
import {EventService} from "../../services/event/event.service";
import {Router} from "@angular/router";

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
    constructor(private axiosService: AxiosService, private eventService: EventService, private router: Router) {
    }

    ngOnInit(): void {
      console.log("on init");
      // this.axiosService.request("GET", '/api/projects', {}).then(
      //   (response) => {
      //     this.data = response.data;
      //     console.log(response.data);
      //   }
      // )
    }

  componentToShow: string = "welcome";

  showComponent(componentToShow: string): void {
    this.componentToShow = componentToShow;
  }

  onLogin(input: any): void {
    this.axiosService.request(
      "POST",
      "/api/login",
      {
        email: input.email,
        password: input.password
      }).then(
      response => {
        this.axiosService.setAuthToken(response.data.token);
        this.router.navigateByUrl('/editor');
      }).catch(
      error => {
        this.axiosService.setAuthToken(null);
      }
    );

  }

  onRegister(input: any): void {
    this.axiosService.request(
      "POST",
      "/api/register",
      {
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        password: input.password
      }).then(
      response => {
        this.eventService.notify("New user was successfully registered.", 'success')
        this.axiosService.setAuthToken(response.data.token);
      }).catch(
      error => {
        this.eventService.notify("Error on registering " + error, 'error');
        this.axiosService.setAuthToken(null);
      }
    );
  }
}
