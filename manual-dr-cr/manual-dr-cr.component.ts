import { Component, OnInit } from '@angular/core';
import { ManualDrCrServiceService } from './manual-dr-cr-service.service';
import { CommonFunctionService } from 'src/app/shared/services/common-function.service';
import { GetDataFromApiService } from 'src/app/shared/services/get-data-from-api.service';
import { ModalService } from 'src/app/shared/services/modal.service';
import { Moment } from "moment";
import * as _moment from "moment";
import { DatepickerOptions } from 'ng2-datepicker';

const moment = (_moment as any).default ? (_moment as any).default : _moment;

@Component({
  selector: 'app-manual-dr-cr',
  templateUrl: './manual-dr-cr.component.html',
  styleUrls: ['./manual-dr-cr.component.scss'],
  providers  : [ManualDrCrServiceService],
})
export class ManualDrCrComponent implements OnInit {

  constructor(
    public commonFunctionService: CommonFunctionService,
    public serverService        : GetDataFromApiService,
    public service              : ManualDrCrServiceService,
    public modal                : ModalService,
    ) { }

  locations                 = [];
  vendorDetails             = [];
  ledgerDetailsForDrCrArray = [];



  getAllLocations() {
    let companyId = this.service.companyDetails["CompanyId"];
    let request = { 
      companyId, 
      formId: this.service.formId 
    };
    this.serverService
      .post({ request }, "commonUIfunctionsModule/getLocationsForThisUser", {
        module: "vendor"
      })
      .subscribe(data => {
        if (data["response"]) {
          this.locations = data["response"];
        }
      });
  }

  getAllVendors() {
    return this.serverService
      .post({
        request: {
          formId: this.service.formId,
          companyId: this.service.companyDetails["CompanyId"],
        }
      }
        , "commonUIfunctionsModule/getAllVendors", {
        module: "vendor"
      }).subscribe(data => {
        if (data.response) {
          this.vendorDetails = data.response;
        }
      })
  }

  customSearchFnForVendor(ter, obj) {
    return (
      (obj.vendorId && obj.vendorId.toLowerCase().indexOf(ter.toLowerCase()) != -1) ||
      (obj.vendorName && obj.vendorName.toLowerCase().indexOf(ter.toLowerCase()) != -1)  );
  }
  
  getAllLedgers() {
    if (!this.service.manualDrCrObj.slctdLocation) return;
    this.ledgerDetailsForDrCrArray = [];
    let request = {
      companyLocationId: this.service.manualDrCrObj.slctdLocation.companyLocationId,
      companyId: this.service.companyDetails.CompanyId,
      formId: this.service.formId,
    };
    this.service._StartServerCall;
    this.serverService
      .post({ request }, "mainModule/getAllLedgers", {
        module: "financialStatement"
      })
      .subscribe(data => {

        this.service.disabledButtonAndField = false;
        if (data.response) {
          this.ledgerDetailsForDrCrArray = data.response;
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

  addManualDebitCreditNote=()=>{
    this.service._StartServerCall();
    let companyId = this.service.companyDetails["CompanyId"];
    let companyLocationId = this.service.manualDrCrObj.slctdLocation;
    
    let request = {
      companyId,
      formId       : this.service.formId,
      manualDrCrObj:this.service.manualDrCrObj,
      companyLocationId
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

  openPrintModal = () => {
    window.print();
  }

  resetDependentFieldsOnVendorName = () => {
    this.service.manualDrCrObj.amount            = 0;
    this.service.manualDrCrObj.saletax           = 0;
    this.service.manualDrCrObj.salestaxsurcharge = 0;
    this.service.manualDrCrObj.totalamount       = 0;
    // this.vendorDetails                           = [];
    // this.ledgerDetailsForDrCrArray               = [];
  }

  ngOnInit() {
    this.getAllLocations();
    //this.getAllLedgers();
    this.getAllVendors();  
  }

}
