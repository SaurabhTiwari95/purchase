import { Component, OnInit, Input, Output } from '@angular/core';
import { GetDataFromApiService } from 'src/app/shared/services/get-data-from-api.service';
import { ModalService } from 'src/app/shared/services/modal.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { TitleCasePipe } from '@angular/common';
import { StateService } from 'src/app/shared/services/state.service';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-unit-of-measurement-modal',
  templateUrl: './unit-of-measurement-modal.component.html',
  styleUrls: ['./unit-of-measurement-modal.component.scss']
})
export class UnitOfMeasurementModalComponent implements OnInit {

  constructor(
    private api: GetDataFromApiService,
    public modal: ModalService,
    public smartModal: NgxSmartModalService,
    public state: StateService
    // public local: LocalVendorProductMasterService,
  ) { }

  @Input() filterDataOfUnitOfMeasurement: any[]
  @Input() btnDisablingOnError
  @Input() unitOfMeasurementObj
  @Input() isUnitOfMeasurementUpdateMode
  @Input() measurmentUnitDetails: any[]
  @Input() slctdUnit
  @Input() productCreationObj

  @Output() measurmentUnitDetailsChange = new EventEmitter();


  companyDetails = this.state.getCompanyDetails()

  invalidFullNameOfUnit: boolean = false;
  invalidShortNameOfUnit: boolean = false;
  successMsg;
  errorMsg;
  indexOfUnit;
  disableButton: boolean = false;

  filterUnitDatatable(event) {
    this.filterDataOfUnitOfMeasurement = event.target.value ? this.measurmentUnitDetails.filter(elem => {
      if (elem.productSpecUnitName.toLowerCase().indexOf(event.target.value.toLowerCase()) != -1 ||
        elem.productSpecUnitShortName.toLowerCase().indexOf(event.target.value.toLowerCase()) != -1) {
        return true;
      } else {
        return false;
      }
    }) : this.measurmentUnitDetails
  }

  checkIfFullNameUnit(event) {
    let t = new TitleCasePipe()
    this.unitOfMeasurementObj.productSpecUnitName = t.transform(event.target.value);
    if (event.target.value.length > 50) {
      this.invalidFullNameOfUnit = true;
    } else {
      this.invalidFullNameOfUnit = false;
    }
    this.evaluateErrorFlagsInUnitOfMeasurementModal();
  }

  checkIfShortNameUnit(event) {
    if (event.target.value.length > 50) {
      this.invalidShortNameOfUnit = true;
    } else {
      this.invalidShortNameOfUnit = false;
    }
    this.evaluateErrorFlagsInUnitOfMeasurementModal();
  }


  evaluateErrorFlagsInUnitOfMeasurementModal() {
    this.btnDisablingOnError = (this.invalidFullNameOfUnit || this.invalidShortNameOfUnit)
  }

  addUpdateUnitOfMeasurement() {
    if (!this.isUnitOfMeasurementUpdateMode) {
      this.addProductUnit();
    } else {
      this.updateProductUnit();
    }
  }

  editProductUnit(_Index) {
    this.indexOfUnit = _Index;
    this.isUnitOfMeasurementUpdateMode = true;
    this.unitOfMeasurementObj = JSON.parse(JSON.stringify(this.filterDataOfUnitOfMeasurement[_Index]))
  }

  closeModalDataOfUnitOfMeasuremnt() {
    this.unitOfMeasurementObj.productSpecUnitName = null;
    this.unitOfMeasurementObj.productSpecUnitShortName = null;
    this.smartModal.getModal("myModalUnitOfMeasurement").close();
  }

  addProductUnit() {

    for (let i = 0; i < this.measurmentUnitDetails.length; i++) {
      if (this.measurmentUnitDetails[i].productSpecUnitName == this.unitOfMeasurementObj.productSpecUnitName
        && this.measurmentUnitDetails[i].productSpecUnitShortName == this.unitOfMeasurementObj.productSpecUnitShortName) {
        this.errorMsg = "Unit of Measurement already exists"
        setTimeout(() => {
          this.errorMsg = "";
        }, 3000);
        return;
      }
    }
    this.state.progressBarStart();
    this.disableButton = true;
    let request = {
      companyId: this.companyDetails.CompanyId,
      formId: "155",
      prodUnitName: this.unitOfMeasurementObj.productSpecUnitName,
      prodUnitShortName: this.unitOfMeasurementObj.productSpecUnitShortName,
    };

    this.api
      .post({ request }, "productMasterModule/addProductUnit", {
        module: "purchase"
      })
      .subscribe(data => {
        this.state.progressBarStop();
        this.disableButton = false;

        if (data.response) {
          this.measurmentUnitDetails = data.response;
          this.measurmentUnitDetailsChange.emit(this.measurmentUnitDetails)
          this.filterDataOfUnitOfMeasurement = this.measurmentUnitDetails.slice();
          this.unitOfMeasurementObj = {
            productSpecUnitName: null,
            productSpecUnitShortName: null,
          }
          this.successMsg = "Product Unit has been added successfully";
          setTimeout(() => {
            this.successMsg = "";
          }, 3000);
        }
        if (data.errorCode) {
          this.errorMsg = data.errorContent;
          setTimeout(() => {
            this.errorMsg = "";
          }, 3000);
        }
      });
  }

  updateProductUnit() {
    this.state.progressBarStart();
    this.disableButton = true;
    let request = {
      companyId: this.companyDetails.CompanyId,
      formId: "155",
      prodUnitName: this.unitOfMeasurementObj.productSpecUnitName,
      prodUnitShortName: this.unitOfMeasurementObj.productSpecUnitShortName,
      //productSpecUnitMasterId: this.filterDataOfUnitOfMeasurement[this.indexOfUnit].productSpecUnitMasterId
    };
    if (this.filterDataOfUnitOfMeasurement[this.indexOfUnit]) {
      request['productSpecUnitMasterId'] = this.filterDataOfUnitOfMeasurement[this.indexOfUnit].productSpecUnitMasterId;
    } else {
      request['productSpecUnitMasterId'] = this.unitOfMeasurementObj.productSpecUnitMasterId
    }

    this.api
      .post({ request }, "productMasterModule/updateProductUnit", {
        module: "purchase"
      })
      .subscribe(data => {
        this.state.progressBarStop();
        this.disableButton = false;
        if (data.response) {
          this.measurmentUnitDetails = data.response;
          this.filterDataOfUnitOfMeasurement = this.measurmentUnitDetails.slice();
          this.successMsg = "Product Unit has been updated successfully";
          setTimeout(() => {
            this.successMsg = "";
          }, 3000);

          this.isUnitOfMeasurementUpdateMode = false;
          this.unitOfMeasurementObj = {
            productSpecUnitName: null,
            productSpecUnitShortName: null,
          }
        }
        if (data.errorCode) {
          this.errorMsg = data.errorContent;
          setTimeout(() => {
            this.errorMsg = "";
          }, 3000);
        }
      });
  }

  cancelUnitOfMeasurement() {
    this.unitOfMeasurementObj = {
      productSpecUnitName: null,
      productSpecUnitShortName: null,
    }
    this.isUnitOfMeasurementUpdateMode = false;
  }

  ngOnInit() {
  }

}
