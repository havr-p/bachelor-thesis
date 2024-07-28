import {IterationDTO, LevelDTO, ProjectDTO} from "../../../gen/model";

export class Project implements Omit<ProjectDTO, 'levels'> {
    id: number
    name: string;
    owner: number;
    repoUrl: string;
    repoName: string;
    iterations: IterationDTO[] = [];
    levels: Map<string, LevelDTO> = new Map();
    lastOpened: Date;

    constructor(projectDTO: ProjectDTO) {
        this.id = projectDTO?.id;
        this.name = projectDTO.name;
        this.owner = projectDTO.owner;
        this.repoUrl = projectDTO?.repoUrl || '';
        this.repoName = projectDTO?.repoName || '';
        projectDTO?.levels.forEach(level => this.levels.set(level.name.toLowerCase(), level));
        this.lastOpened = projectDTO.lastOpened;
    }

    addIteration(iterationDTO: IterationDTO) {
        this.iterations.push(iterationDTO);
    }

}
