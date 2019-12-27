import {
  Component,
  OnInit,
  Input,
  OnDestroy
} from '@angular/core';
import {
  ModalController,
  ToastController
} from '@ionic/angular';
import {
  FormGroup
} from '@angular/forms';
import {
  ItemAdd
} from 'src/app/interface/itemAdd';
import {
  CreateService
} from './create.service';
import { Router } from '@angular/router';
import { SyncService } from 'src/app/service/sync.service';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { LoadingService } from 'src/app/loading.service';
import { throwError } from 'rxjs';
import { AuthService } from '../../login/auth.service';
var thisObject;

@Component({
  selector: 'app-create-item',
  templateUrl: './create-item.component.html',
  styleUrls: ['./create-item.component.scss'],
})
export class CreateItemComponent implements OnInit, OnDestroy {

  title: string;

  @Input() item: Item;
  @Input() forEdit: boolean;
  form: FormGroup;
  fields: ItemAdd = {
    id: null,
    name: '',
    itemId: '',
    accessories: ''
  };

constructor(private modalController: ModalController,
            private createService: CreateService,
            private syncService: SyncService,
            private toastCtrl: ToastController,
            private loadingService: LoadingService,
            private authService: AuthService,
            private router: Router) {}

  async close() {
    await this.modalController.dismiss();
  }

ngOnInit() {
  if (this.forEdit) {
    this.title = 'Edit Item';
    this.fields.id = this.item.id;
    this.fields.name = this.item.name;
    this.fields.itemId = this.item.itemId;
    this.fields.accessories = this.item.accessories;
  } else {
    this.title = 'Create Item';
  }


  }
  async openToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000
    });
    toast.present();
  }

publishData() {
    thisObject = this;
    const itemDetails = {
      id: this.fields.id,
      itemId: this.fields.itemId,
      name: this.fields.name,
      accessories: this.fields.accessories,
      createdDate: null,
      updatedDate: null,
      isLive: true
    };
    if (this.forEdit) {
      this.loadingService.presentLoader('Updating Item, please wait...');
      this.createService.updateData(itemDetails)
      .pipe(
        catchError(this.handleError)
      ).subscribe(data => {
        this.createService.syncData = data;
        this.modalController.dismiss();
        this.updateDataInLocalDatabase();
      });
    } else {
      this.loadingService.presentLoader('Creating Item, please wait...');
      this.createService.saveData(itemDetails)
      .pipe(
        catchError(this.handleError)
      ).subscribe(data => {
        this.createService.syncData = data;
        this.modalController.dismiss();
        this.updateDataInLocalDatabase();
      });
    }
  }

  handleError(error: HttpErrorResponse) {
    thisObject.loadingService.dismissLoader();
    if (error.status === 0) {
        thisObject.openToast(`Please check your internet connection.`);
    } else {
      if (error.error instanceof ErrorEvent) {
        // A client-side or network error occurred. Handle it accordingly.
        thisObject.openToast('An error occurred:' + error.error.message);
      } else {
        switch (error.status) {
          case 401:
            thisObject.openToast(`Unauthorized`);
            thisObject.close();
            thisObject.authService.logout();
            thisObject.router.navigateByUrl('/login');
            break;
          case 403:
            thisObject.openToast(error.error.error_description);
            break;
          default:
            thisObject.openToast(error.error.message);
            break;
        }
      }
      // return an observable with a user-facing error message
      return throwError(
        'Something bad happened; please try again later.');
    }
  }


  updateDataInLocalDatabase() {
    this.syncService.syncData()
    .pipe(
      catchError(this.handleError)
    )
    .subscribe(
      async responseList => {
        await this.syncService.saveItem(responseList[0]);
        await this.syncService.saveUsers(responseList[1]);
        this.loadingService.dismissLoader();
        this.openToast('Item successfully added/ updated');
        this.router.navigateByUrl('/home');
      }
    );
  }

  ngOnDestroy(): void {
    thisObject = null;
  }

}
