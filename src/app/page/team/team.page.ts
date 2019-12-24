import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { CreateTeamComponent } from './create-team/create-team.component';
import { Constants } from 'src/constants';
import { Storage } from '@ionic/storage';
import { UserTeamService } from './user-team.service';
import { catchError } from 'rxjs/operators';
import { UserStatusComponent } from './user-status/user-status.component';
import { UtilService } from 'src/app/service/util.service';
import { Router } from '@angular/router';
import { SyncService } from 'src/app/service/sync.service';
import { UserHistoryComponent } from './user-history/user-history.component';
import { TeamAdd, ITeam } from 'src/app/interface/teamAdd';
import { AuthService } from '../login/auth.service';

@Component({
  selector: 'app-team',
  templateUrl: './team.page.html',
  styleUrls: ['./team.page.scss'],
})
export class TeamPage implements OnInit {

  textToSearch:any;
  users: User[];
  isEdit: boolean;
  constructor(private modalController: ModalController,
              private storage: Storage,
              private service: UserTeamService,
              private alertController: AlertController,
              private router: Router,
              private syncService: SyncService,
              private utilService: UtilService,
              private authService: AuthService) { }

 async ngOnInit() {
    this.users = await this.storage.get(Constants.DATABASE_KEYS.user);
  }

  toggleCollapse(index: number) {
    this.users[index].isCollapsed = !this.users[index].isCollapsed;
  }

  filterUSer(event) {
    this.textToSearch = event.detail.value;
  }


  async showCreateTeamModal(users, isEdit) {
    const modal = await this.modalController.create({
      component: CreateTeamComponent,
      componentProps: {
        users,
        isEdit
      }
    });

    await modal.present();
  }
  async presentDeleteAlertConfirm(index: number) {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'This will remove the user from team list. Are sure to delete the user?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'yes',
          handler: () => {
            console.log('Confirm Okay');
            const id = this.users[index].id;

            this.service.deleteUser(id)
    .pipe(
      catchError(this.utilService.handleError)
    ).subscribe(data => {
    this.utilService.openToast('Delete Successful');
    this.router.navigateByUrl('/home');
    this.syncService.syncData();
    });
          }
        }
      ]
    });

    await alert.present();
  }

  editTeamData(users: []) {
    this.isEdit =  true;
    this.showCreateTeamModal(users, this.isEdit);
    console.log(users);
  }

  

  historyCheck(index: number) {
    const id = this.users[index].id;
    this.service.historyUser(id)
      .pipe(
        catchError(this.utilService.handleError)
      ).subscribe(data => {
        this.showHistoryModal(index, id, data);
      });
  }


  async showHistoryModal(index: number, id: number, data) {
    const modal = await this.modalController.create({
      component: UserHistoryComponent,
      componentProps: {
        id,
        data,
      }
    });

    await modal.present();
  }

  userSelected(user: TeamAdd) {
    this.service.selectedUser = user as ITeam;
    this.router.navigateByUrl('/team/team-detail');
  }

  checkAuthority(authority: string) {
    return this.authService.checkAuthority(authority);
  }
}
