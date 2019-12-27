import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserTeamService } from '../user-team.service';
import { ITeam } from 'src/app/interface/teamAdd';
import { AuthService } from '../../login/auth.service';
import { AlertController, ModalController } from '@ionic/angular';
import { catchError } from 'rxjs/operators';
import { UtilService } from 'src/app/service/util.service';
import { Router } from '@angular/router';
import { SyncService } from 'src/app/service/sync.service';
import { UserStatusComponent } from '../user-status/user-status.component';
import { IAssignModel } from 'src/app/interface/assignModel';
import { CreateTeamComponent } from '../create-team/create-team.component';
import { UserHistoryComponent } from '../user-history/user-history.component';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { LoadingService } from 'src/app/loading.service';
var thisObject;
@Component({
  selector: 'app-team-detail',
  templateUrl: './team-detail.page.html',
  styleUrls: ['./team-detail.page.scss'],
})
export class TeamDetailPage implements OnInit, OnDestroy {

  user: ITeam;
  designations = '';
  constructor(private service: UserTeamService,
              private authService: AuthService,
              private alertController: AlertController,
              private utilService: UtilService,
              private router: Router,
              private loadingService: LoadingService,
              private syncService: SyncService,
              private modalController: ModalController) { }

  ngOnInit() {
    thisObject = this;
    this.user = this.service.selectedUser;
    this.user.designationNames.forEach(d => {
      this.designations += (d + ',');
    });
    this.designations = this.designations.substring(0, this.designations.length - 1);
  }

  async presentDisableAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'By disable, user is no longer part of team. Are you sure?',
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {
        }
      }, {
        text: 'yes',
        handler: () => {
          this.loadingService.presentLoader('Disabling user, please wait...');
          this.service.disableUser(this.user.id)
            .pipe(
              catchError(this.handleError)
            ).subscribe(data => {
              this.updateDataInLocalDatabase('Disable Successful');
            });
        }
      }]
    });

    await alert.present();
  }

  statusCheck() {
    this.loadingService.presentLoader('Checking status, please wait...');
    this.service.checkStatus(this.user.id)
    .pipe(
      catchError(this.handleError)
    ).subscribe(data => {
      this.loadingService.dismissLoader();
      this.showStatusCheckModal(data);
    });
  }

  async showStatusCheckModal(assignModels: IAssignModel[]) {
    const modal = await this.modalController.create({
      component: UserStatusComponent,
      componentProps: {
        assignModels,
      }
    });

    await modal.present();
  }

  editTeamData() {
    this.showCreateTeamModal();
  }

  async showCreateTeamModal() {
    const modal = await this.modalController.create({
      component: CreateTeamComponent,
      componentProps: {
        user: this.user,
        isEdit: true
      }
    });

    await modal.present();
  }

  history() {
    this.loadingService.presentLoader('Checking status, please wait...');
    this.service.historyUser(this.user.id)
      .pipe(
        catchError(this.handleError)
      ).subscribe(data => {
        this.loadingService.dismissLoader();
        const returnedModels: IAssignModel[] = data.filter(d => d.returnDate != null);
        const notReturnedModels: IAssignModel[] = data.filter(d => d.returnDate == null);
        const finalModels = notReturnedModels.concat(returnedModels);
        this.showHistoryModal(finalModels);
      });
  }


  async showHistoryModal(assignModels: IAssignModel[]) {
    const modal = await this.modalController.create({
      component: UserHistoryComponent,
      componentProps: {
        assignModels,
      }
    });

    await modal.present();
  }

  checkAuthority(authority: string) {
    return this.authService.checkAuthority(authority);
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

  handleError(error: HttpErrorResponse) {
    setTimeout(() => {
      thisObject.loadingService.dismissLoader();
    }, 1000);
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
            thisObject.authService.logout();
            thisObject.router.navigateByUrl('/login');
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

  ngOnDestroy(): void {
    thisObject = null;
  }

}
