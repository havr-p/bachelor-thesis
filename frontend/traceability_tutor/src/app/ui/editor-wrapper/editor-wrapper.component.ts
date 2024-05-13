import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {DockMode} from "../dock/dock-manager";
import {NavigationService} from "../../services/navigation.service";
import {Dock} from "primeng/dock";

@Component({
  selector: 'app-editor-wrapper',
  templateUrl: './editor-wrapper.component.html',
  styleUrl: './editor-wrapper.component.scss'
})
export class EditorWrapperComponent implements OnInit{
  editorDockMode: DockMode = 'editor';


  constructor(private route: ActivatedRoute, private navigationService: NavigationService) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const projectId = Number(params.get('projectId'));
      const releaseId = Number(params.get('releaseId'));
      this.navigationService.navigateToEditor(projectId, releaseId)
    });
  }


}
