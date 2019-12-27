import {
  Injectable,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import {
  HttpErrorResponse
} from '@angular/common/http';
import {
  throwError,
  Subscription
} from 'rxjs';
import {
  ToastController, LoadingController
} from '@ionic/angular';
var obj;
@Injectable({
  providedIn: 'root'
})
export class UtilService implements OnDestroy{
  toastMessage: EventEmitter < string > ;
  toastMessageSubcription: Subscription;

  constructor(private toastCtrl: ToastController,
              public loadingController: LoadingController) {
    obj = this;
    this.toastMessage = new EventEmitter();
    this.toastMessageSubcription = this.toastMessage.subscribe(message => {
      this.openToast(message);
    });
  }
  handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      obj.toastMessage.emit(`Please check your internet connection.`);
    } else {
      if (error.error instanceof ErrorEvent) {
        // A client-side or network error occurred. Handle it accordingly.
        obj.toastMessage.emit('An error occurred:' + error.error.message);
      } else {
        switch (error.status) {
          case 403:
            obj.toastMessage.emit(error.error.error_description);
            break;
          default:
            obj.toastMessage.emit(error.error.message);
            break;
        }
      }
      // return an observable with a user-facing error message
      return throwError(
        'Something bad happened; please try again later.');
    }
  }
  async openToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000
    });
    toast.present();
  }
  ngOnDestroy() {
    this.toastMessageSubcription.unsubscribe();
  }

}
