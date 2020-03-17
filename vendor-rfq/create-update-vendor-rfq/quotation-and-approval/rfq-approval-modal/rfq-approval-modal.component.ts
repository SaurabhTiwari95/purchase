import { Component, OnInit } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { StateService } from 'src/app/shared/services/state.service';
import { ModalService } from 'src/app/shared/services/modal.service';
import { GetDataFromApiService } from 'src/app/shared/services/get-data-from-api.service';
import { Base64Service } from 'src/app/shared/services/base64.service';
import { ServiceForVendorRfqService } from '../../../service-for-vendor-rfq.service';

@Component({
  selector: 'app-rfq-approval-modal',
  templateUrl: './rfq-approval-modal.component.html',
  styleUrls: ['./rfq-approval-modal.component.scss']
})
export class RfqApprovalModalComponent implements OnInit {

  
  constructor(
    public smartModal: NgxSmartModalService,
    public serverService: GetDataFromApiService,
    public state: StateService,
    public service: ServiceForVendorRfqService,
    public modal: ModalService,
    public base64 : Base64Service
  ) { }

  disabledButtonAndField = false;

  genericApprovalModalObj = {
    objectDetails : {
      rfqId : null,
      quoteId : null,
      versionNumber : null,
      requiredDepartment : [],
      minApprovers: 0,
      quoteCreator: null,
      quoteCreationDate:null,
      companyLocationId:null,
      companyLocationName:null,
    },
    addedApprovers:[],
    userDetails:[],
    hasPendingApproval:null,
    actionTaken:null,
    slctdAction:undefined,
    comment:undefined,
    enteredQuoteDetails:[],
    errorContent:null,
    addedDocuments:[],
    timeLineDetails:[],
    newDocs : [],
    newApprover : { 
      approverAlreadyAdded:null,
      slctdApprover:null,
      errorMsg:null,
    },
  }

  allPurposeAndPlCombinations = {}

  _StartServerCall(){
    this.state.progressBarStart();
    this.disabledButtonAndField = true;
  }
  
  _StopServerCall(){
    this.state.progressBarStop();
    this.disabledButtonAndField = false;
  }

  _RefreshData(){
    this.genericApprovalModalObj = {
      objectDetails : {
        rfqId : null,
        quoteId : null,
        versionNumber : null,
        requiredDepartment : [],
        minApprovers: 0,
        quoteCreator: null,
        quoteCreationDate:null,
        companyLocationId:null,
        companyLocationName:null,
      },
      addedApprovers:[],
      userDetails:[],
      hasPendingApproval:null,
      actionTaken:null,
      slctdAction:undefined,
      comment:null,
      errorContent:null,
      enteredQuoteDetails:[],
      addedDocuments:[],
      timeLineDetails:[],
      newDocs : [],
      newApprover : { 
        approverAlreadyAdded:null,
        slctdApprover:null,
        errorMsg:null,
      },
    }
  }

  getApprovalDetailsForVendorRfq(){
    this._RefreshData();
    this._StartServerCall();
    return this.serverService
    .post({ request : {
      formId                : this.service.formId,
      companyId             : this.service.companyDetails["CompanyId"],
      companyLocationId     : (this.service.activeTab == 'C') ? 
                              this.service.vendorRfqCreate.basicDetails.slctdLocation.companyLocationId : 
                              this.service.vendorRfqView.slctdLocation.companyLocationId,
      quoteId               : this.service.approvalModalReqObj.quoteId,
    } }, "vendorRfqModule/getApprovalDetailsForVendorRfq", {
      module: "purchase"
    }).subscribe(data => {
      this._StopServerCall();
      if(data.response){
        this.genericApprovalModalObj = {...this.genericApprovalModalObj, ...data.response};
        this.getRequiredApprovalsForVendorRfq();
        this.checkIfUserCanApproveVendorRfq();
        this.getUsersForObjectCode();
      }
    })
  }

  getRequiredApprovalsForVendorRfq(){
    this._StartServerCall();
    return this.serverService
    .post({ request : {
      formId                : this.service.formId,
      companyId             : this.service.companyDetails["CompanyId"],
      companyLocationId     : this.genericApprovalModalObj.objectDetails.companyLocationId,
      quoteId               : this.genericApprovalModalObj.objectDetails.quoteId
    }}, "vendorRfqModule/getRequiredApprovalsForVendorRfq", {
      module: "purchase"
    }).subscribe(data => {
      this._StopServerCall();
      if(data.response){
        this.genericApprovalModalObj.objectDetails.requiredDepartment = data.response;
      }
    })
  }

