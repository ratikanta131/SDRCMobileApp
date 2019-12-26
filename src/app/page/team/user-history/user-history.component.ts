import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IAssignModel } from 'src/app/interface/assignModel';

@Component({
  selector: 'app-user-history',
  templateUrl: './user-history.component.html',
  styleUrls: ['./user-history.component.scss'],
})
export class UserHistoryComponent {

  users: User[];
  @Input() assignModels: IAssignModel[];
  constructor(private modalController: ModalController) { }

  async close() {
    await this.modalController.dismiss();
  }

}
