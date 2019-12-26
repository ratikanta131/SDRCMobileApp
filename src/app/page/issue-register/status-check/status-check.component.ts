import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IAssignModel } from 'src/app/interface/assignModel';

@Component({
  selector: 'app-status-check',
  templateUrl: './status-check.component.html',
  styleUrls: ['./status-check.component.scss'],
})
export class StatusCheckComponent {
  @Input() assignModel: IAssignModel;
  constructor(private modalController: ModalController) { }

  async close() {
    await this.modalController.dismiss();
  }

}
