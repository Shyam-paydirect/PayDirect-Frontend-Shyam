import { AfterViewInit, Component, HostListener } from '@angular/core';
import ApexCharts from 'apexcharts';

@Component({
  selector: 'app-financial-analytics',
  templateUrl: './financial-analytics.component.html',
  styleUrls: ['./financial-analytics.component.css'],
})
export class FinancialAnalyticsComponent implements AfterViewInit {
  private chart: ApexCharts | undefined;

  ngAfterViewInit(): void {
    const options = {
      series: [
        {
          name: 'Earnings',
          data: [20, 30, 45, 60, 100, 50, 40, 30, 20, 70, 90, 30], // Sample data for each month
        },
      ],
      chart: {
        type: 'bar',
        height: 200,
      },
      xaxis: {
        categories: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ],
      },
      yaxis: {
        max: Math.max(20, 30, 45, 60, 100, 50, 40, 30, 20, 70, 90, 30) + 20,
        min: 0,
      },
      colors: ['#7366ff', '#8E54E9', '#909090'], // Colors for the chart
      plotOptions: {
        bar: {
          columnWidth: '25%',
          borderRadius: 6,
        },
      },
      dataLabels: {
        enabled: false, // Disable data labels
      },
    };

    const chartContainer = document.querySelector('#chart');
    if (chartContainer) {
      this.chart = new ApexCharts(chartContainer, options);
      this.chart.render();
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    if (this.chart) {
      this.chart.updateOptions({}, false, true); // Force a redraw
    }
  }
}
