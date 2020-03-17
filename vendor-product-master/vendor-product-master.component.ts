import { Component, OnInit } from '@angular/core';
import { StateService } from 'src/app/shared/services/state.service';
import { GetDataFromApiService } from 'src/app/shared/services/get-data-from-api.service';
import { ModalService } from 'src/app/shared/services/modal.service';
import { LocalVendorProductMasterService } from './local-vendor-product-master.service';


@Component({
  selector: 'app-vendor-product-master',
  templateUrl: './vendor-product-master.component.html',
  styleUrls: ['./vendor-product-master.component.scss'],
  providers: [LocalVendorProductMasterService],
})
export class VendorProductMasterComponent implements OnInit {

  constructor(
    private state: StateService,
    private api: GetDataFromApiService,
    public modal: ModalService,
    public local: LocalVendorProductMasterService,

  ) { }

  resetImportDataOnManualEntry() {
    this.local.vendorProductImportObj = {
      fileData: null,
      parsedData: null,
      errorTitle: null,
      errorContent: null,
      parsedErrorFileFromApi: [],
    }
  }

  ngOnInit() {
  }

}
