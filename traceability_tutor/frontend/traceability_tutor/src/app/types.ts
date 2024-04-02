import { GetSchemes } from 'rete';
import { Connection } from './connection';
import { RequirementItem } from './items/requirementItem';

export type NodeProps =
  // | DebugChat
  // | Message
  // | OnMessage
  // | MatchMessage
  RequirementItem;
export type ConnProps = Connection<RequirementItem, RequirementItem>;
// | Connection<MatchMessage, SendMessage>
// | Connection<OnMessage, MatchMessage>;

export type Schemes = GetSchemes<NodeProps, ConnProps>;

export enum Events {
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
