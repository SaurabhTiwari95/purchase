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
  locationDependent = () => {
    if(this.bankDetailsService.vendorBankDetailsObject.slctdLocation == null){
      this.bankDetailsService.toUpdateBankDetails = false;
      this.bankDetailsService.vendorBankDetailsObject.slctdWhatYouWant = null;
      this.bankDetailsService.addNewBank = false;
      this.bankDetailsService.toGetVendorList = false;
    }
  }
  wantDependent = () => {
    if(this.bankDetailsService.vendorBankDetailsObject.slctdWhatYouWant.vendorTypeId && 
      this.bankDetailsService.vendorBankDetailsObject.slctdWhatYouWant.vendorTypeId == 1){
        this.bankDetailsService.toGetVendorList = true;
        this.bankDetailsService.toSeeVendorApproval = false;
        this.bankDetailsService.addNewBank = true;
        this.bankDetailsService.toSeeVendorApproval = false;
       // this.bankDetailsService.toUpdateBankDetails = true;
      }
      else if(this.bankDetailsService.vendorBankDetailsObject.slctdWhatYouWant.vendorTypeId &&
        this.bankDetailsService.vendorBankDetailsObject.slctdWhatYouWant.vendorTypeId == 2){
        this.bankDetailsService.toSeeVendorApproval = true;
        this.bankDetailsService.toGetVendorList = false;
        this.bankDetailsService.addNewBank = false;
      } 
  }
  vendorDependent = () => {
    this.bankDetailsService.getVendorBankDetail();
    this.bankDetailsService.showBankHistory = true;
    //this.bankDetailsService.toUpdateBankDetails = true;
  }

  // addItems() {
  //   console.log("hii")
  //   var numberOfItems = 5;
  //   for (var i = 0; i<numberOfItems; i++) {
  //     var ele = document.createElement("a");
  //     ele.classList.add("dropdown-item");
  //     ele.href = "#";
  //     ele.innerText = "" + i;
  //     document.querySelector(".dropdown-menu").appendChild(ele);
  //   }
  // }

  

}
