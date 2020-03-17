import { Component, OnInit } from '@angular/core';
import { StateService } from 'src/app/shared/services/state.service';
import { GetDataFromApiService } from 'src/app/shared/services/get-data-from-api.service';
import { ModalService } from 'src/app/shared/services/modal.service';
import { BankDetailsService } from '../bank-details.service';
import { CommonFunctionService } from 'src/app/shared/services/common-function.service';

@Component({
  selector: 'app-vendor-bank-details-approval-action',
  templateUrl: './vendor-bank-details-approval-action.component.html',
  styleUrls: ['./vendor-bank-details-approval-action.component.scss']
})
export class VendorBankDetailsApprovalActionComponent implements OnInit {

  constructor(
    private state: StateService,
    private api: GetDataFromApiService,
    public modal: ModalService,
    public commonFunctionService: CommonFunctionService,
    public bankDetailsService: BankDetailsService,
  ) { }

  ngOnInit() {
  }

}
