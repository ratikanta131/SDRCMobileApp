import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Constants } from 'src/constants';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-user-history',
  templateUrl: './user-history.component.html',
  styleUrls: ['./user-history.component.scss'],
})
export class UserHistoryComponent implements OnInit {

  users: User[];
  @Input() data: any;
  @Input() id: number;
  modalData: Item[];
  constructor(private modalController: ModalController,
              private storage: Storage) { }

async  ngOnInit() {
    const userList = await this.storage.get(Constants.DATABASE_KEYS.user);
    this.users = userList.filter(item => item.id === this.id);
    this.modalData = this.data;
    console.log(this.data);
  }
  async close() {
    await this.modalController.dismiss();
  }

}
