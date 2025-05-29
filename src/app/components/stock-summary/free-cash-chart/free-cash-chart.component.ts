import { Component, Input, OnInit } from '@angular/core';
import { StockModel } from './../../../services/http/models/stock.model';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-free-cash-chart',
  templateUrl: './free-cash-chart.component.html',
  styleUrls: ['./free-cash-chart.component.css'],
})
export class FreeCashChartComponent implements OnInit {
  @Input() stock: StockModel | undefined;

  dividendsVsFcfChart: Chart | undefined;

  ngOnInit(): void {
    this.initializeDividendsVsFcfChart();
  }

  initializeDividendsVsFcfChart(): void {
    if (this.stock?.cashFlowData) {
      this.dividendsVsFcfChart = new Chart('dividendsVsFcfChart', {
        type: 'bar',
        data: {
          labels: this.stock.cashFlowData?.map((item) => item.date).reverse(),
          datasets: [
            {
              label: 'Dividends Paid (USD)',
              data: this.stock.cashFlowData?.map((item) => -item.dividendsPaid).reverse(),
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
            {
              label: 'Free Cash Flow (USD)',
              data: this.stock.cashFlowData?.map((item) => item.freeCashFlow).reverse(),
              backgroundColor: 'rgba(153, 102, 255, 0.6)',
              borderColor: 'rgba(153, 102, 255, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Comparison of Dividends Paid and Free Cash Flow',
            },
          },
          scales: {
            x: {
              beginAtZero: true,
            },
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }
  }
}
