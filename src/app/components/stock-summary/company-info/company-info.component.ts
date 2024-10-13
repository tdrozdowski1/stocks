import {Component, Input, OnInit} from '@angular/core';
import {CompanyInfo} from "../../../services/http/company-info.service";

@Component({
  selector: 'app-company-info',
  templateUrl: './company-info.component.html',
  styleUrls: ['./company-info.component.css']
})
export class CompanyInfoComponent implements OnInit {
  @Input() companyInfo: CompanyInfo[] | undefined;

  constructor() { }

  ngOnInit(): void {
  }

}
