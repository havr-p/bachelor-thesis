import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AsyncPipe, NgIf} from "@angular/common";
import {ButtonModule} from "primeng/button";
import {environment} from "../../../environments/environment";
import {getSocialLoginUrl} from "../../misc/helpers";
import {AuthService, User} from "../../services/auth/auth.service";
import {SignupComponent} from "./signup/signup.component";
import {LoginComponent} from "./login/login.component";
import {TabViewModule} from "primeng/tabview";
import {LoginRequest, SignUpRequest} from "../../../../gen/model";


@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    standalone: true,
    imports: [
        ButtonModule,
        AsyncPipe,
        NgIf,
        SignupComponent,
        LoginComponent,
        TabViewModule
    ],
    styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
    authenticated: boolean = false;
    currentUser: User | null = null;
    isError: boolean = false;
    activeIndex = 0;

    constructor(
        protected router: Router,
        private route: ActivatedRoute,
        protected authService: AuthService,
    ) {
    }

    ngOnInit(): void {
        this.authenticated = this.authService.isAuthenticated();
        this.authService.currentUser.subscribe(user => {
            this.currentUser = user;
        });
    }


    logout(): void {
        this.authService.logout();
    }

    handleGithubLogin() {
        console.log('handleGithubLogin')
        window.location.href = environment.apiUrl + getSocialLoginUrl('github');
    }

    handleLocalLogin($event: LoginRequest) {
        console.log('handle local Login')
        this.authService.localLogin($event);
    }

    handleSignUp($event: SignUpRequest) {
        console.log($event);
        this.authService.signup($event);
    }

    onProjectsClick() {
        this.router.navigateByUrl('/projects');
    }


}
