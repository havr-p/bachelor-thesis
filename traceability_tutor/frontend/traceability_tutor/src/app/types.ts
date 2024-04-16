import { GetSchemes } from 'rete';
import { Connection } from './connection';
import { RequirementItem } from './items/requirement-item';

export type ItemProps =
  // | DebugChat
  // | Message
  // | OnMessage
  // | MatchMessage
  RequirementItem;
export type ConnProps = Connection<RequirementItem, RequirementItem>;
// | Connection<MatchMessage, SendMessage>
// | Connection<OnMessage, MatchMessage>;

export type Schemes = GetSchemes<ItemProps, ConnProps>;

export enum EditorEvent {
  ADD = 'add',
  REMOVE = 'remove',
  EDIT = 'edit',
  SELECT = 'select',
  LOAD = 'load',
  DEMO = 'demo',
  EXPORT = 'export',
  IMPORT = 'import',
  CLEAR = 'clear',
}

export enum ItemType {
  REQUIREMENT = 'Requirement',
  SOURCE = 'Source',
  TEST = 'Test',
}
