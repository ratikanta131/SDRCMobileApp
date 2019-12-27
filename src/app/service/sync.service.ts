import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Constants } from 'src/constants';
import { Storage } from '@ionic/storage';
import { forkJoin, Observable } from 'rxjs';
import { UtilService } from './util.service';

@Injectable({
  providedIn: 'root'
})
export class SyncService {


  constructor(private http: HttpClient, private storage: Storage, private utilService: UtilService
              ) {}

  syncData(): Observable<any[]> {

    const items = this.http.get(Constants.HOME_URL + 'api/item/allItems?lastSyncDate=null');
    const users = this.http.get(Constants.HOME_URL + 'api/user/allUsers?lastSyncDate=null');
    return forkJoin([items, users]);
  }

  async isMasterDataPresent() {
    const data: User[] = await this.storage.get(Constants.DATABASE_KEYS.user);
    if (data === undefined || data == null || data.length === 0) {
      return false;
    } else {
      return true;
    }
  }

  async saveUsers(users: User[]) {
      await this.storage.set(Constants.DATABASE_KEYS.user, users);
  }
  async saveItem(items: Item[]) {
    await this.storage.set(Constants.DATABASE_KEYS.item, items);
  }
}
