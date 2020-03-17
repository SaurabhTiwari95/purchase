import { Component, OnInit } from '@angular/core';
import { StateService } from 'src/app/shared/services/state.service';
import { GetDataFromApiService } from 'src/app/shared/services/get-data-from-api.service';
import { ModalService } from 'src/app/shared/services/modal.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { CommonFunctionService } from 'src/app/shared/services/common-function.service';
import { ServiceForVendorRfqService } from './service-for-vendor-rfq.service';
import { anima } from '../../purchase/vendor-rfq/animation';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-vendor-rfq',
  templateUrl: './vendor-rfq.component.html',
  styleUrls: ['./vendor-rfq.component.scss'],
  providers:[ServiceForVendorRfqService],
  animations:[anima],
})
export class VendorRfqComponent implements OnInit {
  constructor(
    private serverService: GetDataFromApiService,
    private state: StateService,
    public modal: ModalService,
    public smartModal: NgxSmartModalService,
    public commonFunctionService: CommonFunctionService,
    public service: ServiceForVendorRfqService,
    ) {}

    locations = [];
    allPurposes = [];
    rfqTypes = [];
    allStatusTypes = [];
    toggleTitle = ''; 
    myData:any;   
    showApprovalDependency=false;

  public daterange = {
    start: new Date(),
    end: new Date()
  };
  public options: any = {
    locale: { format: "DD-MMM-YYYY" },
    alwaysShowCalendars: false
  };

  public selectedDate(value: any, datepicker?: any) {
    // this is the date the iser selected
    //console.log(value);

    // any object can be passed to the selected event and it will be passed back here
    datepicker.start = value.start;
    datepicker.end = value.end;

    // or manupulat your own internal property
    this.daterange.start = value.start;
    this.daterange.end = value.end;
    this.service.vendorRfqView.dates.startDate = value.start;
    this.service.vendorRfqView.dates.endDate = value.end;
    
  }

  private _StartServerCall() {
    this.state.progressBarStart();
    this.service.disabledButtonAndField = true;
  }

  private _StopServerCall() {
    this.state.progressBarStop();
    this.service.disabledButtonAndField = false;
  }

  checkForUpdateMode = () =>{
    if(this.service.isInUpdateMode){
      alert("This will cancel the update mode. Are you sure you want to cancle?");
    } 
    this.service.cancelUpdateMode();
  }
  whatDoYouWantToSee = [];
  setDataForApproval = () =>{
    if(this.service.vendorRfqView.slctdStatusType.statusCode != 'P' && this.service.vendorRfqView.slctdStatusType.statusCode != 'A'){
      this.showApprovalDependency = false;
      return;
    }
    this.whatDoYouWantToSee.length = 0;
    this.showApprovalDependency = true;
    if(this.service.vendorRfqView.slctdStatusType.statusCode == 'P'){
      this.whatDoYouWantToSee = [
        {
          typeId: 1,
          typeCode: "AP",
          typeName: "All pending RFQ's",
        },
        {
          typeId: 2,
          typeCode: "PM",
          typeName: "RFQ's pending for my approval",
        },
      ];
    }else if(this.service.vendorRfqView.slctdStatusType.statusCode == 'A'){
      this.whatDoYouWantToSee = [
        {
          typeId: 1,
          typeCode: "AA",
          typeName: "All approved RFQ's",
        },
        {
          typeId: 2,
          typeCode: "AM",
          typeName: "RFQ's approved by me",
        },
      ];
    } 
  }

  addNewRfqDetails = () =>{
    this.smartModal.getModal("createUpdateVendorRfqModal").open();
  }

  closeVendorRfqModal = () =>{
    this.smartModal.getModal("createUpdateVendorRfqModal").close();
  }

