import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CompanyInfo } from '../../../services/http/company-info.service';

@Component({
  selector: 'app-company-info',
  templateUrl: './company-info.component.html',
  styleUrls: ['./company-info.component.css'],
})
export class CompanyInfoComponent implements OnChanges {
  @Input() companyInfo: CompanyInfo[] | undefined;
  processedCompanyInfo: (CompanyInfo & { revenueChange: 'green' | 'red' | 'inherit' })[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['companyInfo'] && this.companyInfo) {
      this.processedCompanyInfo = this.companyInfo.map((info, index, arr) => {
        const previous = arr[index + 1];
        const revenueChange =
          index >= 0 && previous
            ? info.revenuePerShare > previous.revenuePerShare
              ? 'green'
              : info.revenuePerShare < previous.revenuePerShare
                ? 'red'
                : 'inherit'
            : 'inherit';
        return {
          ...info,
          revenueChange,
        };
      });
    }
  }
}
