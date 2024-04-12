import { NodeType } from '../types';
import { Requirement } from '../models/requirement';

export interface Node {
  width: number;
  height: number;
  type: NodeType | undefined;
  data: Requirement;
  // | { commitId: string; commitMessage: string; commitDate: Date };
}
