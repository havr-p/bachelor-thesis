import {ItemDataType, ItemType} from '../types';

export interface Item {
  width: number;
  height: number;
  type: ItemType | undefined;
  data: ItemDataType;
}
