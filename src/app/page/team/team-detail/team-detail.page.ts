import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-team-detail',
  templateUrl: './team-detail.page.html',
  styleUrls: ['./team-detail.page.scss'],
})
export class TeamDetailPage implements OnInit {

  user: ITeam;
  designations = '';
  constructor(private service: UserTeamService,
              private authService: AuthService,
              private alertController: AlertController,
              private utilService: UtilService,
              private router: Router,
              private syncService: SyncService,
              private modalController: ModalController) { }

  ngOnInit() {
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
          console.log('Confirm Okay');

          this.service.disableUser(this.user.id)
            .pipe(
              catchError(this.utilService.handleError)
            ).subscribe(data => {
              this.utilService.openToast('Disable Successful');
              this.router.navigateByUrl('/home');
              this.syncService.syncData();
            });
        }
      }]
    });

    await alert.present();
  }

  statusCheck() {
    this.service.checkStatus(this.user.id)
    .pipe(
      catchError(this.utilService.handleError)
    ).subscribe(data => {
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
    this.service.historyUser(this.user.id)
      .pipe(
        catchError(this.utilService.handleError)
      ).subscribe(data => {
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

}
