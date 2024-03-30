import {ClassicPreset, ClassicPreset as Classic, GetSchemes, NodeEditor} from 'rete';
import {Component, HostBinding, Injector, Input} from '@angular/core';
import { Area2D, AreaExtensions, AreaPlugin } from 'rete-area-plugin';

import {
  AngularPlugin,
  AngularArea2D,
  Presets as AngularPresets,
} from 'rete-angular-plugin/17';

import { DataflowEngine, DataflowNode } from 'rete-engine';
import { structures } from 'rete-structures'
import { ChangeDetectorRef} from "@angular/core";
import {Requirement} from "../models/requirement";
import {getColorByLevel} from "../utils";

export class RequirementNode extends ClassicPreset.Node {
   width = 400;
   height = 200;
   backgroundColor: string;
  borderStyle: string;
   requirement: Requirement;
   constructor(requirement: Requirement) {
     super(requirement.name);
     //console.log(requirement);
     this.requirement = requirement;
     this.id = requirement.id;
     this.borderStyle = '2px solid #000000';
     this.backgroundColor = getColorByLevel(requirement.level);
     this.selected = false;
  }


 // execute() {}
 //  data() {
 //    return this.requirement;
 //  }


}

