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
  groupManage: BehaviorSubject<any>;
  constructor(private httpClient: HttpClient) {
    this.groupOverview = new BehaviorSubject({});
    this.groupProfiles = new BehaviorSubject({});
    this.groupManage = new BehaviorSubject({});
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

  // -------------------------------ADMIN BIO API-------------------------------------//

  //GET ADMIN BIO DETAILS
  getAdminBio(token: any) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Authorization', 'Bearer ' + token);
    return this.httpClient.get(this.API_URL + 'get-admin-bio', {
      headers: headers,
    });
  }
  //SAVE ADMIN BIO DETAILS
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
  //PREVIEW ADMIN BIO DETAILS
  getAdminBioPreivew(id: any) {
    return this.httpClient.get(this.API_URL + 'get-admin-preview/' + id);
  }
  // CHECK UNIQUE USER NAME FOR ADMIN BIO SLUG
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

  // -------------------------GROUP PROFILES API-----------------------------------------//

  //GROUPS DETAILS WITH PROFILE / OBSERVABLE
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
  // GET GROUPS DETAILS
  getGroupDetails(token: any) {
    console.log(token);
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Authorization', 'Bearer ' + token);
    return this.httpClient.get(this.API_URL + 'get-group-profile', {
      headers: headers,
    });
  }
  // GET PARTICULAR GROUP PROFILE DETAILS
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
  // SAVE GROUP PROFILE
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
  // GET GROUP PROFILE IMAGES
  getGProfileImages(token: any, groupProfileId: any) {
    console.log(token);
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Authorization', 'Bearer ' + token);
    return this.httpClient.get(
      this.API_URL +
        'get-group-profile-images?group_Profile_id=' +
        groupProfileId,
      { headers: headers }
    );
  }

  // VALIDATE UNIQUE GROUP NAME
  GroupUniqueNameExistsValidator(
    token: any,
    uniqueName: any
  ): AsyncValidatorFn {
    return (control: AbstractControl) => {
      return this.checkUniqueNameNotTaken(token, control.value).pipe(
        map((res) => (res ? { uniqueNameExists: true } : null))
      );
    };
  }

  // CHECK UNIQUE NAME FOR GROUP PROFILE SLUG
  checkUniqueNameNotTaken(token: any, uniqueName: string) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Authorization', 'Bearer ' + token);
    return this.httpClient.get(
      this.API_URL + 'check-unique-groupname/' + uniqueName,
      {
        headers: headers,
      }
    );
  }

  // ------------------------------------Group Profile PREVIEW API----------------------//

  getGroupProfilePreview(slug: any) {
    return this.httpClient.get(
      this.API_URL + 'get-group-profile-preview/' + slug
    );
  }

  // -------------------------------------Group Manage Profile--------------------------//
  getManageProfileDetails(id: any, group_id: any, token: any) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Authorization', 'Bearer ' + token);
    return this.httpClient.get(
      this.API_URL + 'app-get-manage-profile?group_id=' + id + '&id=' + id,
      { headers: headers }
    );
  }

  getGroupManage(): Observable<any> {
    console.log(this.groupManage);
    return this.groupManage.asObservable();
  }

  updateGroupManage(message: any) {
    this.groupManage.next(message);
  }

  getGroupManageValue() {
    console.log(this.groupManage.value);
    return this.groupManage.value;
  }
}
