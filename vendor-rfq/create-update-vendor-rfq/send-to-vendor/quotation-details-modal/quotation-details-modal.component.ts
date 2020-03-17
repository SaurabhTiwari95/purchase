import { Component, OnInit, Input } from '@angular/core';
import { GetDataFromApiService } from 'src/app/shared/services/get-data-from-api.service';
import { StateService } from 'src/app/shared/services/state.service';
import { ModalService } from 'src/app/shared/services/modal.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { CommonFunctionService } from 'src/app/shared/services/common-function.service';
import { ServiceForVendorRfqService } from '../../../service-for-vendor-rfq.service';

@Component({
  selector: 'app-quotation-details-modal',
  templateUrl: './quotation-details-modal.component.html',
  styleUrls: ['./quotation-details-modal.component.scss']
})
export class QuotationDetailsModalComponent implements OnInit {

  @Input('quotationDetails') quotationDetails;

  constructor(
    private serverService: GetDataFromApiService,
    private state: StateService,
    private modal: ModalService,
    private smartModal: NgxSmartModalService,
    private commonFunctionService: CommonFunctionService,
    public service: ServiceForVendorRfqService
    ) { }
    
    onQuotationModalClose = () =>{
      this.quotationDetails = {
        enteredQuoteDetails:[],
        versionNumber:'',
        vendorName:'',
        vendorId:''
      }
      this.smartModal.getModal("quotationDetailsModal").close(); 
    }
    
    ngOnInit() {
      this.quotationDetails = {
        enteredQuoteDetails:[],
        versionNumber:'',
        vendorName:'',
        vendorId:''
      }
      //console.log(this.quotationDetails);
  }

}
