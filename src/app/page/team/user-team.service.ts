import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constants } from 'src/constants';
import { ITeam } from 'src/app/interface/teamAdd';

@Injectable({
  providedIn: 'root'
})
export class UserTeamService {

  selectedUser: ITeam;

  constructor(private http: HttpClient) { }

  checkStatus(id) {
    return this.http.get<any>(Constants.HOME_URL + 'api/assignment/getByPerson/' + id);
  }
 
  deleteUser(id: number) {
    return this.http.delete(Constants.HOME_URL + 'api/item/delete/' + id );
  }

  disableUser(id: number) {
    return this.http.get(Constants.HOME_URL + 'disableUser?userId=' + id );
  }
  historyUser(itemId: number) {
    return this.http.get(Constants.HOME_URL + 'api/assignment/historyByPerson/' + itemId );
  }
}
