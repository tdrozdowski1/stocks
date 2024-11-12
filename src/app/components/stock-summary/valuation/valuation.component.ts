import { Component } from '@angular/core';


@Component({
  selector: 'app-valuation',
  templateUrl: './valuation.component.html',
  styleUrls: ['./valuation.component.css']
})
export class ValuationComponent {
//valuation top left
fcf: number = 0; // Free Cash Flow (FCF)
growthRate: number = 0; // Expected growth rate
discountRate: number = 0; // Discount rate
dcfValue: number | null = null; // To store the calculated DCF value
errorMessage: string | null = null; // To handle error messages

  // Function to calculate DCF value
  calculateDCF() {
    this.errorMessage = null; // Clear previous error messages

    // Validate inputs
    if (this.fcf <= 0 || this.growthRate <= 0 || this.discountRate <= 0) {
      this.errorMessage = "All values must be greater than 0.";
      this.dcfValue = null;
      return;
    }

    if (this.discountRate <= this.growthRate) {
      this.errorMessage = "Discount rate must be greater than the growth rate.";
      this.dcfValue = null;
      return;
    }

    // DCF Calculation: DCF = FCF * (1 + Growth Rate) / (Discount Rate - Growth Rate)
    const growthRateDecimal = this.growthRate / 100;
    const discountRateDecimal = this.discountRate / 100;

    this.dcfValue = this.fcf * (1 + growthRateDecimal) / (discountRateDecimal - growthRateDecimal);
  }

}
