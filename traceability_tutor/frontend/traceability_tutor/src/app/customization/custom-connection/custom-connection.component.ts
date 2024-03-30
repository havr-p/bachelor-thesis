import { Component, Input } from "@angular/core";
import { ClassicPreset } from "rete";
import {RequirementNode} from "../../nodes/requirement.node";

@Component({
  selector: "connection",
  template: `
    <svg data-testid="connection">
      <path [attr.d]="path" />
    </svg>
  `,
  styleUrls: ["./custom-connection.component.sass"]
})
export class CustomConnectionComponent {
  @Input() data!: ClassicPreset.Connection<
    RequirementNode,
    RequirementNode
  >;
  @Input() start: any;
  @Input() end: any;
  @Input() path!: string;
}
