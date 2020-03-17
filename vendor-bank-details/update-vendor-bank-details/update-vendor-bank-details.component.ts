import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { StateService } from 'src/app/shared/services/state.service';
import { GetDataFromApiService } from 'src/app/shared/services/get-data-from-api.service';
import { ModalService } from 'src/app/shared/services/modal.service';
import { CommonFunctionService } from 'src/app/shared/services/common-function.service';
import { BankDetailsService } from '../bank-details.service';
import { Base64Service } from 'src/app/shared/services/base64.service';


@Component({
  selector: 'app-update-vendor-bank-details',
  templateUrl: './update-vendor-bank-details.component.html',
  styleUrls: ['./update-vendor-bank-details.component.scss']
})
export class UpdateVendorBankDetailsComponent implements OnInit {
  bankDetailsForm: FormGroup;

  transactionTypeArray = [
    {
      transactionTypeId: 1,
      transactionTypeName: "I"
    },
    {
      transactionTypeId: 2,
      transactionTypeName: "N"
    },
    {
      transactionTypeId: 3,
      transactionTypeName: "R"
    },
  ];

  constructor(
    private state: StateService,
    private api: GetDataFromApiService,
    public modal: ModalService,
    public commonFunctionService: CommonFunctionService,
    public bankDetailsService: BankDetailsService,
    public base64: Base64Service,
  ) {
    this.bankDetailsForm = new FormGroup({
      bankname: new FormControl(null, [Validators.required]),
      accountnumber: new FormControl(null, [Validators.required]),
      ifsccode: new FormControl(null, [Validators.required]),
      branchname: new FormControl(null, [Validators.required]),
      micr: new FormControl(null, [Validators.required]),
      address: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.required, Validators.email]),
      printname: new FormControl(null), 
      transactiontype: new FormControl(null),
      chequeupload: new FormControl(null)    
    }); 
   }

  ngOnInit() {
    this.bankDetailsService.vendorBankDetailsObject.slctdTransactionType = null;
  }

  resetbankDetailsForm(){
    this.bankDetailsForm.reset()
  }

  convertToBase64UploadProductImages(event) {
    this.base64.convertMultipleFiles(event, data => {
      if (this.bankDetailsService.vendorBankDetailsObject.uploadedCheckImages.length != 0) {
        for (let i = 0; i < data.length; i++) {
          this.bankDetailsService.vendorBankDetailsObject.uploadedCheckImages.push(data[i]);
        }
      } else {
        this.bankDetailsService.vendorBankDetailsObject.uploadedCheckImages = [...data];
      }
      if (this.bankDetailsService.vendorBankDetailsObject.uploadedCheckImages.length != 0) {
        event.target.value = "";
      }
    });
  }



  deleteChequeImage(_Index) {
    if (
      this.bankDetailsService.vendorBankDetailsObject.uploadedCheckImages[_Index].isDeleted ==
      undefined
    ) {
      this.bankDetailsService.vendorBankDetailsObject.uploadedCheckImages.splice(_Index, 1);
    } else {
      this.bankDetailsService.vendorBankDetailsObject.uploadedCheckImages[
        _Index
      ].isDeleted = true;
    }
  }


}
