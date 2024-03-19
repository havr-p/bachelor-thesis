import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequirementNodeComponent } from './requirement-node.component';

describe('RequirementNodeComponent', () => {
  let component: RequirementNodeComponent;
  let fixture: ComponentFixture<RequirementNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RequirementNodeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RequirementNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
