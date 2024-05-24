import {ItemDTO} from "../../../gen/model";

export interface Item extends ItemDTO {
    width: number;
    height: number;
    backgroundColor: string;
    borderStyle: string;
}
