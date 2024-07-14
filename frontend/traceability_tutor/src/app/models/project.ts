import {LevelDTO, ProjectDTO} from "../../../gen/model";
import {Release} from "./release";

export class Project implements ProjectDTO {
    id: number
    name: string;
    owner: number;
    repoUrl: string;
    repoName: string;
    releases: Release[] = [];
    levels: LevelDTO[] = [];
    lastOpened: Date;

    constructor(projectDTO: ProjectDTO) {
        this.id = projectDTO?.id;
        this.name = projectDTO.name;
        this.owner = projectDTO.owner;
        this.repoUrl = projectDTO?.repoUrl || '';
        this.repoName = projectDTO?.repoName || '';
        this.levels = projectDTO.levels;
        this.lastOpened = projectDTO.lastOpened;
    }

    addRelease(release: Release) {
        this.releases.push(release);
    }

}
