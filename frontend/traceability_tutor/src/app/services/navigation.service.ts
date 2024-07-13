import {Injectable} from '@angular/core';
import {Router} from "@angular/router";
import {DockMode} from "../ui/dock/dock-manager";

@Injectable({
    providedIn: 'root'
})
export class NavigationService {

    constructor(private router: Router) {
    }

    async navigateToEditor(projectId: number, releaseId?: number) {
        const editorDockMode: DockMode = releaseId ? 'editor-release' : 'editor';
        const url = releaseId ? `/editor/${projectId}/${releaseId}` : `/editor/${projectId}`;
        const extras = {
            state: {editorDockMode}
        };

        await this.router.navigateByUrl(url, extras);
    }

    navigateToProjectMenu() {
        const url = "/projects";
        this.router.navigateByUrl(url);
    }
}
