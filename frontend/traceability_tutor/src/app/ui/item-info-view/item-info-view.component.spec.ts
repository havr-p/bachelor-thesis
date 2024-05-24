import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ItemInfoViewComponent} from './item-info-view.component';

describe('NodeInfoViewComponent', () => {
    let component: ItemInfoViewComponent;
    let fixture: ComponentFixture<ItemInfoViewComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ItemInfoViewComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ItemInfoViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
