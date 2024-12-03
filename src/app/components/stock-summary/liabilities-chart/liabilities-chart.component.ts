import { Component, Input, OnInit } from '@angular/core';
import { Stock } from './../../../services/http/models/stock.model';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-liabilities-chart',
  templateUrl: './liabilities-chart.component.html',
  styleUrls: ['./liabilities-chart.component.css'],
})
export class LiabilitiesChartComponent implements OnInit {
  @Input() stock: Stock | undefined;

  liabilitiesChart: Chart | undefined;

  ngOnInit(): void {
    this.initializeliabilitiesChart();
  }

  initializeliabilitiesChart(): void {
    if (this.stock?.liabilitiesData) {
      this.liabilitiesChart = new Chart('liabilitiesChart', {
        type: 'bar',
        data: {
          labels: this.stock.liabilitiesData?.map((item) => item.date).reverse(),
          datasets: [
            {
              label: 'Total Liabilities (USD)',
              data: this.stock.liabilitiesData?.map((item) => item.totalLiabilities).reverse(),
              backgroundColor: 'rgba(255, 99, 132, 0.6)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
            },
            {
              label: 'Total Assets (USD)',
              data: this.stock.liabilitiesData?.map((item) => item.totalAssets).reverse(),
              backgroundColor: 'rgba(54, 162, 235, 0.6)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
            },
            {
              label: 'Equity (USD)',
              data: this.stock.liabilitiesData?.map((item) => item.totalEquity).reverse(),
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
            {
              label: 'Total Debt (USD)',
              data: this.stock.liabilitiesData?.map((item) => item.totalDebt).reverse(),
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
              text: 'Overview of Liabilities, Assets, Equity, and Total Debt',
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
