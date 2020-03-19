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

  locations                 = [];  
  vendorDetails             = [
    {
      vendorId : null,
    }
  ];
  ledgerDetailsForDrCrArray = [];

  manualDrCrObj = {
    slctdLocation               : undefined,
    slctdLedgerCategory         : undefined,
    slctdVendor                 : undefined,
    slctdReason                 : undefined,
    slctdRemarks                : undefined,
    slctdLedgerForAmount        : undefined,
    /*Central Goods and Services Tax*/
    cgst              : 0,
    /*State           -sgst*/
    sgst              : 0,
    /*interState      -igst*/
    igst              : 0,
    /*Union Territory -utgst*/  
    utgst             : 0,
    amount            : 0,
    totalamount       : 0,

  }

  slctdDrCrDate     = moment().format('YYYY-MM-DD');

  ledgerCategory = [
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
  ]

  calculateTotalAmount=()=>{

    this.manualDrCrObj.totalamount = this.manualDrCrObj.amount + this.manualDrCrObj.cgst + this.manualDrCrObj.sgst;

    // In case of InterState Transactions
    // this.manualDrCrObj.totalamount = this.manualDrCrObj.amount + this.manualDrCrObj.igst

    // In case of Union Territory Transactions
    // this.manualDrCrObj.totalamount = this.manualDrCrObj.amount + this.manualDrCrObj.utgst

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