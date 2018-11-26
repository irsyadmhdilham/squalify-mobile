import { Component } from '@angular/core';

@Component({
  selector: 'sales-summary',
  templateUrl: 'sales-summary.html'
})
export class SalesSummaryComponent {

  today = { sales: 40000, income: 23233 };
  week = { sales: 40000, income: 23233 };
  month = { sales: 40000, income: 23233 };
  year = { sales: 40000, income: 23233 };

  constructor() { }

}
