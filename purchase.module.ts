import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { PurchaseRoutingModule } from "./purchase-routing.module";
import { PurchaseHomeComponent } from "./purchase-home/purchase-home.component";
import { MatDialogModule } from "@angular/material";
import { SharedServiceModuleModule } from "src/app/shared/modules/shared-service-module/shared-service-module.module";
import { IndentReportComponent } from './indent-report/indent-report.component';
import { VendorRfqComponent } from './vendor-rfq/vendor-rfq.component';
import { AddProductAndVendorComponent } from './vendor-rfq/create-update-vendor-rfq/add-product-and-vendor/add-product-and-vendor.component';
import { SendToVendorComponent } from './vendor-rfq/create-update-vendor-rfq/send-to-vendor/send-to-vendor.component';
import { QuotationAndApprovalComponent } from './vendor-rfq/create-update-vendor-rfq/quotation-and-approval/quotation-and-approval.component';
import { VendorProductMasterComponent } from './vendor-product-master/vendor-product-master.component';
import { ProductMasterImportComponent } from './vendor-product-master/product-master-import/product-master-import.component';
import { CreateProductComponent } from './vendor-product-master/manual-entry-product-master/create-product/create-product.component';
import { ManualEntryHomeComponent } from './vendor-product-master/manual-entry-product-master/manual-entry-home/manual-entry-home.component';
import { RfqApprovalModalComponent } from './vendor-rfq/create-update-vendor-rfq/quotation-and-approval/rfq-approval-modal/rfq-approval-modal.component';
import { ProductsTableComponent } from './vendor-product-master/manual-entry-product-master/products-table/products-table.component';
import { ProdVendorDetailsComponent } from './vendor-rfq/create-update-vendor-rfq/send-to-vendor/prod-vendor-details/prod-vendor-details.component';
import { QuotationDetailsModalComponent } from './vendor-rfq/create-update-vendor-rfq/send-to-vendor/quotation-details-modal/quotation-details-modal.component';
import { RfqPurposeMappingComponent } from './rfq-purpose-mapping/rfq-purpose-mapping.component';
import { PrincipleVendorMappingComponent } from './principle-vendor-mapping/principle-vendor-mapping.component';
import { VendorBankDetailsComponent } from './vendor-bank-details/vendor-bank-details.component';
import { UpdateVendorBankDetailsComponent } from './vendor-bank-details/update-vendor-bank-details/update-vendor-bank-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BankDetailsApprovalComponent } from './vendor-bank-details/bank-details-approval/bank-details-approval.component';
import { VendorBankDetailsApprovalActionComponent } from './vendor-bank-details/vendor-bank-details-approval-action/vendor-bank-details-approval-action.component';
import { GetVendorListComponent } from './vendor-bank-details/get-vendor-list/get-vendor-list.component';
import { VendorBankDetailsHistoryComponent } from './vendor-bank-details/vendor-bank-details-history/vendor-bank-details-history.component';
import { ManualDrCrComponent } from './manual-dr-cr/manual-dr-cr.component';
import { ManualDrCrSaveComponent } from './manual-dr-cr/manual-dr-cr-save/manual-dr-cr-save.component';


@NgModule({
  declarations: [
    PurchaseHomeComponent,
    IndentReportComponent,
    VendorRfqComponent,
    AddProductAndVendorComponent,
    SendToVendorComponent,
    QuotationAndApprovalComponent,
    VendorProductMasterComponent,
    ProductMasterImportComponent,
    CreateProductComponent,
    ManualEntryHomeComponent,
    RfqApprovalModalComponent,
    ProductsTableComponent,
    ProdVendorDetailsComponent,
    QuotationDetailsModalComponent,
    RfqPurposeMappingComponent,
    PrincipleVendorMappingComponent,
    VendorBankDetailsComponent,
    UpdateVendorBankDetailsComponent,
    BankDetailsApprovalComponent,
    VendorBankDetailsApprovalActionComponent,
    GetVendorListComponent,
    VendorBankDetailsHistoryComponent,
    ManualDrCrComponent,
    ManualDrCrSaveComponent
     
  ],
  imports: [
    CommonModule,
    PurchaseRoutingModule,
    MatDialogModule,
    SharedServiceModuleModule,
    FormsModule,
    ReactiveFormsModule,
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
  ],
  entryComponents: []
})
export class PurchaseModule { }
