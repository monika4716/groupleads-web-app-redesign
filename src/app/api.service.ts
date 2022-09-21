import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  API_URL = 'https://api.groupleads.net/api/';
  groupOverview: BehaviorSubject<any>;
  constructor(private httpClient: HttpClient) {
    this.groupOverview = new BehaviorSubject({});
  }

  loginUser(data: any) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Accept', 'application/json');
    return this.httpClient.post(this.API_URL + 'app-login-v2', data, {
      headers: headers,
    });
  }

  updateGroupOverview(message: any) {
    this.groupOverview.next(message);
  }

  getGroupOverview(): Observable<any> {
    console.log(this.groupOverview);
    return this.groupOverview.asObservable();
  }

  getGroupOverviewValue() {
    console.log(this.groupOverview.value);
    return this.groupOverview.value;
  }

  getGroupsList(token: any) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Authorization', 'Bearer ' + token);
    return this.httpClient.get(this.API_URL + 'app-get-group-list', {
      headers: headers,
    });
  }

  getAllLeadsCount(token: any) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Authorization', 'Bearer ' + token);
    return this.httpClient.get(this.API_URL + 'app-get-all-leads-count', {
      headers: headers,
    });
  }
  getGraphData(token: any, params: any) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Authorization', 'Bearer ' + token);
    return this.httpClient.post(this.API_URL + 'app-get-graph-data', params, {
      headers: headers,
    });
  }

  getLeadsData(token: any, params: any) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Authorization', 'Bearer ' + token);
    return this.httpClient.post(this.API_URL + 'app-get-leads-data', params, {
      headers: headers,
    });
  }

  deleteLeads(id: any, token: any) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Authorization', 'Bearer ' + token);
    return this.httpClient.post(this.API_URL + 'app-delete-lead', id, {
      headers: headers,
    });
  }
  getGridDataByFilter(token: any, params: any) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Authorization', 'Bearer ' + token);
    return this.httpClient.post(
      this.API_URL + 'app-get-group-data-by-filter',
      params,
      { headers: headers }
    );
  }
}
