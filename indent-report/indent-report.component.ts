import { Component, OnInit } from "@angular/core";
import { GetDataFromApiService } from "src/app/shared/services/get-data-from-api.service";
import { StateService } from "src/app/shared/services/state.service";
import { ModalService } from "src/app/shared/services/modal.service";
import { AngularCsv } from "angular7-csv/dist/Angular-csv";

@Component({
  selector: "app-indent-report",
  templateUrl: "./indent-report.component.html",
  styleUrls: ["./indent-report.component.scss"]
})
export class IndentReportComponent implements OnInit {
  constructor(
    private serverService: GetDataFromApiService,
    private state: StateService,
    public modal: ModalService
  ) {}

  companyDetails = {
    CompanyFullName: null
  };
  locations = [];
  disabledButtonAndField = false;
  showReportTable = false;

  indentReport = {
    slctdLocation: undefined,
    slctdReportType: undefined,
    dates: {
      startDate: new Date(),
      endDate: new Date()
    },
    reportTypes: [
      //{reportId: 1, reportName:"Indent Summary Report",csvFileName:"IndentSummaryReport",apiFunctionName:"getSummaryIndentReport"},
      {
        reportId: 2,
        reportName: "Indent Detailed Report",
        csvFileName: "IndentDetailedReport",
        apiFunctionName: "getDetailedIndentReport"
      },
      {
        reportId: 3,
        reportName: "Indent TAT Report",
        csvFileName: "IndentTATReport",
        apiFunctionName: "getTurnAroundTimeReportForIndentApproval"
      }
    ],
    reportDetails: {
      reportData: [],
      data: [],
      headers: []
    }
  };
  public daterange = {
    start: new Date(),
    end: new Date()
  };
  public options: any = {
    locale: { format: "YYYY-MM-DD" },
    alwaysShowCalendars: false
  };

  public selectedDate(value: any, datepicker?: any) {
    // this is the date the iser selected
    //console.log(value);

    // any object can be passed to the selected event and it will be passed back here
    datepicker.start = value.start;
    datepicker.end = value.end;

    // or manupulat your own internal property
    this.daterange.start = value.start;
    this.daterange.end = value.end;
    this.showReportTable = false;
  }

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

  getDataForView() {
    this._StartServerCall();
    this.showReportTable = false;
    this.indentReport.reportDetails = null;
    let companyId = this.companyDetails["CompanyId"];
    let companyLocationId = this.indentReport.slctdLocation.companyLocationId;
    let companyLocationName = this.indentReport.slctdLocation.locationName;
    let startDate =
      new Date(this.daterange.start).getFullYear() +
      "-" +
      (new Date(this.daterange.start).getMonth() + 1) +
      "-" +
      new Date(this.daterange.start).getDate();
    let endDate =
      new Date(this.daterange.end).getFullYear() +
      "-" +
      (new Date(this.daterange.end).getMonth() + 1) +
      "-" +
      new Date(this.daterange.end).getDate();
    let request = {
      companyId,
      formId,
      companyLocationId,
      companyLocationName,
      startDate,
      endDate
    };
    this.serverService
      .post(
        { request },
        "indentReportsModule/" +
          this.indentReport.slctdReportType.apiFunctionName,
        {
          module: "purchase"
        }
      )
      .subscribe(data => {
        this._StopServerCall();
        if (data["response"]) {
          this.showReportTable = true;
          this.indentReport.reportDetails = data["response"];
          if (data["response"].length == 0) {
            this.modal.openModal("No Data found", "No data for download");
            this.showReportTable = false;
          }
        }
      });
  }

  csvOptions = {
    fieldSeparator: ",",
    //quoteStrings: '"',
    decimalseparator: ".",
    //showLabels: true,
    //showTitle: true,
    //useBom: true,
    noDownload: false
  };

  downloadCSV() {
    new AngularCsv(
      this.indentReport.reportDetails.reportData,
      this.indentReport.slctdReportType.csvFileName + "_" + Date.now(),
      this.csvOptions
    );
  }

  ngOnInit() {
    this.companyDetails = this.state.getCompanyDetails();
    this.getAllLocations();
  }
}
const formId = "133";
