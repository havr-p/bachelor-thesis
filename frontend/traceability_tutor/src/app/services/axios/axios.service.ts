import {Injectable} from '@angular/core';
import axios from "axios";

@Injectable({
    providedIn: 'root'
})
export class AxiosService {

    constructor() {
        axios.defaults.baseURL = 'http://localhost:8080';
        axios.defaults.headers.post['Content-Type'] = 'application/json';
    }

    request(method: string, url: string, data: any): Promise<any> {
        return axios({method: method, url: url, data: data});
    }

    getAuthToken(): string | null {
        return window.localStorage.getItem("auth_token");
    }

    setAuthToken(token: string | null): void {
        if (token !== null) {
            window.localStorage.setItem("auth_token", token);
        } else {
            window.localStorage.removeItem("auth_token");
        }
    }
}
