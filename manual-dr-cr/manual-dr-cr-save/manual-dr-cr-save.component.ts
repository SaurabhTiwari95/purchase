import { Component, OnInit } from '@angular/core';
import { ModalService } from 'src/app/shared/services/modal.service';
import { ManualDrCrServiceService } from '../manual-dr-cr-service.service';
import { GetDataFromApiService } from 'src/app/shared/services/get-data-from-api.service';
import { CommonFunctionService } from 'src/app/shared/services/common-function.service';

@Component({
  selector: 'app-manual-dr-cr-save',
  templateUrl: './manual-dr-cr-save.component.html',
  styleUrls: ['./manual-dr-cr-save.component.scss'],

})
export class ManualDrCrSaveComponent implements OnInit {

  constructor(
    public commonFunctionService: CommonFunctionService,
    public serverService        : GetDataFromApiService,
    public service              : ManualDrCrServiceService,
    public modal                : ModalService,
  ) { }


  addManualDebitCreditNote=()=>{
    this.service._StartServerCall();
    let companyId = this.service.companyDetails["CompanyId"];
    let companyLocationId = this.service.manualDrCrObj.slctdLocation.companyLocationId;
    
    let request = {
      companyId,
      companyLocationId ,
      formId       : this.service.formId,
      drCrdate     :new Date(this.service.slctdDrCrDate).getFullYear() 
      + '-' + (new Date(this.service.slctdDrCrDate).getMonth() + 1) 
      + '-' + new Date(this.service.slctdDrCrDate).getDate(),
      manualDrCrObj:this.service.manualDrCrObj,
    };
    this.serverService.post({ request },"manualDebitCreditModule/addManualDebitCreditNote",{
      module: "purchase"
    })
    .subscribe(data =>{
      this.service._EndServerCall();
      if (data.status == 'success') {
        this.commonFunctionService.simpleSweetAlert(
          "Successful",
          data.response
        );
        //this.service.resetData();
      }
      if (data.errorTitle) {
        this.commonFunctionService.simpleSweetAlert(
          data.errorTitle,
          data.errorContent,
          "danger"
        );
      }
    }) 
  }

  getAllLedgers() {
    if (!this.service.manualDrCrObj.slctdLocation) return;
    this.service.ledgerDetailsForDrCrArray = [];
    let request = {
      companyLocationId: this.service.manualDrCrObj.slctdLocation.companyLocationId,
      companyId: this.service.companyDetails.CompanyId,
      formId: this.service.formId,
    };
    this.service._StartServerCall();
    this.serverService
      .post({ request }, "mainModule/getAllLedgers", {
        module: "financialStatement"
      })
      .subscribe(data => {

        this.service._EndServerCall(); 
        if (data.response) {
          this.service.ledgerDetailsForDrCrArray = data.response;
          if (data.response.length == 0) {
            this.modal.openModal(
              "No Data Found!", "No employee details found for selected location!"
            );
          }
        }
   //     this.getAllLedgers();
        if (data.errorCode) {
          this.modal.openModal(
            data.errorTitle,
            data.errorContent
          );
        }
      });
  }

  getGstTypesForSlctdCust = () => {
    this.service._StartServerCall
    let companyId         = this.service.companyDetails["CompanyId"];
    let companyLocationId = this.service.manualDrCrObj.slctdLocation.companyLocationId;
    let custId            = this.service.manualDrCrObj.slctdVendor.vendorId;  

    let request = {
      companyId,
      companyLocationId,
      formId : this.service.formId,
      custId,
    };
    this.serverService.post({ request },"mainModule/getGstTypesForSlctdCust",{
      module : "billing"
    }).subscribe(data =>{
      this.service._EndServerCall();
    })
    }

    resetDetailsDependantOnVendorName=() =>{
      this.service.manualDrCrObj.amount              = 0;
      // this.service.manualDrCrObj.saletax          = 0;
      // this.service.manualDrCrObj.salestaxsurcharge= 0;
      this.service.manualDrCrObj.cgst                = 0;
      this.service.manualDrCrObj.sgst                = 0;
      this.service.manualDrCrObj.igst                = 0;
      this.service.manualDrCrObj.utgst               = 0;
      this.service.manualDrCrObj.totalamount         = 0;
      this.service.ledgerDetailsForDrCrArray         = [];
      this.service.manualDrCrObj.slctdLedgerForAmount=null;
      // this.service.manualDrCrObj.slctdLedgerForSaleTax = null; 
      // this.service.manualDrCrObj.slctdLedgerForSurplusCharge =null;
      this.getAllLedgers();
    }

    resetDetailsDependantOnLedgerCategory=() => {
      this.service.manualDrCrObj.slctdVendor = null;
      this.service.slctdDrCrDate = null;
      this.resetDetailsDependantOnVendorName();
    }

  ngOnInit() {
  }

}
