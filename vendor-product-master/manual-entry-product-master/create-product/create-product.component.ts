import { Component, OnInit } from "@angular/core";
import { GetDataFromApiService } from "src/app/shared/services/get-data-from-api.service";
import { ModalService } from "src/app/shared/services/modal.service";
import { LocalVendorProductMasterService } from "../../local-vendor-product-master.service";
import { NgxSmartModalService } from "ngx-smart-modal";
import { Base64Service } from "src/app/shared/services/base64.service";
import { TitleCasePipe } from "@angular/common";

@Component({
  selector: "app-create-product",
  templateUrl: "./create-product.component.html",
  styleUrls: ["./create-product.component.scss"]
})
export class CreateProductComponent implements OnInit {
  constructor(
    private api: GetDataFromApiService,
    public modal: ModalService,
    public smartModal: NgxSmartModalService,
    public base64: Base64Service,
    public local: LocalVendorProductMasterService
  ) {}

  invalidProductNameLength: boolean = false;
  invalidProdDescLength: boolean = false;
  productDetailsAlreadyExists: boolean = false;

  customSearchFnForProductGroup(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return (
      item.GrpDesc.toLocaleLowerCase().indexOf(term) > -1 ||
      item.GroupId.toLocaleLowerCase().indexOf(term) > -1 ||
      (item.GrpDesc + " - " + item.GroupId).toLocaleLowerCase().indexOf(term) >
        -1
    );
  }

  customSearchFnForHsnCode(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return (
      item.hsnCode.toLocaleLowerCase().indexOf(term) > -1 ||
      item.hsnDescription.toLocaleLowerCase().indexOf(term) > -1 ||
      item.gstRatePercent.toLocaleLowerCase().indexOf(term) > -1 ||
      (item.hsnCode + " - " + item.hsnDescription + " - " + item.gstRatePercent)
        .toLocaleLowerCase()
        .indexOf(term) > -1
    );
  }

  //virtual scroll in hsn code
  onScrollToEnd() {
    this.fetchMore();
  }

  onScroll({ end }) {
    if (
      this.local.loading ||
      this.local.hsnCodeDetails.length <= this.local.bufferHsnCodeDetails.length
    ) {
      return;
    }

    if (
      end + this.local.numberOfItemsFromEndBeforeFetchingMore >=
      this.local.bufferHsnCodeDetails.length
    ) {
      this.fetchMore();
    }
  }

  private fetchMore() {
    const len = this.local.bufferHsnCodeDetails.length;
    const more = this.local.hsnCodeDetails.slice(
      len,
      this.local.bufferSize + len
    );
    this.local.loading = true;
    // using timeout here to simulate backend API delay
    setTimeout(() => {
      this.local.loading = false;
      this.local.bufferHsnCodeDetails = this.local.bufferHsnCodeDetails.concat(
        more
      );
    }, 200);
  }

  checkIfValidProductNameLength(event) {
    if (event.target.value.length > 100) {
      this.invalidProductNameLength = true;
    } else {
      this.invalidProductNameLength = false;
    }
    this.evaluateErrorFlag();
  }

  // let t = new TitleCasePipe();
  //   this.local.productCreationObj.productName = t.transform(event.target.value);

  checkIfProductDescValidLength(event) {
    if (event.target.value.length > 100) {
      this.invalidProdDescLength = true;
    } else {
      this.invalidProdDescLength = false;
    }
    this.evaluateErrorFlag();
  }

  evaluateErrorFlag() {
    this.local.btnDisablingOnError =
      this.invalidProductNameLength || this.invalidProdDescLength;
  }

  createUpdateUnitOfMeasurement() {
    if (this.local.productCreationObj.slctdUnitOfMeasurement) {
      this.local.isUnitOfMeasurementUpdateMode = true;
      this.local.unitOfMeasurementObj = JSON.parse(
        JSON.stringify(this.local.productCreationObj.slctdUnitOfMeasurement)
      );
      this.smartModal.getModal("myModalUnitOfMeasurement").open();
    } else {
      this.local.isUnitOfMeasurementUpdateMode = false;
      this.smartModal.getModal("myModalUnitOfMeasurement").open();
    }
  }

  checkIfCapitalProdActive(event) {
    if (event.target.checked) {
      this.local.productCreationObj.isCapitalProduct = true;
      this.local.productCreationObj.isServiceRequired = false;
    } else {
      this.local.productCreationObj.isCapitalProduct = false;
    }
  }
  checkIfServiceProdActive(event) {
    if (event.target.checked) {
      this.local.productCreationObj.isServiceRequired = true;
      this.local.productCreationObj.isCapitalProduct = false;
    } else {
      this.local.productCreationObj.isServiceRequired = false;
    }
  }

  createUpdateProduct() {
    if (!this.local.isProductEditMode) {
      this.insertProductForManualEntry();
    } else {
      this.updateProductMasterDetail();
    }
  }

  insertProductForManualEntry() {
    this.local.productCreationObj.productName.trim();
    this.local.productCreationObj.productDescription.trim();
    this.local._StartServerCall();
    let request = {
      companyId: this.local.companyDetails.CompanyId,
      formId: "155",
      productDetailObj: this.local.productCreationObj
    };

    this.api
      .post({ request }, "productMasterModule/insertProductForManualEntry", {
        module: "purchase"
      })
      .subscribe(data => {
        this.local._StopServerCall();
        if (data.status == "success") {
          this.modal.openModal(
            "Successful!!",
            "Product with Product Id ( " +
              "<b>" +
              data.response[0].prodId +
              "</b>" +
              " ) has been created successfully"
          );
          this.resetProdCreationFields();
          if (data.response.length == 0) {
            this.modal.openModal("No Data Found!!", "No Product details found");
          }
        }
        if (data.errorCode) {
          this.modal.openModal(data.errorTitle, data.errorContent);
        }
      });
  }

