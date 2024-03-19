// import {
//   Component,
//   Input,
//   HostBinding,
//   ChangeDetectorRef,
//   OnChanges
// } from "@angular/core";
// import { ClassicPreset } from "rete";
// import {SharedModule} from "../../../shared/shared.module";
// import {KeyValuePipe} from "@angular/common";
// import {ReteModule} from "rete-angular-plugin";
//
// @Component({
//   templateUrl: "./requirement-node.component.html",
//   styleUrls: ["./requirement-node.component.scss"],
//   host: {
//     "data-testid": "node"
//   }
// })
// export class RequirementNodeComponent implements OnChanges {
//   @Input() data!: ClassicPreset.Node;
//   @Input() emit!: (data: any) => void;
//   @Input() rendered!: () => void;
//
//   seed = 0;
//
//   @HostBinding("class.selected") get selected() {
//     return this.data.selected;
//   }
//
//   constructor(private cdr: ChangeDetectorRef) {
//     this.cdr.detach();
//   }
//
//   ngOnChanges(): void {
//     this.cdr.detectChanges();
//     requestAnimationFrame(() => this.rendered());
//     this.seed++; // force render sockets
//   }
//
//   sortByIndex(a: any, b: any) {
//     const ai = a.value.index || 0;
//     const bi = b.value.index || 0;
//
//     return ai - bi;
//   }
// }
