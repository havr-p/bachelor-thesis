import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemConstructorComponent } from './item-constructor.component';

describe('ItemConstructorComponent', () => {
  let component: ItemConstructorComponent;
  let fixture: ComponentFixture<ItemConstructorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemConstructorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ItemConstructorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
