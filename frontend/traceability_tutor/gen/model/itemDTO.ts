/**
 * Generated by orval v6.29.1 🍺
 * Do not edit manually.
 * traceability-tutor
 */
import type { ItemDTOData } from './itemDTOData';
import type { HistoryAction } from './historyAction';
import type { ItemType } from './itemType';

export interface ItemDTO {
  data: ItemDTOData;
  historyAction?: HistoryAction;
  id?: number;
  itemType: ItemType;
  /**
   * @minLength 0
   * @maxLength 255
   */
  name: string;
  project: number;
  projectInternalUid: string;
  release?: number;
  /**
   * @minLength 0
   * @maxLength 255
   */
  status?: string;
}
