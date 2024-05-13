import {ProjectDTO} from "../../../gen/model";
import {Release} from "./release";

export class Project implements ProjectDTO {
  id: number | undefined;
  name: string;
  owner: number;
  repoUrl: string;
  releases: Release[] = [];

  constructor(projectDTO: ProjectDTO) {
    this.id = projectDTO?.id;
    this.name = projectDTO.name;
    this.owner = projectDTO.owner;
    this.repoUrl = projectDTO?.repoUrl || '';
  }

  addRelease(release: Release) {
    this.releases.push(release);
  }

  updateFromDTO(projectDTO: ProjectDTO) {
    this.id = projectDTO.id;
    this.name = projectDTO.name;
    this.owner = projectDTO.owner;
    this.repoUrl = projectDTO.repoUrl;
  }
}
