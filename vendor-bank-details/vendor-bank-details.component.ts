import { Component, OnInit } from '@angular/core';
import { StateService } from 'src/app/shared/services/state.service';
import { GetDataFromApiService } from 'src/app/shared/services/get-data-from-api.service';
import { ModalService } from 'src/app/shared/services/modal.service';
import { CommonFunctionService } from 'src/app/shared/services/common-function.service';
import { BankDetailsService } from './bank-details.service';

@Component({
  selector: 'app-vendor-bank-details',
  templateUrl: './vendor-bank-details.component.html',
  styleUrls: ['./vendor-bank-details.component.scss']
})
export class VendorBankDetailsComponent implements OnInit {

   vendorTypeArray = [
    {
      vendorTypeId: 1,
      vendorTypeName: "Enter Vendor Bank Details"
    },
    {
      vendorTypeId: 2,
      vendorTypeName: "Bank Details Approval"
    },
  ];


  constructor(
    private state: StateService,
    private api: GetDataFromApiService,
    public modal: ModalService,
    public commonFunctionService: CommonFunctionService,
    public bankDetailsService: BankDetailsService,
  ) { }

  ngOnInit() {
    this.bankDetailsService.vendorBankDetailsObject.slctdLocation = null;
    this.bankDetailsService.vendorBankDetailsObject.slctdWhatYouWant = null;
    this.bankDetailsService.vendorBankDetailsObject.slctdVendor = null;
    this.bankDetailsService.getLocationsForThisUser();
    this.bankDetailsService.getAllVendors();
  }

  wantDependent = () => {
    if(this.bankDetailsService.vendorBankDetailsObject.slctdWhatYouWant.vendorTypeId && 
      this.bankDetailsService.vendorBankDetailsObject.slctdWhatYouWant.vendorTypeId == 1){
        this.bankDetailsService.toGetVendorList = true;
        this.bankDetailsService.toSeeVendorApproval = false;
        this.bankDetailsService.addNewBank = true;
        this.bankDetailsService.toSeeVendorApproval = false;
      }
      else if(this.bankDetailsService.vendorBankDetailsObject.slctdWhatYouWant.vendorTypeId &&
        this.bankDetailsService.vendorBankDetailsObject.slctdWhatYouWant.vendorTypeId == 2){
        this.bankDetailsService.toSeeVendorApproval = true;
        this.bankDetailsService.toGetVendorList = false;
        this.bankDetailsService.addNewBank = false;
      } 
  }


  createButtonClicked = "";
  onClickedCreate() {
    if (this.createButtonClicked == "create") {
      $("#createClicked").addClass("create-clicked");
      $("#updateClicked").removeClass("update-clicked");
      this.bankDetailsService.addNewBank = true;
      this.bankDetailsService.toSeeVendorApproval = false;
    } else {
      $("#updateClicked").addClass("update-clicked");
      $("#createClicked").removeClass("create-clicked");
      this.bankDetailsService.addNewBank = false;
      this.bankDetailsService.showBankHistory = false;
      this.bankDetailsService.toUpdateBankDetails = false;  
      this.bankDetailsService.vendorBankDetailsObject.slctdVendor = null;    
      this.bankDetailsService.toSeeVendorApproval = true;   
    }
  } 
  
  locationDependent = () => {
    if (this.bankDetailsService.vendorBankDetailsObject.slctdLocation == null) {
      this.bankDetailsService.showOption = false;
      this.bankDetailsService.addNewBank = false;
      this.bankDetailsService.addNewBank = false;
      this.bankDetailsService.showBankHistory = false;
    }
    else{
      this.bankDetailsService.showOption = true;
      this.bankDetailsService.addNewBank = true;      
    }
  };  

  vendorDependent = () => {
    if (this.bankDetailsService.vendorBankDetailsObject.slctdVendor == null) {
      this.bankDetailsService.showBankHistory = false;
      this.bankDetailsService.showAddButton = false;
      this.bankDetailsService.toUpdateBankDetails = false;
      $("#addBankClicked").removeClass("create-clicked");
    }
    else{
      $("#addBankClicked").addClass("create-clicked");
      this.bankDetailsService.getVendorBankDetail();
      this.bankDetailsService.showBankHistory = true;  
      this.bankDetailsService.showAddButton = true;    
    }
  };
  
  addNewDetails = () => {
    this.bankDetailsService.getAllVendors();
    this.bankDetailsService.toUpdateBankDetails = true;
    this.bankDetailsService.showBankHistory = false;
  }

}
