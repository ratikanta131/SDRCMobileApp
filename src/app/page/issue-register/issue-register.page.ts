import {
  Component,
  OnInit
} from '@angular/core';
import {
  ModalController
} from '@ionic/angular';
import {
  CreateItemComponent
} from './create-item/create-item.component';
import {
  Storage
} from '@ionic/storage';
import {
  Constants
} from 'src/constants';
import {
  IssueRegisterService
} from './issue-register.service';
import {
  Router
} from '@angular/router';
import { AuthService } from '../login/auth.service';

@Component({
  selector: 'app-issue-register',
  templateUrl: './issue-register.page.html',
  styleUrls: ['./issue-register.page.scss'],
})
export class IssueRegisterPage implements OnInit {

  textToSearch: any;
  items: Item[];
  itemrefId: any;
  isCollapsed = true;
  isEdit: boolean;
  constructor(private modalController: ModalController,
              private service: IssueRegisterService,
              private router: Router,
              private storage: Storage,
              private authService: AuthService) {}


    filterItem(event) {
      this.textToSearch = event.detail.value;
    }


  toggleCollapse(itemId: number) {
    const index: number = this.items.findIndex(d => d.id === itemId);
    this.items[index].isCollapsed = !this.items[index].isCollapsed;
  }

  async ngOnInit() {
    this.items = await this.storage.get(Constants.DATABASE_KEYS.item);
  }

  async showCreateItemModal() {
    const modal = await this.modalController.create({
      component: CreateItemComponent,
      componentProps: {
        item: null,
        forEdit: false
      }
    });

    await modal.present();
  }
  itemSelected(item: Item) {
    this.service.selectedItem = item;
    this.router.navigate(['/issue-register/details']);
  }

  checkAuthority(authority: string) {
    return this.authService.checkAuthority(authority);
  }
}
