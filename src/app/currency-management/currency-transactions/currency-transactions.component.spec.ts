import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencyTransactionsComponent } from './currency-transactions.component';

describe('CurrencyTransactionsComponent', () => {
  let component: CurrencyTransactionsComponent;
  let fixture: ComponentFixture<CurrencyTransactionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CurrencyTransactionsComponent]
    });
    fixture = TestBed.createComponent(CurrencyTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
