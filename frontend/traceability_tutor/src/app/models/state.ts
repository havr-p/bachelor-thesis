import {Injectable} from "@angular/core";
import {Project} from "./project";
import {ProjectDTO, RelationshipType} from "../../../gen/model";
import {Item} from "../items/Item";
import {Release} from "./release";
import {
  CURRENT_PROJECT_KEY,
  EDITOR_STATE_KEY,
  LocalStorageService
} from "../services/local-storage/local-storage.service";
import {Requirement} from "./requirement";
import {ValidationService} from "../services/validation/validation.service";
import {ItemProps} from "../types";
import {Connection} from "../connection";
import {RequirementItem} from "../items/requirement-item";
import {tsCallMethod} from "@angular/compiler-cli/src/ngtsc/typecheck/src/ts_util";

export interface EditorState {
  nodes: ItemProps[],
  connections: Connection<ItemProps, ItemProps>[]
}

@Injectable({
  providedIn: 'root'
})
export class StateManager {
  private projects: Map<number, Project> = new Map();
  private currentProject: Project | undefined;
  private currentRelease: Release | undefined;
  private editorState: EditorState | undefined

  constructor(private validationService: ValidationService, private localStorageService: LocalStorageService) {
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

  addRelease(projectId: number, commitHash: string, semanticId?: string): Release {
    const project = this.projects.get(projectId);
    if (!project) throw new Error('Project not found');

    const release = new Release({
      project: project.id!,
      releaseCommitId: commitHash,
      semanticId: semanticId ?? `0.0.${commitHash}`
    });
    project.addRelease(release);
    return release;
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
  // editItem(itemId: number, updates: any, suppressWarnings: boolean = false): Requirement {
  //   const requirement = this.findItemById(itemId);
  //   if (!requirement) throw new Error('Requirement not found');
  //
  //   const warnings = this.validationService.validateItemEdits(item, updates);
  //   if (warnings.length > 0 && !suppressWarnings) {
  //     warnings.forEach(warning => console.warn(warning));
  //   }

  // editItem(itemId: number, updates: any, suppressWarnings: boolean = false): Requirement {
  //   const requirement = this.findItemById(itemId);
  //   if (!requirement) throw new Error('Requirement not found');
  //
  //   const warnings = this.validationService.validateItemEdits(item, updates);
  //   if (warnings.length > 0 && !suppressWarnings) {
  //     warnings.forEach(warning => console.warn(warning));
  //   }

    //requirement.update(updates);
    //return requirement;
  //}




}

