import { Component, OnInit } from '@angular/core';
import { ModalService } from 'src/app/shared/services/modal.service';
import { StateService } from 'src/app/shared/services/state.service';
import { GetDataFromApiService } from 'src/app/shared/services/get-data-from-api.service';

@Component({
  selector: 'app-rfq-purpose-mapping',
  templateUrl: './rfq-purpose-mapping.component.html',
  styleUrls: ['./rfq-purpose-mapping.component.scss']
})
export class RfqPurposeMappingComponent implements OnInit {
  constructor(
    private serverService: GetDataFromApiService,
    private state: StateService,
    public modal: ModalService
  ) { }

  companyDetails = {
    CompanyFullName: null
  };
  showMappingTable = false;
  locations = [];
  allPurposes = [];
  userDetails = [];
  disabledButtonAndField = false;

  rfqPurposeUserMapping = {
    slctdLocation: undefined,
    slctdPurpose: {
      rfqPurposeTypeName: null,
      rfqPurposeTypeId: null,
    },
    mappedUserDetails: [],
  }

  newUser = {
    slctdUser: null
  }
  userAlreadyAdded = false;

  private _StartServerCall() {
    this.state.progressBarStart();
    this.disabledButtonAndField = true;
  }

  private _StopServerCall() {
    this.state.progressBarStop();
    this.disabledButtonAndField = false;
  }

  getAllLocations() {
    this.locations.length = 0;
    let companyId = this.companyDetails["CompanyId"];
    let request = { companyId, formId };
    this.serverService
      .post({ request }, "commonUIfunctionsModule/getLocationsForThisUser", {
        module: "vendor"
      })
      .subscribe(data => {
        if (data["response"]) {
          this.locations = data["response"];
        }
      });
  }

  getAllRfqControlTypes() {
    this._StartServerCall();
    let companyLocationId = this.rfqPurposeUserMapping.slctdLocation.companyLocationId
    let companyId = this.companyDetails["CompanyId"];
    let request = { companyId, formId, companyLocationId };
    this.serverService
      .post({ request }, "rfqUserMappingModule/getAllRfqControlTypes", {
        module: "purchase"
      })
      .subscribe(data => {
        this._StopServerCall();
        if (data["response"]) {
          this.allPurposes = data.response;
        }
      });
  }

  getUsersForCompanyAndLocation() {
    this.userDetails.length = 0;
    let companyLocationId = this.rfqPurposeUserMapping.slctdLocation.companyLocationId
    let companyId = this.companyDetails["CompanyId"];
    let request = { companyId, formId, companyLocationId };
    this.serverService
      .post({ request }, "rfqUserMappingModule/getUsersForCompanyAndLocation", {
        module: "purchase"
      })
      .subscribe(data => {
        if (data["response"]) {
          this.userDetails = data.response;
        }
      });
  }

  customSearchFnForUser = (ter, obj) => {
    return (
      (obj.userFullName && obj.userFullName.toLowerCase().indexOf(ter.toLowerCase()) != -1) ||
      (obj.userEmail && obj.userEmail.toLowerCase().indexOf(ter.toLowerCase()) != -1)
    );
  }

  holdMappedUsers = [];
  getAllUsersMappedWithRfqPurpose() {
    this._StartServerCall();
    this.showMappingTable = false;
    this.rfqPurposeUserMapping.mappedUserDetails.length = 0;
    this.holdMappedUsers.length = 0;
    let companyLocationId = this.rfqPurposeUserMapping.slctdLocation.companyLocationId
    let companyId = this.companyDetails["CompanyId"];
    let rfqPurposeTypeId = this.rfqPurposeUserMapping.slctdPurpose.rfqPurposeTypeId
    let request = { companyId, formId, companyLocationId, rfqPurposeTypeId };
    this.serverService
      .post({ request }, "rfqUserMappingModule/getAllUsersMappedWithRfqPurpose", {
        module: "purchase"
      })
      .subscribe(data => {
        this._StopServerCall();
        this.showMappingTable = true;
        if (data["response"]) {
          this.rfqPurposeUserMapping.mappedUserDetails = JSON.parse(JSON.stringify(data.response));
          this.holdMappedUsers = JSON.parse(JSON.stringify(data.response));
        }
      });
  }

  mapNewUser = () => {
    this.newUser = {
      slctdUser: null
    }
    this.userAlreadyAdded = false;
  }

  toggleUserMappingWithRfqPurposeType(_Index) {
    this.userAlreadyAdded = false;
    if (_Index == undefined) {
      let _UserId = JSON.parse(JSON.stringify(this.newUser.slctdUser.userId));
      for (var i of this.rfqPurposeUserMapping.mappedUserDetails) {
        if (i.userId == _UserId) {
          this.userAlreadyAdded = true;
        }
      }
      if (this.userAlreadyAdded) return;
    }
    this._StartServerCall();
    let companyLocationId = this.rfqPurposeUserMapping.slctdLocation.companyLocationId
    let companyId = this.companyDetails["CompanyId"];
    let rfqPurposeTypeId = this.rfqPurposeUserMapping.slctdPurpose.rfqPurposeTypeId
    let userId = (_Index >= 0) ? this.rfqPurposeUserMapping.mappedUserDetails[_Index].userId : this.newUser.slctdUser.userId;
    let mappingId = (_Index >= 0) ? this.rfqPurposeUserMapping.mappedUserDetails[_Index].mappingId : null;
    let request = { companyId, formId, companyLocationId, rfqPurposeTypeId, userId, mappingId };
    this.serverService
      .post({ request }, "rfqUserMappingModule/toggleUserMappingWithRfqPurposeType", {
        module: "purchase"
      })
      .subscribe(data => {
        this._StopServerCall();
        this.showMappingTable = true;
        if (data["response"]) {
          this.rfqPurposeUserMapping.mappedUserDetails = JSON.parse(JSON.stringify(data.response));
          this.holdMappedUsers.length = 0;
          this.holdMappedUsers = JSON.parse(JSON.stringify(data.response));
          this.mapNewUser();
        }
      });
  }

  ngOnInit() {
    this.companyDetails = this.state.getCompanyDetails();
    this.getAllLocations();
    this.rfqPurposeUserMapping.slctdPurpose = null;
  }
}
const formId = "159";
