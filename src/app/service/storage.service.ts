import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { promise } from 'protractor';

export interface Item {
  accessories: string,
  id: number,
  itemId: string,
  name: string
}

const KEY = 'item';
const KEY2 = 'user';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private storage: Storage) { }

  addItem(item: Item): Promise<any> {
    return this.storage.get(KEY).then((items: Item[]) => {
      if (items) {
        items.push(item);
        return this.storage.set(KEY, items);
      } else {
        return this.storage.set(KEY, [item]);
      }
    });
  }
  assignUser(user: User): Promise<any> {
    return this.storage.get(KEY2).then((users: User[]) => {
      if (users) {
        users.push(user);
        return this.storage.set(KEY2, users);
      } else {
        return this.storage.set(KEY2, [user]);
      }
    });
  }
}
