import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { _routes } from "./routes";

const routes: Routes = _routes;

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseRoutingModule {}
