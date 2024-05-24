import {ItemDTO} from "../../../gen/model";

export interface Design extends ItemDTO{
    data: DesignData;
}

export type DesignData = {
    level: 'DESIGN';
    name: string;
    link: string;
}
