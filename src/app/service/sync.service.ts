import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constants } from 'src/constants';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class SyncService {

  constructor(private httpClient: HttpClient, private storage: Storage) { }

  async syncData(): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      const data: Item[] = await this.httpClient.get<Item[]>(Constants.HOME_URL + 'api/item/allItems?lastSyncDate=null').toPromise();
      this.storage.set(Constants.DATABASE_KEYS.item, data);
      const user: User[] = await this.httpClient.get<User[]>(Constants.HOME_URL + 'api/user/allUsers?lastSyncDate=null').toPromise();
      this.storage.set(Constants.DATABASE_KEYS.user, user);
      resolve();
    });
  }

  async checkAndSyncData() {
    const data: User[] = await this.storage.get(Constants.DATABASE_KEYS.user);
    if (data === undefined || data == null || data.length === 0) {
      await this.syncData();
      return;
    } else {
      return;
    }
  }
}
