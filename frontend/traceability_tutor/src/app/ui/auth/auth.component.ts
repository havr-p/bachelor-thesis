import {Component, OnInit} from '@angular/core';
import {AxiosService} from "../../services/axios/axios.service";
import {NgForOf} from "@angular/common";
import {AppModule} from "../../app.module";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  standalone: true,
  imports: [
    NgForOf,
  ],
  styleUrl: './auth.component.scss'

})
export class AuthComponent implements OnInit{
    data: any;
    constructor(private axiosService: AxiosService) {
    }

    ngOnInit(): void {
      console.log("on init");
      this.axiosService.request("GET", '/api/projects', {}).then(
        (response) => {
          this.data = response.data;
          console.log(response.data);
        }
      )
    }

  protected readonly JSON = JSON;
}