  cancelUpdateMode = () => {
    this.resetProdCreationFields();
    this.local.showProductCreateTpl = false;
    this.local.isProductEditMode = false;
    this.local.productCreationObj = {
      slctdHsnCode: null,
      slctdProductGroup: null,
      slctdUnitOfMeasurement: null,
      uploadedProductImages: [],
      productDescription: null,
      productName: null,
      isCapitalProduct: false,
      isServiceRequired: false
    };
    this.local.slctdProdRowObj = null;
    this.local.showProductDetailsTable = true;
  };

  updateProductMasterDetail() {
    if (
      JSON.stringify(this.local.slctdProdRowObj) ==
      JSON.stringify(this.local.productCreationObj)
    ) {
      this.productDetailsAlreadyExists = true;
    } else {
      this.productDetailsAlreadyExists = false;
    }

    if (this.productDetailsAlreadyExists) {
      this.modal.openModal(
        "Warning",
        "Product with the same product details already exists"
      );
      return;
    }

    this.local._StartServerCall();
    let request = {
      companyId: this.local.companyDetails.CompanyId,
      productDetailObj: this.local.productCreationObj,
      formId: "155"
    };

    this.api
      .post({ request }, "productMasterModule/updateProductMasterDetail", {
        module: "purchase"
      })
      .subscribe(data => {
        this.local._StopServerCall();
        if (data.status == "success") {
          this.modal.openModal(
            "Successful!!",
            "Product Details has been updated successfully"
          );
          this.local.getSearchProdIdAndProdDesc();
          this.local.showProductDetailsTable = true;
          this.local.showProductCreateTpl = false;
          this.local.isProductEditMode = false;
          this.local.productCreationObj = {
            slctdProductGroup: null,
            productName: null,
            slctdUnitOfMeasurement: null,
            productDescription: null,
            slctdHsnCode: null,
            isCapitalProduct: false,
            isServiceRequired: false,
            uploadedProductImages: []
          };
        }
        if (data.errorCode) {
          this.modal.openModal(data.errorTitle, data.errorContent);
        }
      });
  }

  convertToBase64UploadProductImages(event) {
    this.base64.convertMultipleFiles(event, data => {
      if (this.local.productCreationObj.uploadedProductImages.length != 0) {
        for (let i = 0; i < data.length; i++) {
          this.local.productCreationObj.uploadedProductImages.push(data[i]);
        }
      } else {
        this.local.productCreationObj.uploadedProductImages = [...data];
      }
      if (this.local.productCreationObj.uploadedProductImages.length != 0) {
        event.target.value = "";
      }
    });
  }

  deleteProductImage(_Index) {
    if (
      this.local.productCreationObj.uploadedProductImages[_Index].isDeleted ==
      undefined
    ) {
      this.local.productCreationObj.uploadedProductImages.splice(_Index, 1);
    } else {
      this.local.productCreationObj.uploadedProductImages[
        _Index
      ].isDeleted = true;
    }
  }

  expirePurchasableProduct = () => {
    this.local._StartServerCall();
    let request = {
      companyId: this.local.companyDetails.CompanyId,
      formId: "155",
      prodId: this.local.slctdProdRowObj.prodId,
      prodDesc: this.local.slctdProdRowObj.prodDesc,
      productStatus: this.local.slctdProdRowObj.productStatus
    };

    this.api
      .post({ request }, "productMasterModule/expirePurchasableProduct", {
        module: "purchase"
      })
      .subscribe(data => {
        this.local._StopServerCall();
        if (data.response) {
          this.local.getSearchProdIdAndProdDesc();

          this.modal.openModal(
            "Successful!!",
            "Product with Product Id ( " +
              "<b>" +
              data.response.prodId +
              "</b>" +
              ") has been " +
              data.response.productStatus +
              " successfully"
          );
          this.local.slctdProdRowObj.productStatus =
            data.response.productStatus;

          if (data.response.length == 0) {
            this.modal.openModal("No Data Found!!", "No Product details found");
          }
        }
        if (data.errorCode) {
          this.modal.openModal(data.errorTitle, data.errorContent);
        }
      });
  };

  resetProdCreationFields() {
    this.local.productCreationObj = {
      slctdHsnCode: null,
      slctdProductGroup: null,
      slctdUnitOfMeasurement: null,
      productDescription: null,
      productName: null,
      isCapitalProduct: false,
      isServiceRequired: false,
      uploadedProductImages: []
    };
  }

  changeMeasurementUnitDetails(arr) {
    this.local.measurmentUnitDetails = arr;
    this.local.filterDataOfUnitOfMeasurement = [
      ...this.local.measurmentUnitDetails
    ];
  }

  resetmodalDataOnClose() {
    this.local.unitOfMeasurementObj = {
      productSpecUnitName: null,
      productSpecUnitShortName: null
    };
  }

  outPut;

  ngOnInit() {
    //console.log(this.obj, "obj");
    //this.entries = Object.entries(this.obj);
    //console.log(this.entries, "entries");
    //this.from = Object.fromEntries(this.entries)
    //this.outPut = Object.fromEntries(this.newMapEntry)
  }
}
