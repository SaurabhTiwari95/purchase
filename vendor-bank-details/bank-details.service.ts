import { Injectable } from '@angular/core';
import { StateService } from 'src/app/shared/services/state.service';
import { ModalService } from 'src/app/shared/services/modal.service';
import { GetDataFromApiService } from 'src/app/shared/services/get-data-from-api.service';
import { CommonFunctionService } from 'src/app/shared/services/common-function.service';

@Injectable({
  providedIn: 'root'
})
export class BankDetailsService {

  constructor(
    private state: StateService,
    private api: GetDataFromApiService,
    public modal: ModalService,
    public commonFunctionService: CommonFunctionService
  ) { }

  companyDetails = this.state.getCompanyDetails();
  disableButtonAndFields = false;
  toUpdateBankDetails = false;
  toSeeVendorApproval = false;
  toGetVendorList = false;
  showBankHistory = false;

  addNewBank = false;

  vendorBankDetailsObject = {
    slctdLocation: {
      companyLocationId: null,
      locationName: null,
    },
    slctdWhatYouWant: {
      vendorTypeId: null,
      vendorTypeName: null,
    },
    slctdWhatYouWantToSee: {
      vendorApprovalTypeId: null,
      vendorApprovalTypeName: null,
    },
    slctdVendor: {
      vendorId: null,
      vendorName: null,
    },
    getVendorBankDetailArray:[
      {
        entryId: null,
        vendorId: null,
        bankName: null,
        branchName: null,
        accountNo: null,
        iFSCCode: null,
        address: null,
        micr: null,
        printName: null
      }
  ],
  slctdTransactionType: {
    transactionTypeId: null,
    transactionTypeName: null,
  },

  uploadedCheckImages: []
    
  }

  ////////////////////////////////////// Main Object End  ////////////////////////

  // server call for locations
  vendorLocationArray = [];
  getLocationsForThisUser() {
    this.disableButtonAndFields = true;
    this.vendorLocationArray.length = 0;
    let request = {
      companyId: this.companyDetails.CompanyId,
      formId: "172"
    };
    this.api.post({
      request
    }, "commonUIfunctionsModule/getLocationsForThisUser", { module: "vendor" }).subscribe(data => {
      this.disableButtonAndFields = false;
      if (data.response) {
        this.vendorLocationArray = data.response;
      }
      if (data.status == "error") {
        this.modal.openModal("Unsuccessful", "Some error has been occured");
      }
    });
  }

  // server call for Vendors
  getAllVendorsArray = [];
  getAllVendors() {
    this.disableButtonAndFields = true;
    this.getAllVendorsArray.length = 0;
    let request = {
      companyId: this.companyDetails.CompanyId,
      formId: "172"
    };
    this.api.post({
      request
    }, "commonUIfunctionsModule/getAllVendors", { module: "vendor" }).subscribe(data => {
      this.disableButtonAndFields = false;
      if (data.response) {
        this.getAllVendorsArray = data.response;
      }
      if (data.status == "error") {
        this.modal.openModal("Unsuccessful", "Some error has been occured");
      }
    });
  }

 
  // server call for Vendor Bank Details
  //getVendorBankDetailArray = [];
  getVendorBankDetail() {
    this.disableButtonAndFields = true;
    this.vendorBankDetailsObject.getVendorBankDetailArray.length = 0;
    let request = {
      companyId: this.companyDetails.CompanyId,
      formId: "172",      
    };
    if (this.vendorBankDetailsObject.slctdVendor != null) {
      request['vendorId'] = this.vendorBankDetailsObject.slctdVendor.vendorId
    };
    if (this.vendorBankDetailsObject.slctdLocation != null) {
      request['companyLocationId'] = this.vendorBankDetailsObject.slctdLocation.companyLocationId
    };
    this.api.post({
      request
    }, "vendorBankDetailModule/getVendorBankDetail", { module: "purchase" }).subscribe(data => {
      this.disableButtonAndFields = false;
      if (data.response) {
        this.vendorBankDetailsObject.getVendorBankDetailArray = data.response;
      }
      if (data.status == "error") {
        this.modal.openModal("Unsuccessful", "Some error has been occured");
      }
    });
  }  

}
