// import { Component, Input, OnChanges, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
// import { Connection } from '../../connection';
// import { NgStyle } from '@angular/common';
// import { ItemProps } from '../../types';
//
// @Component({
//   selector: 'app-labeled-connection',
//   templateUrl: './labeled-connection.component.html',
//   styleUrls: ['./labeled-connection.component.scss'],
//   standalone: true,
//   imports: [
//     NgStyle
//   ]
// })
// export class LabeledConnectionComponent implements OnChanges, AfterViewInit {
//   @Input() data!: Connection<ItemProps, ItemProps>;
//   @Input() styles?: () => any;
//   @ViewChild('svg') connection!: ElementRef<SVGElement>;
//   @ViewChild('menu') menu!: ElementRef<HTMLDivElement>;
//
//   path: string | null = null;
//
//   constructor() {}
//
//   ngAfterViewInit() {
//     this.updatePath();
//     timer(0).subscribe(() => {
//       this.positionMenu();
//     });
//   }
//
//   ngOnChanges() {
//     this.updatePath();
//   }
//
//   updatePath() {
//     const pathData = this.generatePath();
//     if (pathData) {
//       this.path = pathData;
//     }
//   }
//
//   generatePath(): string | null {
//     if (!this.data.relationshipData. || !this.data.end) {
//       return null;
//     }
//
//     const { x: x1, y: y1 } = this.data.start;
//     const { x: x2, y: y2 } = this.data.end;
//
//     // Simple curved path generation
//     const controlPointX = (x1 + x2) / 2;
//     const controlPointY = Math.min(y1, y2) - Math.abs(x1 - x2) / 2;
//
//     return `M ${x1},${y1} Q ${controlPointX},${controlPointY} ${x2},${y2}`;
//   }
//
//   getTotalLength(): number {
//     return this.connection.nativeElement.querySelector('path')!.getTotalLength();
//   }
//
//   getPointAtLength(length: number): DOMPoint {
//     return this.connection.nativeElement.querySelector('path')!.getPointAtLength(length);
//   }
//
//   getConnectionLabelPosition(textLength: number, position: 'start' | 'end' | 'center' = 'center'): DOMPoint {
//     const length = this.getTotalLength();
//     const width = textLength * 12;
//     return position === 'center'
//         ? this.getPointAtLength(length / 2)
//         : this.getPointAtLength((position === 'start' ? 0 : length) + (position === 'end' ? -1 : 1) * (width / 2 + 20));
//   }
//
//   positionMenu(): void {
//     const path = this.connection.nativeElement.querySelector('path');
//     if (path) {
//       const pathTotalLength = path.getTotalLength();
//       const point = path.getPointAtLength(pathTotalLength / 2);
//       this.menu.nativeElement.style.transform = `translate(${point.x}px, ${point.y}px)`;
//     }
//   }
// }
