import { Component } from '@angular/core';

@Component({
  selector: 'app-dividend',
  templateUrl: './dividend.component.html',
  styleUrls: ['./dividend.component.css']
})
export class DividendComponent {
  dividend: number = 0; // Annual dividend (D)
  requiredRate: number = 0; // Required rate of return (r %)
  growthRate: number = 0; // Dividend growth rate (g %)
  ddmValue: number | null = null; // Calculated intrinsic value
  errorMessage: string | null = null; // Error message for validation

    // Function to calculate DDM Valuation
    calculateDDMValuation() {
      this.errorMessage = null; // Clear previous error messages

      // Validate inputs
      if (this.dividend <= 0 || this.requiredRate <= 0 || this.growthRate < 0) {
        this.errorMessage =
          'Dividend and required rate of return must be greater than 0. Growth rate must be non-negative.';
        this.ddmValue = null;
        return;
      }

      const requiredRateDecimal = this.requiredRate / 100;
      const growthRateDecimal = this.growthRate / 100;

      if (requiredRateDecimal <= growthRateDecimal) {
        this.errorMessage =
          'Required rate of return must be greater than the growth rate.';
        this.ddmValue = null;
        return;
      }

      // DDM Formula: Intrinsic Value = Dividend / (r - g)
      this.ddmValue =
        this.dividend / (requiredRateDecimal - growthRateDecimal);
    }
}
