import { Component, OnInit } from '@angular/core';
import { StateService } from 'src/app/shared/services/state.service';
import { GetDataFromApiService } from 'src/app/shared/services/get-data-from-api.service';
import { ModalService } from 'src/app/shared/services/modal.service';
import { LocalVendorProductMasterService } from '../../local-vendor-product-master.service';

@Component({
  selector: 'app-products-table',
  templateUrl: './products-table.component.html',
  styleUrls: ['./products-table.component.scss']
})
export class ProductsTableComponent implements OnInit {

  constructor(
    private state: StateService,
    private api: GetDataFromApiService,
    public modal: ModalService,
    public local: LocalVendorProductMasterService,
  ) { }


  filterProductsDatatable(event) {
    this.local.filteredProductDetails = event.target.value ? this.local.productDetailsArray.filter(elem => {
      if (elem.productName && elem.productName.toLowerCase().indexOf(event.target.value.toLowerCase()) != -1 ||
        elem.slctdProductGroup.GrpDesc && elem.slctdProductGroup.GrpDesc.toLowerCase().indexOf(event.target.value.toLowerCase()) != -1 ||
        elem.prodId && elem.prodId.toLowerCase().indexOf(event.target.value.toLowerCase()) != -1 ||
        elem.createdBy && elem.createdBy.toLowerCase().indexOf(event.target.value.toLowerCase()) != -1 ||
        elem.createdAt && elem.createdAt.toLowerCase().indexOf(event.target.value.toLowerCase()) != -1) {
        return true;
      } else {
        return false;
      }
    }) : this.local.productDetailsArray
  }

  editProductDetails(_Row) {
    this.checkIfUserCanUpdateProduct();
    this.local.productCreationObj = JSON.parse(JSON.stringify(_Row));
    this.local.showProductDetailsTable = false;
    this.local.showProductCreateTpl = true;
    this.local.isProductEditMode = true;
    this.local.slctdProdRowObj = _Row;
  }

  checkIfUserCanUpdateProduct = () => {
    this.local._StartServerCall();
    this.local.showProductDetailsTable = true;
    let request = {
      companyId: this.local.companyDetails.CompanyId,
      formId: "155",
      prodDesc: this.local.productMasterObj.productSearchBy
    };
    this.api
      .post({ request }, "productMasterModule/checkIfUserCanUpdateProduct", {
        module: "purchase"
      })
      .subscribe(data => {
        this.local._StopServerCall();
        if (data.response) {
          this.local.userCanUpdateProductDetails = data.response


        }
        if (data.errorCode) {
          this.modal.openModal(data.errorTitle, data.errorContent);
        }
      });
  }

  ngOnInit() {
  }

}
