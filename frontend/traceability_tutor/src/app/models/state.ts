import {Injectable} from '@angular/core';
import {Project} from "./project";
import {IterationDTO, ProjectDTO, ProjectSettings, RelationshipType} from "../../../gen/model";
import {
    CURRENT_PROJECT_KEY,
    EDITOR_STATE_KEY,
    LocalStorageService
} from "../services/local-storage/local-storage.service";
import {ValidationService} from "../services/validation/validation.service";
import {ItemProps} from "../types";
import {Connection} from "../connection";
import {Item} from "./itemMapper";
import {ProjectResourceService} from "../../../gen/services/project-resource";
import {firstValueFrom} from "rxjs";

export interface EditorState {
    nodes: ItemProps[],
    connections: Connection<ItemProps, ItemProps>[]
}

@Injectable({
    providedIn: 'root'
})
export class StateManager {
    public currentProject: Project | undefined;
    public currentProjectSettings: ProjectSettings | undefined;
    public currentRelease: IterationDTO | undefined;
    private projects: Map<number, Project> = new Map();
    private editorState: EditorState | undefined;

    constructor(
        private validationService: ValidationService,
        private localStorageService: LocalStorageService,
        private projectService: ProjectResourceService,
    ) {
    }

    createProject(projectDTO: ProjectDTO): Project {
        const project = new Project(projectDTO);
        this.projects.set(project.id!, project);
        this.currentProject = project;
        return project;
    }

    saveEditorState() {
        this.localStorageService.saveData(EDITOR_STATE_KEY, this.editorState);
    }

    saveCurrentProject() {
        this.localStorageService.saveData(CURRENT_PROJECT_KEY, this.currentProject);
    }

    addRelease(projectId: number, commitHash: string, semanticId?: string): IterationDTO {
        const project = this.projects.get(projectId);
        if (!project) {
            throw new Error('Project not found');
        }
        //project.addRelease(release);
        return {project: project.id!, iterationCommitSha: commitHash, semanticId: semanticId ?? `0.0.${commitHash}`} as IterationDTO;
    }

    validateConnection(fromItem: Item, toItem: Item, relationshipType: RelationshipType): boolean {
        if (!this.validationService.isValidConnection(fromItem, toItem, relationshipType)) {
            console.error('Invalid connection attempt between items');
            return false;
        }
        if (this.validationService.doesCreateCycle(fromItem, toItem)) {
            console.error('Connection would create a cycle');
            return false;
        }
        return true;
    }

    openProject(project: ProjectDTO) {
        // Implementation to open a project
    }

  async setCurrentProjectSettings(project: Project) {
    this.currentProjectSettings = await firstValueFrom(this.projectService.getProjectSettings(project.id));
  }
}