  checkIfUserCanApproveVendorRfq(){
    this._StartServerCall();
    return this.serverService
    .post({ request : {
      formId                : this.service.formId,
      companyId             : this.service.companyDetails["CompanyId"],
      companyLocationId     : this.genericApprovalModalObj.objectDetails.companyLocationId,
      quoteId               : this.genericApprovalModalObj.objectDetails.quoteId
    } }, "vendorRfqModule/checkIfUserCanApproveVendorRfq", {
      module: "purchase"
    }).subscribe(data => {
      this._StopServerCall();
      if(data.response){
        this.genericApprovalModalObj.hasPendingApproval = data.response.hasPendingApproval;
        this.genericApprovalModalObj.actionTaken = data.response.actionTaken;
      }
    })
  }

  getUsersForObjectCode(){
    this._StartServerCall();
    return this.serverService
    .post({ request : {
      formId                : this.service.formId,
      companyId             : this.service.companyDetails["CompanyId"],
      companyLocationId     : this.genericApprovalModalObj.objectDetails.companyLocationId,
      objectCode            : "VENDOR_RFQ"
    } }, "genericApprovalSystemModule/getUsersForObjectCode", {
      module: "operationsControl"
    }).subscribe(data => {
      this._StopServerCall();
      if(data.response){
        this.genericApprovalModalObj.userDetails = data.response;
      }
    })
  }

  createApproversObj(){
    this.genericApprovalModalObj.newApprover = {
      approverAlreadyAdded:null,
      slctdApprover:null,
      errorMsg:null,
    };
  }

  addApproverForVendorRfq(){
    this.genericApprovalModalObj.newApprover.approverAlreadyAdded = false;

    for(var i = 0, Length = this.genericApprovalModalObj.addedApprovers.length; i < Length; i++ ){
      if(this.genericApprovalModalObj.addedApprovers[i].userId == this.genericApprovalModalObj.newApprover.slctdApprover.userId ){
				this.genericApprovalModalObj.newApprover.approverAlreadyAdded = true;
			}
    }

    if(this.genericApprovalModalObj.newApprover.approverAlreadyAdded)return;
		if(this.genericApprovalModalObj.addedApprovers == undefined){
			this.genericApprovalModalObj.addedApprovers = [];
		}

    this._StartServerCall();
    return this.serverService
    .post({ request : {
      formId                : this.service.formId,
      companyId             : this.service.companyDetails["CompanyId"],
      companyLocationId     : this.genericApprovalModalObj.objectDetails.companyLocationId,
      quoteId               : this.genericApprovalModalObj.objectDetails.quoteId,
      approverUserId        : this.genericApprovalModalObj.newApprover.slctdApprover.userId, 
			departmentId          : this.genericApprovalModalObj.newApprover.slctdApprover.departmentId ,
    } }, "vendorRfqModule/addApproverForVendorRfq", {
      module: "purchase"
    }).subscribe(data => {
      this._StopServerCall();
      if(data.response){
        this.genericApprovalModalObj.addedApprovers 	= [];
				this.genericApprovalModalObj.timeLineDetails 	= [];
				this.genericApprovalModalObj 					        = {...this.genericApprovalModalObj, ...data.response};
				this.genericApprovalModalObj.newApprover.slctdApprover 						        = null;
      }
      if(data.errorTitle){
				this.genericApprovalModalObj.newApprover.errorMsg = data.errorContent;
			}
    })
  }

  deleteApproverForVendorRfq(_Index){
    this._StartServerCall();
    return this.serverService
    .post({ request : {
      formId                : this.service.formId,
      companyId             : this.service.companyDetails["CompanyId"],
      companyLocationId     : this.genericApprovalModalObj.objectDetails.companyLocationId,
      quoteId               : this.genericApprovalModalObj.objectDetails.quoteId,
      approverUserId        : this.genericApprovalModalObj.addedApprovers[_Index].userId, 
			departmentId          : this.genericApprovalModalObj.addedApprovers[_Index].departmentId,
    } }, "vendorRfqModule/deleteApproverForVendorRfq", {
      module: "purchase"
    }).subscribe(data => {
      this._StopServerCall();
      if(data.response){
        this.genericApprovalModalObj.addedApprovers 	= [];
				this.genericApprovalModalObj.timeLineDetails 	= [];
				this.genericApprovalModalObj 					        = {...this.genericApprovalModalObj, ...data.response};
      }
    })
  }