  getAllLocations() {
    let companyId = this.service.companyDetails["CompanyId"];
    let request = { companyId, formId : this.service.formId };
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
  
  getAllRfqPurposesForUser(_CompanyLocation) {
    let companyLocationId = _CompanyLocation.companyLocationId
    let companyId = this.service.companyDetails["CompanyId"];
    let request = { companyId, formId : this.service.formId,companyLocationId };
    this.serverService
      .post({ request }, "vendorRfqModule/getAllRfqPurposesForUser", {
        module: "purchase"
      })
      .subscribe(data => {
        if (data["response"]) {
          this.allPurposes = data.response;
        }
      });
  }
  
  getVendorRfqTypes() {
    let companyId = this.service.companyDetails["CompanyId"];
    let request = { companyId, formId : this.service.formId };
    this.serverService
      .post({ request }, "vendorRfqModule/getVendorRfqTypes", {
        module: "purchase"
      })
      .subscribe(data => {
        if (data["response"]) {
          this.rfqTypes = data.response;
        }
      });
  }
  
  getStatusForRfq() {
    let companyId = this.service.companyDetails["CompanyId"];
    let request = { companyId, formId : this.service.formId };
    this.serverService
      .post({ request }, "vendorRfqModule/getStatusForRfq", {
        module: "purchase"
      })
      .subscribe(data => {
        if (data["response"]) {
          this.allStatusTypes = data.response;
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
          this.service.vendorDetails = data.response;
        }
      })
  }

  getAllPurchasableProducts = () => {
    return this.serverService
    .post({ request : {
      formId                : this.service.formId,
      companyId             : this.service.companyDetails["CompanyId"],
    } }
    , "commonUIfunctionsModule/getAllPurchasableProducts", {
      module: "vendor"
    }).subscribe(data => {
      if(data.response){
        this.service.allProducts = data.response;
      }
    })
  }

  startSpinner = false;
  showTable = false;

  _ResetSpinnerAndData = () =>{
    this.service.vendorRfqView.rfqDetails.length = 0;
    this.startSpinner = false;
    this.showTable = false;
  }

  searchEnteredText(event) {
    this.service.vendorRfqView.rfqDetails = event.target.value ? this.holdRfqDetails.filter(elem => {
      if (elem.rfqId.toLowerCase().indexOf(event.target.value.toLowerCase()) != -1 ||
        elem.typeName.toLowerCase().indexOf(event.target.value.toLowerCase()) != -1 ||
        elem.createdBy.toLowerCase().indexOf(event.target.value.toLowerCase()) != -1 ||
        elem.createdOn.toLowerCase().indexOf(event.target.value.toLowerCase()) != -1
      ) {
        return true
      }
      else {
        return false;
      }
    }) : this.holdRfqDetails;

  }
  holdRfqDetails = [];
  getAllRfqsInDateRange = () => {
    this.service.vendorRfqView.rfqDetails.length = 0;
    this.holdRfqDetails.length = 0;
    this.startSpinner = true;
    this.showTable = true;
    this.service.disabledButtonAndField = true;
    let params = {
      formId            : this.service.formId,
      companyId         : this.service.companyDetails["CompanyId"],
      companyLocationId : this.service.vendorRfqView.slctdLocation.companyLocationId,
      startDate         : this.commonFunctionService.dateFormat(this.service.vendorRfqView.dates.startDate),
      endDate           : this.commonFunctionService.dateFormat(this.service.vendorRfqView.dates.endDate),
      statusCode        : this.service.vendorRfqView.slctdStatusType.statusId
    }
    
    if(this.service.vendorRfqView.slctdType && this.showApprovalDependency){
      params = Object.assign(params,{typeCode:this.service.vendorRfqView.slctdType.typeCode});
    }
    if(this.service.vendorRfqView.singlePurpose){
      params = Object.assign(params,{purposeId:this.service.vendorRfqView.slctdPurpose.purposeId});
    }
    if(this.service.vendorRfqView.singleRfqType){
      params = Object.assign(params,{rfqTypeId:this.service.vendorRfqView.slctdRfqType.typeId});
    }
    if(this.service.vendorRfqView.singleVendor){
      params = Object.assign(params,{vendorId:this.service.vendorRfqView.slctdVendor.vendorId});
    }
    
    return this.serverService
    .post({ request : params }
      , "vendorRfqModule/getAllRfqsInDateRange", {
        module: "purchase"
      }).subscribe(data => {
      this.service.disabledButtonAndField = false;
      this.startSpinner = false;
      if(data.response){
        this.service.vendorRfqView.rfqDetails = data.response;
        this.holdRfqDetails = data.response;
        if(data.response.length == 0){
          this.showTable = false;
          this.modal.openModal("Unsuccessful","Data not found");
        }
      }
      if(data.errorContent){
        this.modal.openModal(data.errorTitle,data.errorContent);
        this._ResetSpinnerAndData();
      }
    })
  }

  addVendorAndProduct = () => {
    this.service.vendorRfqCreate.basicDetails.ifPageNum = 1;
    this.service.productBuffer = [...this.service.allProducts];  
  }

  getDetailsForVendorRfq = (_Index) =>{
    this.service.disabledButtonAndField = true;
    this._StartServerCall();
    let params = {
      formId            : this.service.formId,
      companyId         : this.service.companyDetails["CompanyId"],
      companyLocationId : this.service.vendorRfqView.slctdLocation.companyLocationId,
      rfqId             : this.service.vendorRfqView.rfqDetails[_Index].rfqId,
      versionNumber     : this.service.vendorRfqView.rfqDetails[_Index].versionNumber
    }
    return this.serverService
    .post({ request : params }
      , "vendorRfqModule/getDetailsForVendorRfq", {
        module: "purchase"
      }).subscribe(data => {
      this._StopServerCall();
      this.service.disabledButtonAndField = false;
      if(data.response){          
        //this.service.vendorRfqCreate.basicDetails = null;
        this.service.vendorRfqCreate = JSON.parse(JSON.stringify({...this.service.vendorRfqCreate,...data.response}));
        this.service.vendorRfqCreate.productAndVendorDetails.addedProducts = [];
        this.service.vendorRfqCreate.basicDetails.ifPageNum = 2;
        this.service.activeTab = 'C';
        this.service.isInUpdateMode = true;
        this._FindLatestRevisionNumberIndex()
      }
      if(data.errorContent){
        this.modal.openModal(data.errorTitle,data.errorContent);
      }
    })
  }

  private _FindLatestRevisionNumberIndex = () =>{
    let _Length = this.service.vendorRfqCreate.revisionDetails.length;
    for(let i = 0; i<_Length; i++ ){
      if(this.service.vendorRfqCreate.revisionDetails[i].isSelected){
        this.service.selectedRevisionIndex = i;
      }
    }
  }

  openRfqApprovalModal = _Index =>{
    this.service.approvalModalReqObj = JSON.parse(JSON.stringify(this.service.vendorRfqView.rfqDetails[_Index]));
    this.smartModal.getModal("rfqApprovalModal").open(); 
  }
  
  ngOnInit() {
    this.toggleTitle = 'Show Optional Fields';
    this.service.activeTab = 'V';
    this.getAllLocations();
    this.getVendorRfqTypes();
    this.getStatusForRfq();
    this.getAllVendors();
    this.getAllPurchasableProducts();
  }
}