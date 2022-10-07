import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AbstractControl, AsyncValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  API_URL = 'https://api.groupleads.net/api/';
  groupOverview: BehaviorSubject<any>;
  groupProfiles: BehaviorSubject<any>;
  constructor(private httpClient: HttpClient) {
    this.groupOverview = new BehaviorSubject({});
    this.groupProfiles = new BehaviorSubject({});
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

  getAdminBio(token: any) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Authorization', 'Bearer ' + token);
    return this.httpClient.get(this.API_URL + 'get-admin-bio', {
      headers: headers,
    });
  }

  saveAdminBio(token: any, params: any) {
    console.log(token);
    console.log(params);
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Authorization', 'Bearer ' + token);
    return this.httpClient.post(this.API_URL + 'save-admin-bio', params, {
      headers: headers,
    });
  }
  getAdminBioPreivew(id: any) {
    return this.httpClient.get(this.API_URL + 'get-admin-preview/' + id);
  }

  checkUsernameNotTaken(token: any, username: string) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Authorization', 'Bearer ' + token);
    return this.httpClient.get(
      this.API_URL + 'check-unique-username/' + username,
      {
        headers: headers,
      }
    );
  }
  userExistsValidator(token: any, user: any): AsyncValidatorFn {
    return (control: AbstractControl) => {
      return this.checkUsernameNotTaken(token, control.value).pipe(
        map((res) => (res ? { userExists: true } : null))
      );
    };
  }

  //Group profile api

  getGroupProfile(): Observable<any> {
    console.log(this.groupProfiles);
    return this.groupProfiles.asObservable();
  }

  updateGroupProfile(message: any) {
    this.groupProfiles.next(message);
  }

  getGroupProfileValue() {
    console.log(this.groupProfiles.value);
    return this.groupProfiles.value;
  }

  getGroupDetails(token: any) {
    console.log(token);
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Authorization', 'Bearer ' + token);
    return this.httpClient.get(this.API_URL + 'get-group-profile', {
      headers: headers,
    });
  }
  getParticularGroupProfile(id: any, token: any, groupProfileId: any) {
    console.log(token);
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Authorization', 'Bearer ' + token);
    return this.httpClient.get(
      this.API_URL +
        'app-get-group-profile?group_id=' +
        id +
        '&id=' +
        groupProfileId,
      { headers: headers }
    );
  }

  saveGroupProfile(token: any, parm: any) {
    console.log(token);
    console.log(parm);
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Authorization', 'Bearer ' + token);
    return this.httpClient.post(this.API_URL + 'save-group-profile', parm, {
      headers: headers,
    });
  }
}
