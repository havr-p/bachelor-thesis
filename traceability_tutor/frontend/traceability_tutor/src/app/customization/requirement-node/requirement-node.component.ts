import {
  Component,
  Input,
  HostBinding,
  ChangeDetectorRef,
  OnChanges, SimpleChanges, HostListener
} from "@angular/core";
import { ClassicPreset } from "rete";
import {Requirement} from "../../models/requirement";
import {RequirementNode} from "../../nodes/requirement.node";

@Component({
  templateUrl: "./requirement-node.component.html",
  styleUrls: ["./requirement-node.component.sass"],
  host: {
    "data-testid": "node"
  }
})
export class RequirementNodeComponent implements OnChanges {
  @Input() data!: RequirementNode;
  @Input() emit!: (data: any) => void;
  @Input() rendered!: () => void;

  seed = 0;

  @HostBinding("class.selected") get selected() {
   // console.log(this.data.selected, this.data.label);
    return this.data.selected;
  }

  @HostListener('click') onClick() {
    this.data.selected = !this.data.selected;

  }


  @HostBinding('style.background-color') backgroundColor: string = '#fff';
  @HostBinding('style.border') get borderColorStyle(): string {
  return this.data.selected ? '4px solid red' : this.data.borderStyle;
}

  constructor(private cdr: ChangeDetectorRef) {
    this.cdr.detach();
  }

  ngOnChanges(changes:SimpleChanges): void {
     if (changes['data']) {
       this.backgroundColor = this.data.backgroundColor || '#fff';
     }
    this.cdr.detectChanges();
    requestAnimationFrame(() => this.rendered());
    this.seed++; // force render sockets
  }

  sortByIndex(a: any, b: any) {
    const ai = a.value.index || 0;
    const bi = b.value.index || 0;

    return ai - bi;
  }
}


