import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-user-status',
  templateUrl: './user-status.component.html',
  styleUrls: ['./user-status.component.scss'],
})
export class UserStatusComponent implements OnInit {

  @Input() data: any;
  modalData:any;
  
  constructor(private modalController: ModalController) { }

  ngOnInit() {
    this.modalData = this.data;
    console.log(this.data);
  }
  async close() {
    await this.modalController.dismiss();
  }

}
