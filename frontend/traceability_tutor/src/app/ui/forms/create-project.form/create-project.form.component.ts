import { Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";

@Component({
  selector: 'app-create-project-form',
  templateUrl: './create-project.form.component.html',
  styleUrl: './create-project.form.component.scss',
  standalone: true,
  imports: [ReactiveFormsModule, InputTextModule]
})
export class CreateProjectFormComponent {
  projectForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    repoUrl: new FormControl('', [Validators.required])
  });

  onSubmit() {
    console.log('Form Submitted!', this.projectForm.value);
  }
}
