import {ReleaseDTO} from "../../../gen/model";

export class Release implements ReleaseDTO {
    id: number;
    project: number;
    releaseCommitId: string;
    semanticId: string;

    constructor(dto: ReleaseDTO) {
        this.id = dto.id!;
        this.project = dto.project;
        this.releaseCommitId = dto.releaseCommitId;
        this.semanticId = dto.semanticId;
    }

    updateFromDTO(dto: ReleaseDTO) {
        this.id = dto.id!;
        this.project = dto.project;
        this.releaseCommitId = dto.releaseCommitId;
        this.semanticId = dto.semanticId;
    }

}
