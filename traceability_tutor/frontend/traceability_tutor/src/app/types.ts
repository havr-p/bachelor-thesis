import { GetSchemes } from 'rete';
import { Connection } from './connection';
import { RequirementItem } from './nodes/requirementItem';

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
