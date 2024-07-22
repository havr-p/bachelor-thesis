import {CreateItemDTO, HistoryAction, ItemDTO, ItemType} from "../../../gen/model";

export type LinkOrComment = {
  linkOrComment: string;
  addedAt: Date;
}

export type RequirementData = {
    level: string;
    name: string;
    description: string;
    links: LinkOrComment[];
}

export type DesignData = {
    level: 'Design';
    name: string;
    description: string;
    links: LinkOrComment[];
}

export type CodeData = {
    level: 'Code';
    name: string;
    description: string;
    links: LinkOrComment[];
}

export type TestData = {
    level: 'Test';
    name: string;
    description: string;
    links: LinkOrComment[];
}

export type RequirementItem = {
    itemType: ItemType.REQUIREMENT;
    data: RequirementData;
} & BaseItem;

export type DesignItem = {
    itemType: ItemType.DESIGN;
    data: DesignData;
} & BaseItem;

export type CodeItem = {
    itemType: ItemType.CODE;
    data: CodeData;
} & BaseItem;

export type TestItem = {
    itemType: ItemType.TEST;
    data: TestData;
} & BaseItem;

export type BaseItem = {
    id: number;
    internalProjectUUID: string;
    projectId: number;
    releaseId?: number;
    status?: string;
    historyAction?: HistoryAction;
};

export type Item = RequirementItem | DesignItem | CodeItem | TestItem;

export function mapGenericModel(itemDTO: ItemDTO): Item {
    switch (itemDTO.itemType) {
        case ItemType.REQUIREMENT:
            return toRequirement(itemDTO);
        case ItemType.DESIGN:
            return toDesign(itemDTO);
        case ItemType.CODE:
            return toCode(itemDTO);
        case ItemType.TEST:
            return toTest(itemDTO);
        default:
            throw new TypeError(`Unsupported type: ${itemDTO.itemType}`);
    }
}

function toRequirement(itemDTO: ItemDTO): Item {
    if (itemDTO.itemType === ItemType.REQUIREMENT) {
        return {
            ...itemDTO,
            data: {
                level: itemDTO.data['level'] || '',
                name: itemDTO.data['name'] || '',
                description: itemDTO.data['description'] || '',
              links: itemDTO.data['links'] ? JSON.parse(itemDTO.data['links']) : []
            }
        } as Item;
    }
    throw new TypeError(`Wrong type provided: ${itemDTO.itemType}`);
}

function toDesign(itemDTO: ItemDTO): Item {
    if (itemDTO.itemType === ItemType.DESIGN) {
        return {
            ...itemDTO,
            data: {
                level: 'Design',
                name: itemDTO.data['name'] || '',
                description: itemDTO.data['description'] || '',
                links: itemDTO.data['links'] ? JSON.parse(itemDTO.data['links']) : []
            }
        } as Item;
    }
    throw new TypeError(`Wrong type provided: ${itemDTO.itemType}`);
}

function toCode(itemDTO: ItemDTO): Item {
    if (itemDTO.itemType === ItemType.CODE) {
        return {
            ...itemDTO,
            data: {
                level: 'Code',
                name: itemDTO.data['name'] || '',
                description: itemDTO.data['description'] || '',
                links: itemDTO.data['links'] ? JSON.parse(itemDTO.data['links']) : []
            }
        } as Item;
    }
    throw new TypeError(`Wrong type provided: ${itemDTO.itemType}`);
}

function toTest(itemDTO: ItemDTO): Item {
    if (itemDTO.itemType === ItemType.TEST) {
        return {
            ...itemDTO,
            data: {
                level: 'Test',
                name: itemDTO.data['name'] || '',
                description: itemDTO.data['description'] || '',
                links: itemDTO.data['links'] ? JSON.parse(itemDTO.data['links']) : []
            }
        } as Item;
    }
    throw new TypeError(`Wrong type provided: ${itemDTO.itemType}`);
}

export function constructCreateItemDTO(source: any): CreateItemDTO {
    const dto: CreateItemDTO = {
        itemType: source.itemType,
        projectId: source.projectId,
        status: source.status,
        data: {}
    };

    const nonDataKeys = ['itemType', 'projectId', 'status', 'links']; // Include 'links' as it's not a string

    // Assign all other keys to the data object if they are strings
    for (const key of Object.keys(source)) {
        if (!nonDataKeys.includes(key)) {
            // Additional check to ensure value is a string, as required by CreateItemDTOData
            if (typeof source[key] === 'string') {
                dto.data[key] = source[key];
            }
        }
    }

    return dto;
}

export function toItemDTO(item: Item): ItemDTO {
    const dto: ItemDTO = {
        ...item,
        data: {},
    };

    const itemData = item.data as Record<string, any>;

    for (const key of Object.keys(itemData)) {
        const value = itemData[key];

        if (Array.isArray(value)) {
            dto.data[key] = JSON.stringify(value);
        } else {
            dto.data[key] = String(value);
        }
    }

    return dto;
}

