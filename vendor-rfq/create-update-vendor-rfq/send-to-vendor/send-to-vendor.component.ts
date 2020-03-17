import { Component, OnInit } from '@angular/core';
import { GetDataFromApiService } from 'src/app/shared/services/get-data-from-api.service';
import { StateService } from 'src/app/shared/services/state.service';
import { ModalService } from 'src/app/shared/services/modal.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { CommonFunctionService } from 'src/app/shared/services/common-function.service';
import { ServiceForVendorRfqService } from '../../service-for-vendor-rfq.service';

@Component({
  selector: 'app-send-to-vendor',
  templateUrl: './send-to-vendor.component.html',
  styleUrls: ['./send-to-vendor.component.scss']
})
export class SendToVendorComponent implements OnInit {

  constructor(
    private serverService: GetDataFromApiService,
    private state: StateService,
    public modal: ModalService,
    public smartModal: NgxSmartModalService,
    public commonFunctionService: CommonFunctionService,
    public service: ServiceForVendorRfqService
    ) { }

    private _StartServerCall() {
      this.state.progressBarStart();
      this.service.disabledButtonAndField = true;
    }
  
    private _StopServerCall() {
      this.state.progressBarStop();
      this.service.disabledButtonAndField = false;
    }

    sendRfqToVendors = (_Index) => {
      this._StartServerCall();
      return this.serverService
      .post({ request : {
        formId                  : this.service.formId,
        companyId               : this.service.companyDetails["CompanyId"],
        companyLocationId       : this.service.vendorRfqCreate.basicDetails.slctdLocation.companyLocationId,
        rfqId                   : this.service.vendorRfqCreate.basicDetails.rfqId,
        versionNumber           : this.service.vendorRfqCreate.revisionDetails[_Index].versionNumber
      } }
      , "vendorRfqModule/sendRfqToVendors", {
        module: "purchase"
      }).subscribe(data => {
        this._StopServerCall();
        if(data.response){
          this.service.vendorRfqCreate = null;
          this.service.vendorRfqCreate = {...this.service.vendorRfqCreate,...data.response};
          this.service.quotationIndex = _Index;
          this.service.vendorRfqCreate.basicDetails.ifPageNum = 3;
        }
        if(data.errorTitle){
          this.modal.openModal(data.errorTitle,data.errorContent);
        }
      })
    }

    viewProductAndVendorDetails = () =>{
      this.service.prodAndVendorDetailsView = {
        viewProductAndVendorDetails: true,
        versionNumber: this.service.vendorRfqCreate.revisionDetails[this.service.selectedRevisionIndex].versionNumber,
        rfqId: this.service.vendorRfqCreate.basicDetails.rfqId
      }
      this._SetProductDetails();
      this.smartModal.getModal("prodAndVendorModal").open(); 
    }

    private _SetProductDetails = () =>{
      this.service.vendorRfqCreate.productAndVendorDetails.addedProducts = 
        JSON.parse(JSON.stringify(this.service.vendorRfqCreate.revisionDetails[this.service.selectedRevisionIndex].addedProducts));
    }

    goToStep1 = () =>{
      let count = 0;
      let _Length = this.service.vendorRfqCreate.revisionDetails.length;
      for(let i = 0; i<_Length; i++ ){
        if(this.service.vendorRfqCreate.revisionDetails[i].isSelected){
          this.service.selectedRevisionIndex = i;
          count++;
        }
      }
      
      if(count > 0){
        this._SetProductDetails();
        this.service.vendorRfqCreate.basicDetails.ifPageNum = 1;
        this.service.canBeEdited = this.service.vendorRfqCreate.revisionDetails[this.service.selectedRevisionIndex].canBeEdited;
      }else{
        this.modal.openModal('Error','Please select one revision in order to see the details');
      }
    }

    goToStep3 = (_Index) =>{
      this.service.quotationIndex = _Index;
      this.service.vendorRfqCreate.basicDetails.ifPageNum = 3;
    }
  
    quotationDetailsForModal = null;

    showQuotationDetails = _Index =>{
      this.quotationDetailsForModal = JSON.parse(JSON.stringify(this.service.vendorRfqCreate.revisionDetails[_Index]));
      this.smartModal.getModal("quotationDetailsModal").open(); 
    }

    addNewVersion = () =>{
      this.service.prodAndVendorDetailsView.viewProductAndVendorDetails = false;
      this.service.prodAndVendorDetailsView.rfqId = this.service.vendorRfqCreate.basicDetails.rfqId;
      let _LatestVersionIndex = this.commonFunctionService.getObjIndexInArray(this.service.vendorRfqCreate.revisionDetails,'latestVersion',true);
      this.service.vendorRfqCreate.productAndVendorDetails.addedProducts = JSON.parse(JSON.stringify(this.service.vendorRfqCreate.revisionDetails[_LatestVersionIndex].addedProducts));
      this.smartModal.getModal("prodAndVendorModal").open(); 
    }

    selectUnselectRevision = (_Index) =>{
      let _RevisionDetailLength = this.service.vendorRfqCreate.revisionDetails.length;
      let _SlctdIndexValue = this.service.vendorRfqCreate.revisionDetails[_Index].isSelected;
      for(var i = 0; i<_RevisionDetailLength; i++){
        this.service.vendorRfqCreate.revisionDetails[i].isSelected = false;
      }
      this.service.vendorRfqCreate.revisionDetails[_Index].isSelected = _SlctdIndexValue;
    }

  ngOnInit() {
  }

}
