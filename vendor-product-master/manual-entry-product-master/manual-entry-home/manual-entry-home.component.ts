import { Component, OnInit } from "@angular/core";
import { StateService } from "src/app/shared/services/state.service";
import { GetDataFromApiService } from "src/app/shared/services/get-data-from-api.service";
import { ModalService } from "src/app/shared/services/modal.service";
import { LocalVendorProductMasterService } from "../../local-vendor-product-master.service";

@Component({
  selector: "app-manual-entry-home",
  templateUrl: "./manual-entry-home.component.html",
  styleUrls: ["./manual-entry-home.component.scss"]
})
export class ManualEntryHomeComponent implements OnInit {
  constructor(
    private state: StateService,
    private api: GetDataFromApiService,
    public modal: ModalService,
    public local: LocalVendorProductMasterService
  ) {}

  whatToDoDetails = [
    { whatToDoId: 1, whatToDoName: "New Product Creation", whatToDoCode: "PC" },
    {
      whatToDoId: 2,
      whatToDoName: "Product Search & Update",
      whatToDoCode: "PSU"
    }
  ];

  productsearchByDetails = [
    { productsearchById: 1, productsearchByName: "Product Id" },
    { productsearchById: 2, productsearchByName: "Product Name" },
    { productsearchById: 3, productsearchByName: "Product Description" }
  ];

  customSearchFnForProductGroup(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return (
      item.GrpDesc.toLocaleLowerCase().indexOf(term) > -1 ||
      item.GroupId.toLocaleLowerCase().indexOf(term) > -1 ||
      (item.GrpDesc + " - " + item.GroupId).toLocaleLowerCase().indexOf(term) >
        -1
    );
  }

  validProductSearchByLength: boolean = false;

  checkIfLengthOfProductSearchBy(event) {
    if (event.target.value.length >= 3) {
      this.validProductSearchByLength = true;
    } else {
      this.validProductSearchByLength = false;
    }
    this.local.showProductDetailsTable = false;
  }

  getProductGroups() {
    this.local._StartServerCall();
    let request = {
      CompanyId: this.local.companyDetails.CompanyId,
      formId: "155"
    };

    this.api
      .post({ request }, "mainModule/getProductGroups", {
        module: "vendor"
      })
      .subscribe(data => {
        //  this.local._StopServerCall();
        if (data.response) {
          this.local.productGroupDetails = data.response;
        }
        if (data.errorCode) {
          this.modal.openModal(data.errorTitle, data.errorContent);
        }
      });
  }

  getProductMasterHsnCode() {
    let request = {
      companyId: this.local.companyDetails.CompanyId,
      formId: "155"
    };
    this.api
      .post({ request }, "productMasterModule/getProductMasterHsnCode", {
        module: "purchase"
      })
      .subscribe(data => {
        this.local._StopServerCall();
        if (data.response) {
          this.local.hsnCodeDetails = data.response;
          this.local.bufferHsnCodeDetails = [...this.local.hsnCodeDetails];
        }
        if (data.errorCode) {
          this.modal.openModal(data.errorTitle, data.errorContent);
        }
      });
  }

  getProductDetails() {
    this.local.showProductDetailsTable = true;
  }

  getProductMasterUnitOfMeasurement() {
    let request = {
      companyId: this.local.companyDetails.CompanyId,
      formId: "155"
    };
    this.api
      .post(
        { request },
        "productMasterModule/getProductMasterUnitOfMeasurement",
        {
          module: "purchase"
        }
      )
      .subscribe(data => {
        if (data.response) {
          this.local.measurmentUnitDetails = data.response;
          this.local.filterDataOfUnitOfMeasurement = this.local.measurmentUnitDetails.slice();
        }
        if (data.errorCode) {
          this.modal.openModal(data.errorTitle, data.errorContent);
        }
      });
  }

  getDependentsOfWhatToDo() {
    this.getProductGroups();
    this.getProductMasterUnitOfMeasurement();
    this.getProductMasterHsnCode();
    this._ResetDependentsOfWhatToDo();
  }

  _ResetDependentsOfWhatToDo() {
    this.local.showProductDetailsTable = false;
    this.local.productMasterObj.productSearchBy = null;
  }

  resetProdGrpDependent = () => {
    this.local.productDetailsArray = [];
    this.local.filteredProductDetails = [];
  };

  ngOnInit() {
    this.local.productMasterObj.slctdWhatToDo = null;
  }
}
