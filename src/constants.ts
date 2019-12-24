import { DatabaseKey } from './app/interface/databaseKey';
import { IAuthorities } from './app/interface/authorities';

export class Constants {
    public static get HOME_URL(): string { return 'https://devserver.sdrc.co.in/sdrcapp/'; }
    public static DATABASE_KEYS: DatabaseKey = {
        item: 'ITEM',
        user: 'USER',
        userInfo: 'USERINFO'
    };
    public static AUTHORITIES: IAuthorities = {
        ITEM_ALL_OPERATION: `ITEM_ALL_OPERATION`,
        USER_MGMT_ALL_API: `USER_MGMT_ALL_API`

    };
}
