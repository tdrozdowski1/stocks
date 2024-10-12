import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {Chart, registerables} from "chart.js";
import {FinancialDataService} from "../../services/financial-data.service";

@Component({
  selector: 'app-stock-chart',
  templateUrl: './stock-chart.component.html',
  styleUrls: ['./stock-chart.component.css']
})
export class StockChartComponent implements OnChanges {
  @Input() stockSymbol!: string; // Pass the stock symbol as input
  chart: Chart | undefined;
  chartData: number[] = [];
  chartLabels: string[] = [];

  constructor(private financialDataService: FinancialDataService) {
    Chart.register(...registerables);
  }

  ngOnChanges(): void {
    if (this.stockSymbol) {
      this.fetchStockPerformanceData();
    }
  }

  fetchStockPerformanceData() {
    this.financialDataService.getStockPerformance(this.stockSymbol).subscribe((data: any) => {
      const historicalData = data.historical;
      this.chartData = historicalData.map((item: any) => item.close).reverse(); // Get closing prices
      this.chartLabels = historicalData.map((item: any) => item.date).reverse(); // Get corresponding dates
      this.createChart();
    });
  }

  createChart() {
    if (this.chart) {
      this.chart.destroy(); // Destroy previous chart instance
    }

    this.chart = new Chart('stockPerformanceChart', {
      type: 'line',
      data: {
        labels: this.chartLabels,
        datasets: [{
          label: this.stockSymbol,
          data: this.chartData,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true,
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Date'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Price'
            }
          }
        }
      }
    });
  }

}
