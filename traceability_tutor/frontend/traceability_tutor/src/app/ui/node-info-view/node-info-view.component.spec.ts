import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeInfoViewComponent } from './node-info-view.component';

describe('NodeInfoViewComponent', () => {
  let component: NodeInfoViewComponent;
  let fixture: ComponentFixture<NodeInfoViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NodeInfoViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NodeInfoViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
