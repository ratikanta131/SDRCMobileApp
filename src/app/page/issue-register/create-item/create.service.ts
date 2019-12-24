import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constants } from 'src/constants';


@Injectable({
  providedIn: 'root'
})
export class CreateService {
 syncData: any;
  constructor(private httpClient: HttpClient) { }

  saveData(details) {
    return this.httpClient.post(Constants.HOME_URL + 'api/item/create', details, { responseType: 'text' });
  }
  updateData(details) {
    return this.httpClient.post(Constants.HOME_URL + 'api/item/update', details, { responseType: 'text' });
  }
}
