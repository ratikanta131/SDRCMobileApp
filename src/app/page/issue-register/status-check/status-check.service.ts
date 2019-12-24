import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constants } from 'src/constants';

@Injectable({
  providedIn: 'root'
})
export class StatusCheckService {
  status;

  constructor(private http: HttpClient) { }

  checkStatus(itemId) {
    const status = this.http.get(Constants.HOME_URL + 'api/assignment/getByItem/' + itemId);
    return status;
    
  }
}
