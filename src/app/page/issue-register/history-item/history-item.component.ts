import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IAssignModel } from 'src/app/interface/assignModel';

@Component({
  selector: 'app-history-item',
  templateUrl: './history-item.component.html',
  styleUrls: ['./history-item.component.scss'],
})
export class HistoryItemComponent {
  @Input() assignModels: IAssignModel[];
  constructor(private modalController: ModalController) { }

  async close() {
    await this.modalController.dismiss();
  }
}
