import { Component, OnInit } from '@angular/core';
import { StateService } from 'src/app/shared/services/state.service';
import { GetDataFromApiService } from 'src/app/shared/services/get-data-from-api.service';
import { ModalService } from 'src/app/shared/services/modal.service';
import { CommonFunctionService } from 'src/app/shared/services/common-function.service';
import { BankDetailsService } from '../bank-details.service';

@Component({
  selector: 'app-bank-details-approval',
  templateUrl: './bank-details-approval.component.html',
  styleUrls: ['./bank-details-approval.component.scss']
})
export class BankDetailsApprovalComponent implements OnInit {

  vendorApprovalTypeArray = [
    {
      vendorApprovalTypeId: 1,
      vendorApprovalTypeName: "All vendor bank details approval request"
    },
    {
      vendorApprovalTypeId: 2,
      vendorApprovalTypeName: "Vendor bank details approval for me"
    },
    {
      vendorApprovalTypeId: 3,
      vendorApprovalTypeName: "Vendor bank details approved by me"
    },
  ];

  constructor(
    private state: StateService,
    private api: GetDataFromApiService,
    public modal: ModalService,
    public commonFunctionService: CommonFunctionService,
    public bankDetailsService: BankDetailsService,
  ) { }

  ngOnInit() {
    this.bankDetailsService.vendorBankDetailsObject.slctdWhatYouWantToSee = null;
  }

}
