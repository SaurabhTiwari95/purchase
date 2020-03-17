import { Injectable } from '@angular/core';
import { CommonFunctionService } from 'src/app/shared/services/common-function.service';
import { GetDataFromApiService } from 'src/app/shared/services/get-data-from-api.service';
import { StateService } from 'src/app/shared/services/state.service';
import * as _moment from 'moment';

const moment = (_moment as any).default ? (_moment as any).default : _moment;


@Injectable({
  providedIn: 'root'
})
export class ManualDrCrServiceService {
  
  constructor(
    private state: StateService,
    private serverService: GetDataFromApiService,
    public commonFunctioService: CommonFunctionService
  ) { }

  companyDetails = this.state.getCompanyDetails();
  formId = '49';
  disabledButtonAndField = false;

  manualDrCrObj = {
    slctdLocation               : undefined,
    slctdLedgerCategory         : undefined,
    slctdVendor                 : undefined,
    slctdReason                 : undefined,
    slctdRemarks                : undefined,
    slctdLedgerForAmount        : undefined,
    slctdLedgerForSaleTax       : undefined,
    slctdLedgerForSurplusCharge : undefined,

    slctdDrCrDate      : moment().format('YYYY-MM-DD'),

    ledgerCategory : [
      { 
        ledgerId  : 1, 
        ledgerName: "Credit Note", 
        ledgerCode: "C" 
      },
      { 
        ledgerId  : 2, 
        ledgerName: "Debit Note", 
        ledgerCode: "D" 
      }
    ],

    amount            : 0,
    saletax           : 0,
    salestaxsurcharge : 0,
    totalamount       : 0, 
  
  }

  calculateTotalAmount=()=>{
    this.manualDrCrObj.totalamount = this.manualDrCrObj.amount + this.manualDrCrObj.saletax + this.manualDrCrObj.salestaxsurcharge;
  }

  _StartServerCall = () => {
    this.state.progressBarStart();
    this.disabledButtonAndField = true
  }

  _EndServerCall = () => {
    this.state.progressBarStop()
    this.disabledButtonAndField = false;
  }

}
