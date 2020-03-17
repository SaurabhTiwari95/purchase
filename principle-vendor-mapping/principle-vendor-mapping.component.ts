import { Component, OnInit } from '@angular/core';
import { StateService } from 'src/app/shared/services/state.service';
import { GetDataFromApiService } from 'src/app/shared/services/get-data-from-api.service';
import { CommonFunctionService } from 'src/app/shared/services/common-function.service';

@Component({
  selector: 'app-principle-vendor-mapping',
  templateUrl: './principle-vendor-mapping.component.html',
  styleUrls: ['./principle-vendor-mapping.component.scss']
})
export class PrincipleVendorMappingComponent implements OnInit {
  principalVendorName: boolean;

  constructor(private state: StateService, private api: GetDataFromApiService,
    public commonFunctionService: CommonFunctionService
  ) { }

  companyDetails = this.state.getCompanyDetails();

  categories = [
    { categoryId: '1', categoryName: 'Add New Principal Vendor' },
    { categoryId: '2', categoryName: 'Update Existing Principal Vendor' }
  ]

  principleVendorObj = {
    slctdCategory: {
      categoryId: null,
      categoryName: null,
    },
    slctdVendor: {
      vendorName: null,
      vendorId: null,
    },
    principalVendor: null,
    vendorMappingObj: {
      primaryName: null,
    },
    slctdPrincipalVendor: {
      principalVendorName: null,
      principalVendorId: null,
    }
  }

  mappedVendorsDetailsObj = {
    principalVendorDetail: {
      principalVendorId: null,
      principalVendorName: null,
    },
    customerDetails: [],
  }

  allUnmappedVendors = [];
  pricipalVendors = [];

  mappedVendorsForParticularPrincipal = [];
  principalVendorsDetails = []

  disableAllFields: boolean = false;
  isUpdateMode: boolean = false;
  isValidPrincipalVendor: boolean = false;

  //search functions
  customSearchFnForVendor(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return (
      item.vendorName.toLocaleLowerCase().indexOf(term) > -1 ||
      item.vendorId.toLocaleLowerCase().indexOf(term) > -1 ||
      (item.vendorName + " - " + item.vendorId).toLocaleLowerCase().indexOf(term) >
      -1
    );
  }

  customSearchFnForPrincipalVendor(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return (
      item.principalVendorName.toLocaleLowerCase().indexOf(term) > -1 ||
      item.principalVendorId.toLocaleLowerCase().indexOf(term) > -1 ||
      (item.principalVendorName + " - " + item.principalVendorId).toLocaleLowerCase().indexOf(term) >
      -1
    );
  }

  // validations
  minLength = 3;
  checkIfValidVendorName = (event) => {
    if (event.target.value.length >= this.minLength) {
      this.isValidPrincipalVendor = true;
    } else {
      this.isValidPrincipalVendor = false;
    }
  }

  // Getters
  getAllUnmappedVendors = () => {
    let request = {
      companyId: this.companyDetails.CompanyId,
      formId: "171",
    }
    this.api
      .post({ request }, "principalVendorMappingModule/getAllUnmappedVendors", {
        module: 'purchase'
      })
      .subscribe(data => {
        if (data.response.length != 0) {
          this.allUnmappedVendors = data.response;
        }
        if (data["errorCode"]) {
          this.commonFunctionService.simpleSweetAlert(data.errorTitle, data.errorContent, 'warning')
        }
      })

  }

  getPrincipalVendorMapped = () => {
    this._StartServerCall();
    let request = {
      companyId: this.companyDetails.CompanyId,
      formId: "171",
      principalVendorId: this.principleVendorObj.slctdPrincipalVendor.principalVendorId,
      principalVendorName: this.principleVendorObj.slctdPrincipalVendor.principalVendorName,
    }
    this.api
      .post({ request }, "principalVendorMappingModule/getPrincipalVendorMapped", {
        module: 'purchase'

      })
      .subscribe(data => {
        this._StopServerCall();
        if (data.response.length != 0) {
          this.mappedVendorsDetailsObj.customerDetails = data.response;
          this.isValidPrincipalVendor = true;
        }
        if (data.response.length == 0) {
          this.commonFunctionService.simpleSweetAlert('No Data Found!!', 'No Vendor(s) mapped under selected Principal Vendor ', 'warning')
        }
        if (data["errorCode"]) {
          this.commonFunctionService.simpleSweetAlert(data.errorTitle, data.errorContent, 'warning')
        }
      })
  }

  getPrincipalVendorDetails = () => {
    this._StartServerCall();
    let request = {
      companyId: this.companyDetails.CompanyId,
      formId: "171",
    }
    this.api
      .post({ request }, "principalVendorMappingModule/getPrincipalVendorDetails", {
        module: 'purchase'

      })
      .subscribe(data => {
        this._StopServerCall();
        if (data.response.length != 0) {
          this.principalVendorsDetails = data.response;
        }
        else {
          this.commonFunctionService.simpleSweetAlert('No Data Found!!', 'No data to display', 'warning')
        }
        if (data["errorCode"]) {
          this.commonFunctionService.simpleSweetAlert(data.errorTitle, data.errorContent, 'warning')
        }
      })
  }


