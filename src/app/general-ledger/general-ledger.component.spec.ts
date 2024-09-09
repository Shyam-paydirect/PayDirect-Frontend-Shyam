import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralLedgerComponent } from './general-ledger.component';

describe('GeneralLedgerComponent', () => {
  let component: GeneralLedgerComponent;
  let fixture: ComponentFixture<GeneralLedgerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GeneralLedgerComponent]
    });
    fixture = TestBed.createComponent(GeneralLedgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
