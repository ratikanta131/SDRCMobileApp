import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Constants } from 'src/constants';
import { IUserInfo } from 'src/app/interface/userInfo';

@Injectable({
  providedIn: 'root'
})
export class AssignService {

  constructor(private httpClient: HttpClient,
              private storage: Storage) { }

  assignItem(assignment) {
    return this.httpClient.post(Constants.HOME_URL + 'api/assignment/create', assignment);
  }
}
