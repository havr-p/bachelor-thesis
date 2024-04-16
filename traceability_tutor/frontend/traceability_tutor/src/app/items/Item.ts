import { ItemType } from '../types';
import { Requirement } from '../models/requirement';

export interface Item {
  width: number;
  height: number;
  type: ItemType | undefined;
  requirement: Requirement;
  // | { commitId: string; commitMessage: string; commitDate: Date };
}
