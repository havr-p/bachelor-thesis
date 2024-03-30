import { GetSchemes } from 'rete';
import { Connection } from './connection';
import { RequirementNode } from './nodes/requirement.node';

export type NodeProps =
  // | DebugChat
  // | Message
  // | OnMessage
  // | MatchMessage
  RequirementNode;
export type ConnProps = Connection<RequirementNode, RequirementNode>;
// | Connection<MatchMessage, SendMessage>
// | Connection<OnMessage, MatchMessage>;

export type Schemes = GetSchemes<NodeProps, ConnProps>;