  makeActionByApproverForVendorRfq(){
    this._StartServerCall();
    return this.serverService
    .post({ request : {
      formId                : this.service.formId,
      companyId             : this.service.companyDetails["CompanyId"],
      companyLocationId     : this.genericApprovalModalObj.objectDetails.companyLocationId,
      quoteId               : this.genericApprovalModalObj.objectDetails.quoteId,
      actionType            : this.genericApprovalModalObj.slctdAction,
      comment               : (this.genericApprovalModalObj.slctdAction == 'C') ? this.genericApprovalModalObj.comment : null
    } }
    , "vendorRfqModule/makeActionByApproverForVendorRfq", {
      module: "purchase"
    }).subscribe(data => {
      this._StopServerCall();
      if(data.response){
        this.genericApprovalModalObj.addedApprovers 	= [];
				this.genericApprovalModalObj.timeLineDetails 	= [];
        this.genericApprovalModalObj 					        = {...this.genericApprovalModalObj, ...data.response};
        this.checkIfUserCanApproveVendorRfq();				
				this.genericApprovalModalObj.slctdAction = null;
				this.genericApprovalModalObj.comment = null;
      }
    })
  }

  getViewPreview(){
    this._StartServerCall();
    this.genericApprovalModalObj.errorContent = null;
    this.genericApprovalModalObj.enteredQuoteDetails.length = 0;
    let request = {
      formId                : this.service.formId,
      companyId             : this.service.companyDetails["CompanyId"],
      companyLocationId     : this.genericApprovalModalObj.objectDetails.companyLocationId,
      companyLocationName   : this.genericApprovalModalObj.objectDetails.companyLocationName,
      versionNumber         : this.genericApprovalModalObj.objectDetails.versionNumber,
      rfqId                 : this.genericApprovalModalObj.objectDetails.rfqId,
    }
    this.serverService
    .post({ request }, "vendorRfqModule/getEnteredQuotationDetails", {
      module: "purchase"
    }).subscribe(data => {
      this._StopServerCall();
      if(data.response){
        this.genericApprovalModalObj.enteredQuoteDetails = data.response;
      }
      if(data.code == 'error'){
        this.genericApprovalModalObj.errorContent = data.errorContent;
      }
    })
  }

  initializeDocObj = () =>{
    this.genericApprovalModalObj.newDocs = [];
  }

  handleFileInput(e){
    this.base64.convertMultipleFiles(e,(data)=>{
      this.genericApprovalModalObj.newDocs = [...data];
    })
  }

  addAttachmentForVendorRfq = () =>{
    this._StartServerCall();
    let request = {
      formId                : this.service.formId,
      companyId             : this.service.companyDetails["CompanyId"],
      companyLocationId     : this.genericApprovalModalObj.objectDetails.companyLocationId,
      companyLocationName   : this.genericApprovalModalObj.objectDetails.companyLocationName,
      addedDocs				      : this.genericApprovalModalObj.newDocs,
      quoteId               : this.genericApprovalModalObj.objectDetails.quoteId,
    }
    this.serverService
    .post({ request }, "vendorRfqModule/addAttachmentForVendorRfq", {
      module: "purchase"
    }).subscribe(data => {
      this._StopServerCall();
      if(data.response){
        this.genericApprovalModalObj.addedDocuments 	= [];
				this.genericApprovalModalObj.timeLineDetails 	= [];
				this.genericApprovalModalObj 					        = {...this.genericApprovalModalObj, ...data.response};
        this.initializeDocObj();
      }
    })
  }

  deleteAttachmentForVendorRfq = (_Index) =>{
    this._StartServerCall();
    this.genericApprovalModalObj.errorContent = null;
    let request = {
      formId                : this.service.formId,
      companyId             : this.service.companyDetails["CompanyId"],
      companyLocationId     : this.genericApprovalModalObj.objectDetails.companyLocationId,
      companyLocationName   : this.genericApprovalModalObj.objectDetails.companyLocationName,
      docS3Link 			      : this.genericApprovalModalObj.addedDocuments[_Index].docS3Link,
      photoName			        : this.genericApprovalModalObj.addedDocuments[_Index].documentName,
      quoteId               : this.genericApprovalModalObj.objectDetails.quoteId,
    }
    this.serverService
    .post({ request }, "vendorRfqModule/deleteAttachmentForVendorRfq", {
      module: "purchase"
    }).subscribe(data => {
      this._StopServerCall();
      if(data.response){
        this.genericApprovalModalObj.addedDocuments.splice(_Index,1);
      }
    })
  }

  onModalClose(){
    this.smartModal.getModal("rfqApprovalModal").close(); 
  }

  ngOnInit() {
  }

}
