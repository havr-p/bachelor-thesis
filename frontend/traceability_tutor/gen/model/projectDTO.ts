/**
 * Generated by orval v6.29.1 🍺
 * Do not edit manually.
 * traceability-tutor
 */
import type { LevelDTO } from './levelDTO';

export interface ProjectDTO {
  dateCreated?: Date;
  id?: number;
  lastModified?: Date;
  lastOpened?: Date;
  levels?: LevelDTO[];
  /**
   * @minLength 0
   * @maxLength 255
   */
  name: string;
  owner: number;
  /**
   * @minLength 0
   * @maxLength 255
   */
  repoUrl: string;
}
