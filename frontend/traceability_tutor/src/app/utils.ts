import {ClassicPreset} from 'rete';
import {ActionSocket, TextSocket} from './sockets';

type Sockets = ActionSocket | TextSocket;
type Input = ClassicPreset.Input<Sockets>;
type Output = ClassicPreset.Output<Sockets>;

// export function getConnectionSockets(
//   editor: NodeEditor<Schemes>,
//   connection: Schemes["Connection"]
// ) {
//   const source = editor.getNode(connection.source);
//   const target = editor.getNode(connection.target);
//
//   const output =
//     source &&
//     (source.outputs as Record<string, Input>)[connection.sourceOutput];
//   const input =
//     target && (target.inputs as Record<string, Output>)[connection.targetInput];
//
//   return {
//     source: output?.socket,
//     target: input?.socket
//   };
// }

export function getColorByLevel(level: string) {
  //console.log("i am here, level is: ", level);
  switch (level.toLowerCase()) {
    case 'business':
      return '#fcf6bd';
    case 'stakeholder':
      return '#ff99c8';
    case 'solution':
      return '#d0f4de';
    case '4':
      return '#a9def9';
    case '5':
      return '#e4c1f9';
    default:
      return '#000000';
  }
}

export function isArray(value: any): value is any[] {
  return Array.isArray(value);
}
