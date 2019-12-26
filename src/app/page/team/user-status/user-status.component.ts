import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IAssignModel } from 'src/app/interface/assignModel';

@Component({
  selector: 'app-user-status',
  templateUrl: './user-status.component.html',
  styleUrls: ['./user-status.component.scss'],
})
export class UserStatusComponent implements OnInit {

  @Input() assignModels: IAssignModel[];
  constructor(private modalController: ModalController) { }

  ngOnInit() {
  }
  async close() {
    await this.modalController.dismiss();
  }

}
