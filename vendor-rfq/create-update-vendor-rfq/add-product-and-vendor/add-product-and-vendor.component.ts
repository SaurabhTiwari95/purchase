import { Component, OnInit } from '@angular/core';
import { GetDataFromApiService } from 'src/app/shared/services/get-data-from-api.service';
import { StateService } from 'src/app/shared/services/state.service';
import { ModalService } from 'src/app/shared/services/modal.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { CommonFunctionService } from 'src/app/shared/services/common-function.service';
import { ServiceForVendorRfqService } from '../../service-for-vendor-rfq.service';

@Component({
  selector: 'app-add-product-and-vendor',
  templateUrl: './add-product-and-vendor.component.html',
  styleUrls: ['./add-product-and-vendor.component.scss']
})
export class AddProductAndVendorComponent implements OnInit {

  constructor( 
    private serverService: GetDataFromApiService,
    private state: StateService,
    public modal: ModalService,
    public smartModal: NgxSmartModalService,
    public commonFunctionService: CommonFunctionService,
    public service: ServiceForVendorRfqService
    ) { }

  productAlreadyAdded = false;
  vendorAlreadyAdded = false;
  newProduct = {
    slctdProduct : null,
    qauntity:null,
    prodDescription:null,
  }
  newVendor = {
    slctdVendor : null,
  }

  private _StartServerCall() {
    this.state.progressBarStart();
    this.service.disabledButtonAndField = true;
  }

  private _StopServerCall() {
    this.state.progressBarStop();
    this.service.disabledButtonAndField = false;
  }

  onScrollToEnd() {
    this.fetchMore();
  }

  onScroll({ end }) {
    if (this.service.loading || this.service.allProducts.length <= this.service.productBuffer.length) {
      return;
    }

    if (end + this.service.numberOfItemsFromEndBeforeFetchingMore >= this.service.productBuffer.length) {
      this.fetchMore();
    }
  }

  private fetchMore() {
    const len = this.service.productBuffer.length;
    const more = this.service.allProducts.slice(len, this.service.bufferSize + len);
    this.service.loading = true;
    // using timeout here to simulate backend API delay
    setTimeout(() => {
      this.service.loading = false;
      this.service.productBuffer = this.service.productBuffer.concat(more);
    }, 200)
  }

  createProduct = () =>{
    this.newProduct = {
      slctdProduct : null,
      qauntity:null,
      prodDescription:null,
    }
    this.productAlreadyAdded  = false;
    this.editMode             = false;
  }

  createVendor = () =>{
    this.newVendor = {
      slctdVendor : null,
    }
    this.vendorAlreadyAdded = false;
  }

  addProduct = () =>{
    this.productAlreadyAdded = false;
    for(let i = 0; i< this.service.vendorRfqCreate.productAndVendorDetails.addedProducts.length; i++){
      if(this.service.vendorRfqCreate.productAndVendorDetails.addedProducts[i].slctdProduct.productId == this.newProduct.slctdProduct.productId){
        this.productAlreadyAdded = true;
        break;
      }
    }
    if(this.productAlreadyAdded){
      this.modal.openModal("Product Already Added","Product already added. Please select another product");
      return;
    }
    this.service.vendorRfqCreate.productAndVendorDetails.addedProducts.push({...this.newProduct});
    this.createProduct();
  }
  
  editMode = false;

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

  addVendor = () =>{
    this.vendorAlreadyAdded = false;
    for(let i = 0; i< this.service.vendorRfqCreate.productAndVendorDetails.addedVendors.length; i++){
      if(this.service.vendorRfqCreate.productAndVendorDetails.addedVendors[i].slctdVendor.vendorId == this.newVendor.slctdVendor.vendorId){
        this.vendorAlreadyAdded = true;
        break;
      }
    }
    if(this.vendorAlreadyAdded){
      this.modal.openModal("Vendor Already Added","Vendor already added. Please select another vendor");
      return;
    }
    this.service.vendorRfqCreate.productAndVendorDetails.addedVendors.push({...this.newVendor});
    this.createVendor();

  }

  deleteProduct = _Index =>{
    this.service.vendorRfqCreate.productAndVendorDetails.addedProducts.splice(_Index,1);
  }
  
  deleteVendor = _Index =>{
    this.service.vendorRfqCreate.productAndVendorDetails.addedVendors.splice(_Index,1);
  }

  performActionAccordingToTheMode = () =>{
    if(!this.service.isInUpdateMode){
      this.saveVendorAndProductDetailsForRfq();
    }else{
      this.updateProductDetailsForRfq();
    }
  }

  saveVendorAndProductDetailsForRfq = () => {
    this._StartServerCall();
    return this.serverService
    .post({ request : {
      formId                  : this.service.formId,
      companyId               : this.service.companyDetails["CompanyId"],
      companyLocationId       : this.service.vendorRfqCreate.basicDetails.slctdLocation.companyLocationId,
      rfqTypeId               : this.service.vendorRfqCreate.basicDetails.slctdRfqType.typeId,
      purposeId               : this.service.vendorRfqCreate.basicDetails.slctdPurpose.purposeId,
      productAndVendorDetails : this.service.vendorRfqCreate.productAndVendorDetails
    } }
    , "vendorRfqModule/saveVendorAndProductDetailsForRfq", {
      module: "purchase"
    }).subscribe(data => {
      this._StopServerCall();
      if(data.response){
        this.service.vendorRfqCreate = {...this.service.vendorRfqCreate,...data.response};
        this.service.vendorRfqCreate.basicDetails.ifPageNum = 2;
        this.service.isInUpdateMode = true;
      }
      if(data.errorTitle){
        this.modal.openModal(data.errorTitle,data.errorContent);
      }
    })
  }
 
  updateProductDetailsForRfq = () => {
    this._StartServerCall();
    return this.serverService
    .post({ request : {
      formId                  : this.service.formId,
      companyId               : this.service.companyDetails["CompanyId"],
      companyLocationId       : this.service.vendorRfqCreate.basicDetails.slctdLocation.companyLocationId,
      rfqId                   : this.service.vendorRfqCreate.basicDetails.rfqId,
      versionNumber           : this.service.vendorRfqCreate.basicDetails.versionNumber,
      productAndVendorDetails : this.service.vendorRfqCreate.productAndVendorDetails
    } }
    , "vendorRfqModule/updateProductDetailsForRfq", {
      module: "purchase"
    }).subscribe(data => {
      this._StopServerCall();
      if(data.response){
        this.service.vendorRfqCreate = {...this.service.vendorRfqCreate,...data.response};
        this.service.vendorRfqCreate.basicDetails.ifPageNum = 2;
        this.service.isInUpdateMode = true;
      }
      if(data.errorTitle){
        this.modal.openModal(data.errorTitle,data.errorContent);
      }
    })
  }

  ngOnInit() {
    this.productAlreadyAdded = false;
  }

}
