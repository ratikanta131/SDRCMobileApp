import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IHistory } from 'src/app/interface/history';

@Component({
  selector: 'app-history-item',
  templateUrl: './history-item.component.html',
  styleUrls: ['./history-item.component.scss'],
})
export class HistoryItemComponent implements OnInit {
  @Input() history: IHistory[];
  constructor(private modalController: ModalController) { }

  ngOnInit() {
  }
  async close() {
    await this.modalController.dismiss();
  }
}
