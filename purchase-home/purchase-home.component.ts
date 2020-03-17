import { Component, OnInit } from "@angular/core";
import { AngOneCallerService } from "src/app/shared/services/ang-one-caller.service";
import { configData } from "../../../config";
import { StateService } from "src/app/shared/services/state.service";
@Component({
  selector: "app-purchase-home",
  templateUrl: "./purchase-home.component.html",
  styleUrls: ["./purchase-home.component.scss"]
})
export class PurchaseHomeComponent implements OnInit {
  constructor(
    private ngOne: AngOneCallerService,
    private state: StateService
  ) {}
  openForm(link) {
    let base = configData["basePathForProduction"]
      ? configData["basePathForProduction"]
      : configData["basePathForLogin"];
    window.location.href = base + link;
  }
  company;
  ngOnInit() {
    this.company = this.state.getCompanyDetails();
  }
}
