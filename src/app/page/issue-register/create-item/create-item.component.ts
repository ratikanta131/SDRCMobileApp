import {
  Component,
  OnInit,
  Input
} from '@angular/core';
import {
  ModalController,
  ToastController
} from '@ionic/angular';
import {
  FormGroup,
  FormBuilder,
  NgForm
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
import { UtilService } from 'src/app/service/util.service';
declare var $: any;

@Component({
  selector: 'app-create-item',
  templateUrl: './create-item.component.html',
  styleUrls: ['./create-item.component.scss'],
})
export class CreateItemComponent implements OnInit {

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
            private utilService: UtilService,
            private toastCtrl: ToastController,
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
    this.title = 'Edit Item';
  }


  }
  async openToast() {
    const toast = await this.toastCtrl.create({
      message: 'Item added successfully.',
      duration: 2000
    });
    toast.present();
  }

publishData(form: NgForm) {
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
      this.createService.updateData(itemDetails)
      .pipe(
        catchError(this.utilService.handleError)
      ).subscribe(data => {
        this.openToast();
        console.log(data);
        this.createService.syncData = data;
        form.resetForm();
        this.modalController.dismiss();
        this.router.navigateByUrl('/home');
        this.syncService.syncData();
      });
    } else {
      this.createService.saveData(itemDetails)
      .pipe(
        catchError(this.utilService.handleError)
      ).subscribe(data => {
        this.openToast();
        console.log(data);
        this.createService.syncData = data;
        form.resetForm();
        this.modalController.dismiss();
        this.router.navigateByUrl('/home');
        this.syncService.syncData();
      });
    }
  }

}
