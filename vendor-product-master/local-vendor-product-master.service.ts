import { Injectable } from "@angular/core";
import { StateService } from "src/app/shared/services/state.service";
import { GetDataFromApiService } from "src/app/shared/services/get-data-from-api.service";
import { ModalService } from "src/app/shared/services/modal.service";

@Injectable({
  providedIn: "root"
})
export class LocalVendorProductMasterService {
  constructor(
    private state: StateService,
    private api: GetDataFromApiService,
    public modal: ModalService
  ) {}

  companyDetails = this.state.getCompanyDetails();
  disableButton: boolean = false;
  btnDisablingOnError: boolean = false;
  isUnitOfMeasurementUpdateMode: boolean = false;
  isProductEditMode: boolean = false;
  vendorProductImportObj = {
    fileData: null,
    parsedData: null,
    errorTitle: null,
    errorContent: null,
    parsedErrorFileFromApi: []
  };

  loading = false;
  productGroupDetails = [];
  measurmentUnitDetails = [];
  filterDataOfUnitOfMeasurement = [];
  hsnCodeDetails = [];
  bufferHsnCodeDetails = [];
  bufferSize = 50;
  numberOfItemsFromEndBeforeFetchingMore = 10;

  unitOfMeasurementObj = {
    productSpecUnitName: null,
    productSpecUnitShortName: null
  };
  productCreationObj = {
    slctdProductGroup: null,
    productName: null,
    slctdUnitOfMeasurement: null,
    productDescription: null,
    slctdHsnCode: null,
    isCapitalProduct: false,
    isServiceRequired: false,
    uploadedProductImages: []
  };

  showProductDetailsTable: boolean = false;
  productDetailsArray = [];
  filteredProductDetails = [];
  showProductCreateTpl = false;
  slctdProdRowObj = {
    prodId: null,
    prodDesc: null,
    productStatus: null
  };
  userCanUpdateProductDetails = {
    hasPermToCreateOrModify: null
  };

  productMasterObj = {
    slctdWhatToDo: {
      whatToDoName: null,
      whatToDoId: null
    },
    productSearchBy: null,
    slctdProductGroup: null
  };

  _StartServerCall() {
    this.state.progressBarStart();
    this.disableButton = true;
  }
  _StopServerCall() {
    this.state.progressBarStop();
    this.disableButton = false;
  }

  getSearchProdIdAndProdDesc() {
    if (this.productMasterObj.productSearchBy.length < 3) return;

    this._StartServerCall();
    let request = {
      companyId: this.companyDetails.CompanyId,
      formId: "155",
      prodDesc: this.productMasterObj.productSearchBy
    };
    if (this.productMasterObj.slctdProductGroup) {
      request["groupId"] = this.productMasterObj.slctdProductGroup.GroupId;
    }
    this.api
      .post({ request }, "productMasterModule/getSearchProdIdAndProdDesc", {
        module: "purchase"
      })
      .subscribe(data => {
        this._StopServerCall();
        if (data.response) {
          this.productDetailsArray = data.response;
          this.filteredProductDetails = this.productDetailsArray.slice();
          this.showProductDetailsTable = true;
          if (this.isProductEditMode) {
            this.showProductDetailsTable = false;
          }
        }
        if (data.errorCode) {
          this.modal.openModal(data.errorTitle, data.errorContent);
        }
      });
  }
}
