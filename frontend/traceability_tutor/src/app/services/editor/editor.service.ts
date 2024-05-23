import { Injectable } from '@angular/core';
import {ClassicPreset, NodeEditor} from "rete";
import {Schemes} from "../../types";
import {ItemDTO} from "../../../../gen/model";
import {mapGenericModel} from "../../models/itemMapper";
import {RequirementItem} from "../../items/requirement-item";
const socket = new ClassicPreset.Socket('socket');
@Injectable({
  providedIn: 'root'
})
export class EditorService {
  //editor!: NodeEditor<Schemes>;
  constructor() {
   // this.editor = editor;
  }

  async addNode(node: any) {
    node.addOutput(node.id, new ClassicPreset.Output(socket));
    node.addInput(node.id, new ClassicPreset.Input(socket));
    //await this.editor.addNode(node);
  }

  async addItems(items: ItemDTO[]) {
    for (const item of items) {
      try {
        const data = mapGenericModel(item);
        await this.addNode(new RequirementItem(data!));
      } catch (error) {

      }
    }
  }
}
