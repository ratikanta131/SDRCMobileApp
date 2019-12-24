import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, ToastController } from '@ionic/angular';
import { Constants } from 'src/constants';
import { Storage } from '@ionic/storage';
import { DatePipe } from '@angular/common';
import { AssignService } from './assign.service';
import { catchError } from 'rxjs/operators';
import { UtilService } from 'src/app/service/util.service';
import { Router } from '@angular/router';
import { AuthService } from '../../login/auth.service';
import { Assign } from 'src/app/interface/assign';

@Component({
  selector: 'app-assign-item',
  templateUrl: './assign-item.component.html',
  styleUrls: ['./assign-item.component.scss'],
})
export class AssignItemComponent implements OnInit {
  selectedUserId: number;
  selectedItemId: number;
  users: User[];
  textToSearch: any;
  constructor(private modalController: ModalController,
              private storage: Storage,
              private assignService: AssignService,
              private datePipe: DatePipe,
              private navParams: NavParams,
              private utilService: UtilService,
              private router: Router,
              private authService: AuthService) { }
  async ngOnInit() {
    this.users = await this.storage.get(Constants.DATABASE_KEYS.user);
    this.selectedItemId = this.navParams.get('itemId');
  }

  filterItem(event) {
    this.textToSearch = event.detail.value;
  }
  async close() {
    await this.modalController.dismiss();
  }
  assign() {
    const issuedBy: number = this.authService.loggedInUser.userId;
    const assignment: Assign  = {
      assignedToUserId: this.selectedUserId,
      issueDate: this.datePipe.transform(new Date(), 'dd-MM-yyyy'),
      issuedBy,
      itemId: this.selectedItemId,
      receivedBy: null,
      returnDate: null
    };
    this.assignService.assignItem(assignment)
    .pipe(
      catchError(this.utilService.handleError)
    ).subscribe(data => {
    this.utilService.openToast('Assignment Successful');
    this.modalController.dismiss();
    this.router.navigateByUrl('/home');
    });
  }
  userSelected(userId: number) {
    this.selectedUserId = userId;
  }
}
