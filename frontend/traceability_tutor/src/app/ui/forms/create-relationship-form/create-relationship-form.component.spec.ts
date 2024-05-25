import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRelationshipFormComponent } from './create-relationship-form.component';

describe('CreateRelationshipFormComponent', () => {
  let component: CreateRelationshipFormComponent;
  let fixture: ComponentFixture<CreateRelationshipFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateRelationshipFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateRelationshipFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
