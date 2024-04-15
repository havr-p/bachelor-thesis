import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TraceabilityEditorComponent } from './traceability-editor.component';

describe('TraceabilityEditorComponent', () => {
  let component: TraceabilityEditorComponent;
  let fixture: ComponentFixture<TraceabilityEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TraceabilityEditorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TraceabilityEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
