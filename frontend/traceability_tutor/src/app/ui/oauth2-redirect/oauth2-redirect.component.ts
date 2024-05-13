import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {parseUserFromJwt} from "../../misc/helpers";
import {EventService} from "../../services/event/event.service";
import {UserDTO} from "../../../../gen/model";

@Component({
  selector: 'app-oauth2-redirect',
  standalone: true,
  imports: [],
  template: '<ng-container></ng-container>',

})
export class OAuth2RedirectComponent implements OnInit{
  private redirectTo: string = '/auth';

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const accessToken = params['token'];
      if (accessToken) {
        this.handleLogin(accessToken);
        this.redirectTo = '/projects';
        this.eventService.notify("Sign in succeed!", 'success');
      }
      this.router.navigate([this.redirectTo]);
    });
  }

  private handleLogin(accessToken: string): void {
    const data = parseUserFromJwt(accessToken);
    const user: UserDTO = {
      accessToken: accessToken,
      tokenExpiry: data.exp,
      username: data.preferred_username,
      id: data.user_id,
    }
    this.authService.saveAndSetUser(user);
  }
}
