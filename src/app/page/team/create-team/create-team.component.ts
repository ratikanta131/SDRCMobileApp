import { Component, OnInit, Input, OnDestroy, EventEmitter } from '@angular/core';
import { ModalController} from '@ionic/angular';
import { TeamAdd, ITeam } from 'src/app/interface/teamAdd';
import { TeamService } from './team.service';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { SyncService } from 'src/app/service/sync.service';
import { catchError } from 'rxjs/operators';
import { UtilService } from 'src/app/service/util.service';
import { LoadingService } from 'src/app/loading.service';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError, Subscription } from 'rxjs';
import { AuthService } from '../../login/auth.service';
var thisObject;

@Component({
  selector: 'app-create-team',
  templateUrl: './create-team.component.html',
  styleUrls: ['./create-team.component.scss'],
})
export class CreateTeamComponent implements OnInit, OnDestroy {

  title = '';
  submitButtonText = '';
  @Input() user: ITeam;
  @Input() isEdit: boolean;
  forEdit = this.isEdit;
  allDesignstions: any;
  checkoutForm;
  fields: TeamAdd = {
    id:null,
    userName: '',
    password: '',
    designationIds: null,
    email: '',
    name: '',
    employeeId: null,
    address: '',
    bloodgroup: '',
    mobileNumber: null,
    alternateMobileNumber: null,
  };
  closeModal: EventEmitter < string > ;
  closeModalSubscription: Subscription;

  constructor(private modalController: ModalController,
              private teamService: TeamService,
              private router: Router,
              private syncService: SyncService,
              private loadingService: LoadingService,
              private utilService: UtilService,
              private formBuilder: FormBuilder,
              private authService: AuthService) {
                this.checkoutForm = this.formBuilder.group({
                  id: null,
                  userName: '',
                  password: '',
                  designationIds: null,
                  email: '',
                  name: '',
                  employeeId: null,
                  address: '',
                  bloodgroup: '',
                  mobileNumber: null,
                  alternateMobileNumber: null,
                });
                this.closeModal = new EventEmitter();
                this.closeModalSubscription = this.closeModal.subscribe(message => {
                  this.loadingService.dismissLoader();
                  this.modalController.dismiss();
                });
               }

  ngOnInit() {
    if (this.isEdit) {
      this.title = 'Edit Team';
      this.submitButtonText = 'Edit';
      this.fields.id = this.user.id;
      this.fields.userName = this.user.userName;
      this.fields.password = this.user.password;
      this.fields.designationIds = this.user.designationIds;
      this.fields.email = this.user.email;
      this.fields.name = this.user.name;
      this.fields.employeeId = this.user.employeeId;
      this.fields.address = this.user.address;
      this.fields.bloodgroup = this.user.bloodgroup;
      this.fields.mobileNumber = this.user.mobileNumber;
      this.fields.alternateMobileNumber = this.user.alternateMobileNumber;
    } else {
      this.title = 'Create Team';
      this.submitButtonText = 'Create';
    }
    this.loadingService.presentLoader('Fetching designation, please wait...');
    thisObject = this;
    this.teamService.getDesignation()
    .pipe(
      catchError(this.handleError)
    ).subscribe(data => {
      this.allDesignstions = data;
      this.loadingService.dismissLoader();
    });
  }
  async close() {
    await this.modalController.dismiss();
  }

  onSubmit() {
    const teamDetails = {
      id: this.fields.id,
      userName: this.fields.userName,
      password: this.fields.password,
      designationIds: this.fields.designationIds,
      email: this.fields.email,
      name: this.fields.name,
      employeeId: this.fields.employeeId,
      address: this.fields.address,
      bloodgroup: this.fields.bloodgroup,
      mobileNumber: this.fields.mobileNumber,
      alternateMobileNumber: this.fields.alternateMobileNumber
    };
    if (this.isEdit) {
      this.loadingService.presentLoader('Updating user, please wait...');
      this.teamService.updateTeam(teamDetails)
      .pipe(
        catchError(this.handleError)
      ).subscribe(() => {
        this.modalController.dismiss();
        this.updateDataInLocalDatabase('User updated successfully');
      });
    } else {
      this.loadingService.presentLoader('Creating user, please wait...');
      this.teamService.saveTeam(teamDetails)
      .pipe(
        catchError(this.handleError)
      ).subscribe(data => {
        this.modalController.dismiss();
        this.updateDataInLocalDatabase('User created successfully');
      });
  }
}

handleError(error: HttpErrorResponse) {
  thisObject.closeModal.emit('');
  if (error.status === 0) {
      thisObject.utilService.openToast(`Please check your internet connection.`);
  } else {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      thisObject.utilService.openToast('An error occurred:' + error.error.message);
    } else {
      switch (error.status) {
        case 401:
          thisObject.utilService.openToast(error.error.error_description);
          thisObject.close();
          thisObject.authService.logout();
          thisObject.router.navigateByUrl('/login');
          thisObject.close();
          thisObject.closeModal.emit('');
          break;
        case 403:
          thisObject.utilService.openToast(error.error.error_description);
          break;
        default:
          thisObject.utilService.openToast(error.error.message);
          break;
      }
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }
}

updateDataInLocalDatabase(message: string) {
  this.syncService.syncData()
  .pipe(
    catchError(this.handleError)
  )
  .subscribe(
    async responseList => {
      await this.syncService.saveItem(responseList[0]);
      await this.syncService.saveUsers(responseList[1]);
      this.loadingService.dismissLoader();
      this.utilService.openToast(message);
      this.router.navigateByUrl('/home');
    }
  );
}

ngOnDestroy(): void {
  this.loadingService.dismissLoader();
  this.closeModalSubscription.unsubscribe();
  thisObject = null;
}

}
