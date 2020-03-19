import { Component, OnInit } from '@angular/core';
import { StateService } from 'src/app/shared/services/state.service';
import { GetDataFromApiService } from 'src/app/shared/services/get-data-from-api.service';
import { ModalService } from 'src/app/shared/services/modal.service';
import { CommonFunctionService } from 'src/app/shared/services/common-function.service';
import { BankDetailsService } from '../bank-details.service';

@Component({
  selector: 'app-vendor-bank-details-history',
  templateUrl: './vendor-bank-details-history.component.html',
  styleUrls: ['./vendor-bank-details-history.component.scss']
})
export class VendorBankDetailsHistoryComponent implements OnInit {

  constructor(
    private state: StateService,
    private api: GetDataFromApiService,
    public modal: ModalService,
    public commonFunctionService: CommonFunctionService,
    public bankDetailsService: BankDetailsService,
  ) { }

  ngOnInit() {
    
  }

  updateBankDetails = () =>{
    this.bankDetailsService.toUpdateBankDetails = true;  
    $("#addBankClicked").removeClass("create-clicked");
    this.bankDetailsService.showBankHistory = false;    
  }

}
