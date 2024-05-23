import {ItemDTO} from "../../../gen/model";


export interface Requirement extends ItemDTO{
  data: RequirementData;
}

export type RequirementData = {
  level: string;
  name: string;
  statement: string;
}
