import { Routes } from "@angular/router";
import { PurchaseHomeComponent } from "./purchase-home/purchase-home.component";
import { IndentReportComponent } from './indent-report/indent-report.component';
import { VendorRfqComponent } from './vendor-rfq/vendor-rfq.component';
import { VendorProductMasterComponent } from './vendor-product-master/vendor-product-master.component';
import { RfqPurposeMappingComponent } from './rfq-purpose-mapping/rfq-purpose-mapping.component';
import { PrincipleVendorMappingComponent } from './principle-vendor-mapping/principle-vendor-mapping.component';
import { VendorBankDetailsComponent } from './vendor-bank-details/vendor-bank-details.component';
import { ManualDrCrComponent } from './manual-dr-cr/manual-dr-cr.component';


export const _routes: Routes = [
    { path: "", component: PurchaseHomeComponent },
    { path: "indent-report", component: IndentReportComponent, data: { state: "form" }, pathMatch: "full" },
    { path: "vendor-request-for-quotation", component: VendorRfqComponent, data: { state: "form" }, pathMatch: "full" },
    { path: "product-master", component: VendorProductMasterComponent, data: { state: "form" }, pathMatch: "full" },
    { path: "rfq-purpose-user-mapping", component: RfqPurposeMappingComponent, data: { state: "form" }, pathMatch: "full" },
    { path: "principal-vendor-mapping", component: PrincipleVendorMappingComponent, data: { state: "form" }, pathMatch: "full" },
    { path: "vendor-bank-details", component: VendorBankDetailsComponent, data: { state: "form" }, pathMatch: "full" },
    { path: "manual-dr-cr", component: ManualDrCrComponent, data: { state: "form" }, pathMatch: "full" },


    
];
