import { Component, OnInit } from '@angular/core';
import { GetDataFromApiService } from 'src/app/shared/services/get-data-from-api.service';
import { StateService } from 'src/app/shared/services/state.service';
import { ModalService } from 'src/app/shared/services/modal.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { CommonFunctionService } from 'src/app/shared/services/common-function.service';
import { ServiceForVendorRfqService } from '../../service-for-vendor-rfq.service';
import { Base64Service } from 'src/app/shared/services/base64.service';

@Component({
  selector: 'app-quotation-and-approval',
  templateUrl: './quotation-and-approval.component.html',
  styleUrls: ['./quotation-and-approval.component.scss']
})
export class QuotationAndApprovalComponent implements OnInit {

  constructor(
    private serverService: GetDataFromApiService,
    private state: StateService,
    public modal: ModalService,
    public smartModal: NgxSmartModalService,
    public commonFunctionService: CommonFunctionService,
    public service: ServiceForVendorRfqService,
    public base64 : Base64Service
    ) { }

    quotationSubmitted = false;

    private _StartServerCall() {
      this.state.progressBarStart();
      this.service.disabledButtonAndField = true;
    }
  
    private _StopServerCall() {
      this.state.progressBarStop();
      this.service.disabledButtonAndField = false;
    }

    handleFileInput(e,_ParentIndex,_ChildIndex){
      this.base64.convertMultipleFiles(e,(data)=>{
        this.service.vendorRfqCreate.revisionDetails[this.service.quotationIndex].quoteDetails[_ParentIndex].productDetails[_ChildIndex].productQuotations = [...data];
      })
     // console.log(this.service.vendorRfqCreate.quoteDetails);
    }

    saveQuotesForRfq = () =>{
      this._StartServerCall();
      return this.serverService
      .post({ request : {
        formId                  : this.service.formId,
        companyId               : this.service.companyDetails["CompanyId"],
        companyLocationId       : this.service.vendorRfqCreate.basicDetails.slctdLocation.companyLocationId,
        rfqId                   : this.service.vendorRfqCreate.basicDetails.rfqId,
        versionNumber           : this.service.vendorRfqCreate.basicDetails.versionNumber,
        quoteDetails            : this.service.vendorRfqCreate.revisionDetails[this.service.quotationIndex].quoteDetails
      } }
      , "vendorRfqModule/saveQuotesForRfq", {
        module: "purchase"
      }).subscribe(data => {
        this._StopServerCall();
        if(data.response){
          this.service.approvalModalReqObj = JSON.parse(JSON.stringify(data.response));
          this.modal.openModal("Successful","Quotation Added Successfully");
          this.smartModal.getModal("rfqApprovalModal").open(); 
          this.service.cancelUpdateMode();
        }
        if(data.errorTitle){
          this.modal.openModal(data.errorTitle,data.errorContent);
        }
      })
    }

    holdVendorRfqCreateDetails = {};
    goToStep2 = () =>{
      this.holdVendorRfqCreateDetails = JSON.parse(JSON.stringify(this.service.vendorRfqCreate));
      this.service.vendorRfqCreate = null;
      this.service.vendorRfqCreate = JSON.parse(JSON.stringify(this.holdVendorRfqCreateDetails));
      this.service.vendorRfqCreate.basicDetails.ifPageNum = 2;
    }

  ngOnInit() {
  }

}
