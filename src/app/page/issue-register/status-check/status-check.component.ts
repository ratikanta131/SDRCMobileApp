import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-status-check',
  templateUrl: './status-check.component.html',
  styleUrls: ['./status-check.component.scss'],
})
export class StatusCheckComponent {
  @Input() data: any;

  constructor(private modalController: ModalController) { }

  async close() {
    await this.modalController.dismiss();
  }

}
