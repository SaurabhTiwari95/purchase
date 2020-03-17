import { Component, OnInit } from '@angular/core';
import { GetDataFromApiService } from 'src/app/shared/services/get-data-from-api.service';
import { StateService } from 'src/app/shared/services/state.service';
import { ModalService } from 'src/app/shared/services/modal.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { CommonFunctionService } from 'src/app/shared/services/common-function.service';
import { ServiceForVendorRfqService } from '../../../service-for-vendor-rfq.service';

@Component({
  selector: 'app-prod-vendor-details',
  templateUrl: './prod-vendor-details.component.html',
  styleUrls: ['./prod-vendor-details.component.scss']
})
export class ProdVendorDetailsComponent implements OnInit {

  constructor( 
    private serverService: GetDataFromApiService,
    private state: StateService,
    private modal: ModalService,
    private smartModal: NgxSmartModalService,
    private commonFunctionService: CommonFunctionService,
    public service: ServiceForVendorRfqService
    ) { }

  onProdAndVendorModalClose = () => {
    this.service.prodAndVendorDetailsView = {
        viewProductAndVendorDetails: false,
        versionNumber: null,
        rfqId: null
    }
    this.smartModal.getModal("prodAndVendorModal").close(); 
  }

  private _StartServerCall() {
    this.state.progressBarStart();
    this.service.disabledButtonAndField = true;
  }

  private _StopServerCall() {
    this.state.progressBarStop();
    this.service.disabledButtonAndField = false;
  }

  editMode = false;
  newProduct = {
    slctdProduct : {
      prodDesc: '',
      productId: '',
      prodUnit: ''
    },
    qauntity:null,
    prodDescription:null,
  }
  createProduct = () =>{
    this.newProduct = {
      slctdProduct : {
        prodDesc: '',
        productId: '',
        prodUnit: ''
      },
      qauntity:null,
      prodDescription:null,
    }
    this.editMode             = false;
  }

  editProduct = _Index => {
    this.newProduct = null;
    this.newProduct = {...this.service.vendorRfqCreate.productAndVendorDetails.addedProducts[_Index]};
    this.editMode   = true;
  }
  updateProduct = () =>{
    let _ProdIndex = this.commonFunctionService.getObjIndexInArray(this.service.vendorRfqCreate.productAndVendorDetails.addedProducts,'slctdProduct',this.newProduct.slctdProduct);
    this.service.vendorRfqCreate.productAndVendorDetails.addedProducts[_ProdIndex].prodDescription = this.newProduct.prodDescription;
    this.createProduct();
  }

  addNewVersionForRfq = () =>{
    this._StartServerCall();
    return this.serverService
    .post({ request : {
      formId                  : this.service.formId,
      companyId               : this.service.companyDetails["CompanyId"],
      companyLocationId       : this.service.vendorRfqCreate.basicDetails.slctdLocation.companyLocationId,
      rfqId                   : this.service.vendorRfqCreate.basicDetails.rfqId,
      productAndVendorDetails : this.service.vendorRfqCreate.productAndVendorDetails
    } }
    , "vendorRfqModule/addNewVersionForRfq", {
      module: "purchase"
    }).subscribe(data => {
      this._StopServerCall();
      if(data.response){
        this.modal.openModal("Successful","New Version Added Successfully");
        //this.service.vendorRfqCreate = null;
        this.onProdAndVendorModalClose();
        this.service.vendorRfqCreate = JSON.parse(JSON.stringify(data.response));
        //this.service.vendorRfqCreate.productAndVendorDetails.addedProducts.length = 0;
        this.service.vendorRfqCreate.basicDetails.ifPageNum = 2;
      }
      if(data.errorTitle){
        this.modal.openModal(data.errorTitle,data.errorContent);
      }
    })
  }

  ngOnInit() {
  }

}
