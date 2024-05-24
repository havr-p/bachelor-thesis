import {ItemDTO, ItemType} from "../../../gen/model";
import {Requirement} from "./requirement";

function toRequirement(itemDTO: ItemDTO) {
    if (itemDTO.itemType === ItemType.REQUIREMENT) {
        return {
            ...itemDTO,
            data: {
                level: itemDTO.data['level'] || '',
                name: itemDTO.data['name'] || '',
                statement: itemDTO.data['statement'] || ''
            }
        } as Requirement;
    }
    throw new TypeError(`Wrong type provided: ${itemDTO.itemType}`);
}

function toDesign(itemDTO: ItemDTO) {
    return undefined;
}

export function mapGenericModel(itemDTO: ItemDTO) {
    switch (itemDTO.itemType) {
        case ItemType.REQUIREMENT:
            return toRequirement(itemDTO);
        case ItemType.DESIGN:
            return toDesign(itemDTO);
        default:
            throw new TypeError(`Unsupported type: ${itemDTO.itemType}`)
    }
}
