import { Injectable } from '@angular/core';
import { StateService } from 'src/app/shared/services/state.service';

@Injectable()
export class ServiceForVendorRfqService {

  constructor( private state: StateService) { }

  formId = "152";
  vendorDetails = [];
  allProducts = [];
  productBuffer = [];
  bufferSize = 50;
  numberOfItemsFromEndBeforeFetchingMore = 10;
  loading = false;
  disabledButtonAndField=false;
  activeTab = 'V';
  //ifPageNum:any;
  vendorRfqView = {
    slctdLocation: undefined,
    singlePurpose: false,
    slctdPurpose: null,
    singleRfqType:false,
    slctdRfqType: null,
    slctdStatusType: null,
    singleVendor:false,
    slctdVendor:null,
    slctdType:null,
    rfqDetails:[],
    dates: {
      startDate: new Date(),
      endDate: new Date()
    },
  };
  vendorRfqCreate = {
    basicDetails : {
      slctdLocation: undefined,
      slctdPurpose: null,
      slctdRfqType: null,
      rfqId: null,
      status:null,
      ifPageNum:0,
      versionNumber:null,
      isUnderCreation:true,
      sendToVendorOfLatestVersion:false,
    },
    revisionDetails:[
      {
        addedProducts : [],  
        quoteDetails:[],
        enteredQuoteDetails:[],
        isSelected:false,
        canBeEdited:true,
        versionNumber:null,
        sentToVendors:false,
        latestVersion:false,
      }
    ],
    productAndVendorDetails : {
      addedVendors : [],
      addedProducts : [],
    },
  };
  isInUpdateMode = false;
  selectedRevisionIndex=null;
  quotationIndex=null;
  prodAndVendorDetailsView = {
    viewProductAndVendorDetails : false,
    versionNumber:null,
    rfqId:null,    
  }
  canBeEdited = true;
  companyDetails = this.state.getCompanyDetails();

  approvalModalReqObj = {
    rfqId:null,
    quoteId:null,
    versionNumber:null,
  }

  customSearchFnForVendor = (ter, obj) =>{
    return (
      (obj.vendorName && obj.vendorName.toLowerCase().indexOf(ter.toLowerCase()) != -1) ||
      (obj.vendorId && obj.vendorId.toLowerCase().indexOf(ter.toLowerCase()) != -1)
    );
  }
  customSearchFnForProduct = (ter, obj) =>{
    return (
      (obj.prodDesc && obj.prodDesc.toLowerCase().indexOf(ter.toLowerCase()) != -1) ||
      (obj.productId && obj.productId.toLowerCase().indexOf(ter.toLowerCase()) != -1) ||
      (obj.prodUnit && obj.prodUnit.toLowerCase().indexOf(ter.toLowerCase()) != -1)
    );
  }

  // storeSelectedRevisionIndex = (_Index) =>{
  //   this.selectedRevisionIndex = _Index;
  // }

  cancelUpdateMode = () =>{
    this.vendorRfqCreate = {
      basicDetails : {
        slctdLocation: undefined,
        slctdPurpose: null,
        slctdRfqType: null,
        rfqId: null,
        status:null,
        ifPageNum:0,
        versionNumber:null,
        isUnderCreation:true,
        sendToVendorOfLatestVersion:false,
      },
      revisionDetails:[
        {
          addedProducts : [],  
          quoteDetails:[],
          enteredQuoteDetails:[],
          isSelected:false,
          canBeEdited:true,
          versionNumber:null,
          sentToVendors:false,
          latestVersion:false,
        }
      ],
      productAndVendorDetails : {
        addedVendors : [],
        addedProducts : [],
      },
    };
    this.isInUpdateMode = false;
    this.selectedRevisionIndex = null;
    this.quotationIndex=null;
    this.prodAndVendorDetailsView = {
      viewProductAndVendorDetails : false,
      versionNumber:null,
      rfqId:null,    
    }
    this.activeTab = 'V';
    this.canBeEdited = true;
    this.approvalModalReqObj = {
      rfqId:null,
      quoteId:null,
      versionNumber:null,
    }
  }
}
