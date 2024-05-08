import {ProjectDTO} from "../../../gen/model";
import {Release} from "./release";

export class Project implements ProjectDTO {
  id: number | undefined;
  name: string;
  owner: number;
  repoUrl: string;
  releases: Release[] = [];

  constructor(projectDTO: ProjectDTO) {
    // Initialize with defaults or DTO properties
    this.id = projectDTO?.id;
    this.name = projectDTO.name;
    this.owner = projectDTO.owner;
    this.repoUrl = projectDTO?.repoUrl || ''; // Default to empty string if not provided
  }

  addRelease(release: Release) {
    this.releases.push(release);
  }

  // Method to update project details with a new DTO, useful when refreshing data from the server
  updateFromDTO(projectDTO: ProjectDTO) {
    this.id = projectDTO.id;
    this.name = projectDTO.name;
    this.owner = projectDTO.owner;
    this.repoUrl = projectDTO.repoUrl;
  }
}