  // Mapping/Insert Principal Vendor
  mapVendors = [];
  mapVendorToPrincipalVendor = () => {
    for (let i = 0; i < this.mappedVendorsDetailsObj.customerDetails.length; i++) {
      if (this.mappedVendorsDetailsObj.customerDetails[i].custId == this.principleVendorObj.slctdVendor.vendorId) {
        this.commonFunctionService.simpleSweetAlert("Warning!!", "Vendor already exists, please select another vendor", 'warning')
        this.principleVendorObj.slctdVendor = null;
        return;
      }
    }
    this._StartServerCall();
    let request = {
      companyId: this.companyDetails.CompanyId,
      formId: "171",

      vendorId: this.principleVendorObj.slctdVendor.vendorId,
    }
    if (!this.isUpdateMode) {
      request['principalVendorName'] = this.principleVendorObj.principalVendor;
    } else {
      request['principalVendorName'] = this.principleVendorObj.slctdPrincipalVendor.principalVendorName
      request['principalVendorId'] = this.principleVendorObj.slctdPrincipalVendor.principalVendorId
    }


    this.api
      .post({ request }, "principalVendorMappingModule/mapVendorToPrincipalVendor", {
        module: 'purchase'
      })
      .subscribe(data => {
        this._StopServerCall();
        if (data["response"]) {
          this.mappedVendorsDetailsObj = JSON.parse(JSON.stringify(data.response))

          this.principleVendorObj.slctdVendor = null;
          this.isUpdateMode = true;
          this.principleVendorObj.slctdCategory = this.categories[1]
          this.principleVendorObj.slctdPrincipalVendor = this.mappedVendorsDetailsObj.principalVendorDetail
          this.getAllUnmappedVendors();
          this.getPrincipalVendorDetails();
          if (!this.isUpdateMode) {
            this.commonFunctionService.simpleSweetAlert("Successful!!", "Vendor mapped successfully with ( " + '<b>' + this.principleVendorObj.principalVendor + '</b>' + ' ) Principal Vendor', 'success')
          } else {
            this.commonFunctionService.simpleSweetAlert("Successful!!", "Vendor mapped successfully with ( " + '<b>' + this.principleVendorObj.slctdPrincipalVendor.principalVendorName + '</b>' + ' ) Principal Vendor', 'success')
          }

        }
        if (data["errorCode"]) {
          this.commonFunctionService.simpleSweetAlert(data.errorTitle, data.errorContent, 'warning')
        }
      });

  }

  //Delete Vendor
  deleteVendorToPrinciVendorMapping = (_Index) => {
    this.commonFunctionService.sweetAlertWithActions('Confirmation!!', 'Are you sure to delete or unmap vendor with selected Principal vendor ?', "warning", "Ok ", "Cancel", true).then(result => {
      if (result.value) {
        this._StartServerCall();
        let request = {
          companyId: this.companyDetails.CompanyId,
          formId: "171",
          vendorId: this.mappedVendorsDetailsObj.customerDetails[_Index].custId,
          principalVendorId: this.principleVendorObj.slctdPrincipalVendor.principalVendorId,
        }
        this.api
          .post({ request }, "principalVendorMappingModule/deleteVendorToPrinciVendorMapping", {
            module: 'purchase'
          })
          .subscribe(data => {
            this._StopServerCall();
            if (data.status == 'success') {
              this.mappedVendorsDetailsObj.customerDetails.splice(_Index, 1)
              this.commonFunctionService.simpleSweetAlert('Successful!!', "Vendor has been unmapped or deleted successfully", 'success')
              this.getAllUnmappedVendors();
            }
            if (data.errorCode) {
              this.commonFunctionService.simpleSweetAlert(data.errorTitle, data.errorContent, 'warning')
            }
          })
      } else {
        return;
      }
    })

  }

  // Reset Functions
  setWhatToDoDependent = () => {
    if (this.principleVendorObj.slctdCategory && this.principleVendorObj.slctdCategory.categoryId == '2') {
      this.getPrincipalVendorDetails();
      this.isUpdateMode = true;
    } else {
      this.isUpdateMode = false;
    }
    this.resetWhatToDoDependent();
  }

  resetWhatToDoDependent = () => {
    this.mappedVendorsDetailsObj.customerDetails = [];
    this.principleVendorObj.slctdPrincipalVendor = null;
    this.principleVendorObj.principalVendor = null;
    this.principleVendorObj.slctdVendor = null;
  }

  resetPrincipalVendorDependent = () => {
    this.mappedVendorsDetailsObj.customerDetails = [];
  }

  reseDataOnMapVendorBtn = () => {
    this.principleVendorObj.slctdVendor = null;
  }

  // Server Call
  _StartServerCall = () => {
    this.state.progressBarStart();
    this.disableAllFields = true;
  }

  _StopServerCall = () => {
    this.state.progressBarStop();
    this.disableAllFields = false;
  }

  ngOnInit() {
    this.getAllUnmappedVendors();
    this.principleVendorObj.slctdCategory = null;
    this.principleVendorObj.slctdVendor = null;
    this.principleVendorObj.slctdPrincipalVendor = null;
  }

}
