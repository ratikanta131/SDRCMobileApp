import { Component, OnInit } from '@angular/core';
import { IssueRegisterService } from '../issue-register.service';
import { ModalController, AlertController } from '@ionic/angular';
import { CreateItemComponent } from '../create-item/create-item.component';
import { UtilService } from 'src/app/service/util.service';
import { catchError } from 'rxjs/operators';
import { StatusCheckComponent } from '../status-check/status-check.component';
import { HistoryItemComponent } from '../history-item/history-item.component';
import { IHistory } from 'src/app/interface/history';
import { AssignItemComponent } from '../assign-item/assign-item.component';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { SyncService } from 'src/app/service/sync.service';
import { AuthService } from '../../login/auth.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {

  item: Item;

  constructor(private service: IssueRegisterService,
              private modalController: ModalController,
              private utilService: UtilService,
              private alertController: AlertController,
              private datePipe: DatePipe,
              private router: Router,
              private syncService: SyncService,
              private authService: AuthService) { }

  ngOnInit() {
    this.item = this.service.selectedItem;
  }

  assign() {
    this.showAssignItemModal();
  }
  return() {
    this.presentReturnAlertConfirm();
  }
  status() {
    this.service.checkStatus(this.item.id)
      .pipe(
        catchError(this.utilService.handleError)
      ).subscribe(data => {
        this.showStatusCheckModal(data);
      });
  }
  history() {
    this.service.historyItem(this.item.id)
      .pipe(
        catchError(this.utilService.handleError)
      ).subscribe(data => {
        // check if the item is currently issued to someone
        const index = data.findIndex(d => d.returnDate === null);
        if (index > -1) {
          const history = data[index];
          data.splice(index, 1);
          data.splice(0, 0, history);
        }
        this.showHistoryModal(data);
      });
  }
  edit() {
    this.showEditItemModal();
  }
  delete() {
    this.presentDeleteAlertConfirm();

  }

  async showEditItemModal() {
    const modal = await this.modalController.create({
      component: CreateItemComponent,
      componentProps: {
        item: this.item,
        forEdit: true
      }
    });

    await modal.present();
  }

  async showStatusCheckModal(data) {
    const modal = await this.modalController.create({
      component: StatusCheckComponent,
      componentProps: {
        data,
      }
    });

    await modal.present();
  }

  async showHistoryModal(history: IHistory[]) {
    const modal = await this.modalController.create({
      component: HistoryItemComponent,
      componentProps: {
        history,
      }
    });

    await modal.present();
  }

  async showAssignItemModal() {
    const modal = await this.modalController.create({
      component: AssignItemComponent,
      componentProps: {
        itemId: this.item.id
      }
    });

    await modal.present();
  }

  async presentReturnAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Confirm return !!!',
      buttons: [{
        text: 'No',
        role: 'cancel',
        cssClass: 'secondary',
        handler: (blah) => {
        }
      }, {
        text: 'Yes',
        handler: () => {
          const returnDate: string = this.datePipe.transform(new Date(), 'dd-MM-yyyy');

          this.service.returnItem(this.item.id, returnDate)
            .pipe(
              catchError(this.utilService.handleError)
            ).subscribe(data => {
              this.utilService.openToast('Return Successful');
              this.modalController.dismiss();
              this.router.navigateByUrl('/home');
            });
        }
      }]
    });

    await alert.present();
  }

  async presentDeleteAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'This will remove the item from list. Are sure to delete the item?',
      buttons: [{
        text: 'No',
        role: 'cancel',
        cssClass: 'secondary',
        handler: (blah) => {
        }
      }, {
        text: 'Yes',
        handler: () => {

          this.service.deleteItem(this.item.id)
            .pipe(
              catchError(this.utilService.handleError)
            ).subscribe(() => {
              this.utilService.openToast('Delete Successful');
              this.router.navigateByUrl('/home');
              this.syncService.syncData();
            });
        }
      }]
    });

    await alert.present();
  }

  checkAuthority(authority: string) {
    return this.authService.checkAuthority(authority);
  }

}
