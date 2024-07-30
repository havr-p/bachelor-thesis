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
        projectDTO?.levels.forEach(level => {
            let levelName = level.name.toLowerCase();
            levelName = levelName[0].toUpperCase() + levelName.substring(1);
            this.levels.set(levelName, level);
        });
        this.lastOpened = projectDTO.lastOpened;
    }

    addIteration(iterationDTO: IterationDTO) {
        this.iterations.push(iterationDTO);
    }

    toDto(): ProjectDTO {
        return {
            ...this,
            levels: Array.from(this.levels.values())
        }
    }

}
