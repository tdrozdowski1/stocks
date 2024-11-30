import { Component } from '@angular/core';

@Component({
  selector: 'app-multiples',
  templateUrl: './multiples.component.html',
  styleUrls: ['./multiples.component.css'],
})
export class MultiplesComponent {
  eps: number = 0; // Earnings Per Share
  peerPE: number = 0; // Peer P/E Ratio
  multiplesValue: number | null = null; // Calculated intrinsic value
  errorMessage: string | null = null; // Error message for validation

  // Function to calculate Multiples Valuation
  calculateMultiplesValuation() {
    this.errorMessage = null; // Clear previous errors

    // Validate inputs
    if (this.eps <= 0 || this.peerPE <= 0) {
      this.errorMessage = 'EPS and Peer P/E Ratio must be greater than 0.';
      this.multiplesValue = null;
      return;
    }

    // Formula: Intrinsic Value = EPS × Peer P/E Ratio
    this.multiplesValue = this.eps * this.peerPE;
  }
}
