import { Component, OnInit } from "@angular/core";
import { StateService } from "src/app/shared/services/state.service";
import { GetDataFromApiService } from "src/app/shared/services/get-data-from-api.service";
import { ModalService } from "src/app/shared/services/modal.service";
import { Papa } from "ngx-papaparse";
import { LocalVendorProductMasterService } from "../local-vendor-product-master.service";
import { AngularCsv } from "angular7-csv/dist/Angular-csv";
import { NgxSmartModalService } from "ngx-smart-modal";

@Component({
  selector: "app-product-master-import",
  templateUrl: "./product-master-import.component.html",
  styleUrls: ["./product-master-import.component.scss"]
})
export class ProductMasterImportComponent implements OnInit {
  constructor(
    private state: StateService,
    private api: GetDataFromApiService,
    public modal: ModalService,
    private fileParser: Papa,
    public local: LocalVendorProductMasterService,
    public smartModal: NgxSmartModalService
  ) {}

  csvOptions = {
    fieldSeparator: ",",
    //quoteStrings: '"',
    decimalseparator: ".",
    //showLabels: true,
    //showTitle: true,
    //useBom: true,
    noDownload: false
  };

  productDetailsAfterImport = [];
  searchProductSAfterImport = [];

  parseFile() {
    this.local.vendorProductImportObj.errorTitle = null;
    this.local.vendorProductImportObj.parsedErrorFileFromApi = [];
    this.local.vendorProductImportObj.parsedData = null;
    let csvData = this.local.vendorProductImportObj.fileData;
    let options = {
      keepEmptyRows: false,
      complete: (results, file) => {
        this.local.vendorProductImportObj.parsedData = results;
      }
    };
    this.fileParser.parse(csvData, options);
    for (
      let i = 0;
      i < this.local.vendorProductImportObj.parsedData.data.length;
      i++
    ) {
      if (this.local.vendorProductImportObj.parsedData.data[i] == "") {
        this.local.vendorProductImportObj.parsedData.data.length =
          this.local.vendorProductImportObj.parsedData.data.length - 1;
      }
    }
  }

  productMasterFileImp() {
    this.local._StartServerCall();

    let request = {
      companyId: this.local.companyDetails.CompanyId,
      formId: "155",
      fileData: this.local.vendorProductImportObj.parsedData.data
    };

    this.api
      .post({ request }, "productMasterModule/productMasterFileImp", {
        module: "purchase"
      })
      .subscribe(data => {
        this.local._StopServerCall();
        if (data.status == "success") {
          // this.modal.openModal(
          //   "Successful!!",
          //   "The file has been imported successfully."
          // );
          this.productDetailsAfterImport = data.response;
          this.searchProductSAfterImport = [...this.productDetailsAfterImport];
          this.smartModal.getModal("myModalProductImportRef").open();
          this.local.vendorProductImportObj.fileData = null;
          this.local.vendorProductImportObj.parsedData = null;
        }
        if (data.fileData) {
          this.local.vendorProductImportObj.parsedData = null;

          this.local.vendorProductImportObj.parsedErrorFileFromApi =
            data.fileData;
        }
        if (data.code) {
          this.local.vendorProductImportObj.errorTitle = data.errorTitle;
          this.local.vendorProductImportObj.errorContent = data.errorContent;
          this.modal.openModal(data.errorTitle, data.errorContent);
        }
      });
  }

  getPurchaseProdImportFile = () => {
    this.local._StartServerCall();

    let request = {
      companyId: this.local.companyDetails.CompanyId,
      formId: "155"
    };

    this.api
      .post({ request }, "productMasterModule/getPurchaseProdImportFile", {
        module: "purchase"
      })
      .subscribe(data => {
        this.local._StopServerCall();
        if (data.response) {
          new AngularCsv(
            data.response,
            "Purchase_Product_Master_Import_File_Format",
            this.csvOptions
          );
        }
      });
  };

  resetFileData() {
    this.local.vendorProductImportObj.fileData = null;
    this.local.vendorProductImportObj.parsedData = null;
    this.local.vendorProductImportObj.errorTitle = null;
    this.local.vendorProductImportObj.errorContent = null;
    this.local.vendorProductImportObj.parsedErrorFileFromApi = [];
  }

  searchProductsInImport(event) {
    this.searchProductSAfterImport = event.target.value
      ? this.productDetailsAfterImport.filter(elem => {
          if (
            elem.groupDesc
              .toLowerCase()
              .indexOf(event.target.value.toLowerCase()) != -1 ||
            elem.prodName
              .toLowerCase()
              .indexOf(event.target.value.toLowerCase()) != -1 ||
            elem.prodId
              .toLowerCase()
              .indexOf(event.target.value.toLowerCase()) != -1 ||
            elem.prodUnit
              .toLowerCase()
              .indexOf(event.target.value.toLowerCase()) != -1 ||
            elem.prodDesc
              .toLowerCase()
              .indexOf(event.target.value.toLowerCase()) != -1 ||
            elem.hsnCode
              .toLowerCase()
              .indexOf(event.target.value.toLowerCase()) != -1
          ) {
            return true;
          } else {
            return false;
          }
        })
      : this.productDetailsAfterImport;
  }

  ngOnInit() {}
}
