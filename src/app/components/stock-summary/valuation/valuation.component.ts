import { Component } from '@angular/core';


@Component({
  selector: 'app-valuation',
  templateUrl: './valuation.component.html',
  styleUrls: ['./valuation.component.css']
})
export class ValuationComponent {
//valuation top right
eps: number = 0; // Earnings Per Share (EPS)
growthRate: number = 0; // Expected annual growth rate
grahamValue: number | null = null; // Calculated intrinsic value
errorMessage: string | null = null; // Error message for validation

  //Graham
    // Function to calculate Graham Valuation
    calculateGrahamValuation() {
      this.errorMessage = null; // Clear previous error messages

      // Validate inputs
      if (this.eps <= 0 || this.growthRate < 0) {
        this.errorMessage = 'EPS must be greater than 0, and Growth Rate must be non-negative.';
        this.grahamValue = null;
        return;
      }

      // Graham Valuation Formula: Intrinsic Value = EPS * (8.5 + 2 * Growth Rate)
      this.grahamValue = this.eps * (8.5 + 2 * this.growthRate);
    }

}
