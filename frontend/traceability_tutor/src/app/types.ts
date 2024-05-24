import {GetSchemes} from 'rete';
import {Connection} from './connection';
import {ItemNode} from './items/item-node';
import {Requirement} from './models/requirement';

export type ItemProps =
// | DebugChat
// | Message
// | OnMessage
// | MatchMessage
  ItemNode;
export type ConnProps = Connection<ItemNode, ItemNode>;
// | Connection<MatchMessage, SendMessage>
// | Connection<OnMessage, MatchMessage>;

export type Schemes = GetSchemes<ItemProps, ConnProps>;

export enum EditorEventType {
  ADD = 'add',
  REMOVE = 'remove',
  EDIT = 'edit',
  SELECT_ITEM = 'select item',
  SELECT_RELATIONSHIP = 'select relationship',
  LOAD = 'load',
  DEMO = 'demo',
  EXPORT = 'export',
  IMPORT = 'import',
  CLEAR = 'clear',
  TO_PROJECTS_MENU = 'to projects menu',
  SAVE_ITERATION ='save iteration',
}

export enum ProjectEventType {
  CREATE = 'create',
  REMOVE = 'remove',
  EDIT = 'edit',
  SELECT = 'select',
  SETUP_DEMO = "setup demo",
}

export enum ItemViewEventType {
  EDIT = 'edit',
}

export enum EventSource {
  EDITOR = 'editor',
  ITEM_VIEW = 'item view',
  PROJECT_MENU = 'project menu'
}

export abstract class BaseEvent<S extends EventSource, U> {
  protected constructor(
    public source: S,
    public type: U,
    public data: any,
  ) {
  }
}

export class EditorEvent extends BaseEvent<
  EventSource.EDITOR,
  EditorEventType
> {
  constructor(type: EditorEventType, data: any) {
    super(EventSource.EDITOR, type, data);
  }
}

export class ItemViewEvent extends BaseEvent<
  EventSource.ITEM_VIEW,
  ItemViewEventType
> {
  constructor(type: ItemViewEventType, data: any) {
    super(EventSource.ITEM_VIEW, type, data);
  }
}

export class ProjectEvent extends BaseEvent<
  EventSource.PROJECT_MENU,
  ProjectEventType
> {
  constructor(type: ProjectEventType, data: any) {
    super(EventSource.PROJECT_MENU, type, data);
  }
}


export type ItemDataType = Requirement; // | Source
