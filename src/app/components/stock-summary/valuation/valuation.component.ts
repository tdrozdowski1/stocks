import { Component } from '@angular/core';


@Component({
  selector: 'app-valuation',
  templateUrl: './valuation.component.html',
  styleUrls: ['./valuation.component.css']
})
export class ValuationComponent {
  isVisible: boolean = true; // Controls the visibility of the valuation grid

  // Toggle the visibility of the valuation section
  toggleVisibility() {
    this.isVisible = !this.isVisible;
  }
}
