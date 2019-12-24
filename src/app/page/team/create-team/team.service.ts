import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constants } from 'src/constants';
import { TeamAdd } from 'src/app/interface/teamAdd';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  info;
  constructor(private httpClient: HttpClient) { }

  saveTeam(details: TeamAdd) {
  const designationIds: number[] = [];
  details.designationIds.forEach(id => {
    designationIds.push(parseInt ( '' + id ) );
  });
  details.designationIds = [...designationIds];
  return this.httpClient.post(Constants.HOME_URL + 'createUser', details, { responseType: 'text' });
  }
  
  updateTeam(details: TeamAdd) {
    const designationIds: number[] = [];
    details.designationIds.forEach(id => {
      designationIds.push(parseInt ( '' + id ) );
    });
    details.designationIds = [...designationIds];
    const teamDetail =  {
      id: details.id,
      designationIds: details.designationIds,
      email: details.email,
      name: details.name,
      employeeId: details.employeeId,
      address: details.address,
      bloodgroup: details.bloodgroup,
      mobileNumber: details.mobileNumber,
      alternateMobileNumber: details.alternateMobileNumber
    }
    this.info = this.httpClient.post(Constants.HOME_URL + 'updateUser', teamDetail, { responseType: 'text' });
    return this.info;
    }

    getDesignation() {
      return this.httpClient.get(Constants.HOME_URL + 'getAllDesignations');
    }
}
