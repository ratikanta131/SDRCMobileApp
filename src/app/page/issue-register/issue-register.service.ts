import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constants } from 'src/constants';
import { IHistory } from 'src/app/interface/history';

@Injectable()

export class IssueRegisterService {

    selectedItem: Item;

    constructor(private http: HttpClient) {}

    returnItem(itemId: number, returnDate: string) {
        return this.http.post(Constants.HOME_URL + 'api/assignment/submit?itemId=' + itemId + '&returnDate=' + returnDate, null);
    }
    deleteItem(itemId: number) {
        return this.http.delete(Constants.HOME_URL + 'api/item/delete/' + itemId );
    }
    historyItem(itemId: number) {
        return this.http.get<IHistory[]>(Constants.HOME_URL + 'api/assignment/historyByItem/' + itemId );
    }
    checkStatus(itemId: number) {
        return this.http.get(Constants.HOME_URL + 'api/assignment/getByItem/' + itemId);
    }
}
