import { ClassicPreset, GetSchemes } from 'rete';
import { Connection } from './connection';
import { RequirementNode } from './nodes/requirement.node';
import { SourceNode } from './nodes/SourceNode';

export type NodeProps =
  // | DebugChat
  // | Message
  // | OnMessage
  // | MatchMessage
  RequirementNode | SourceNode;
export type ConnProps = Connection<RequirementNode, RequirementNode>;
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
