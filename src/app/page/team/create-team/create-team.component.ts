import { Component, OnInit, Input } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { TeamAdd } from 'src/app/interface/teamAdd';
import { NgForm } from '@angular/forms';
import { TeamService } from './team.service';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { SyncService } from 'src/app/service/sync.service';
import { catchError } from 'rxjs/operators';
import { UtilService } from 'src/app/service/util.service';


@Component({
  selector: 'app-create-team',
  templateUrl: './create-team.component.html',
  styleUrls: ['./create-team.component.scss'],
})
export class CreateTeamComponent implements OnInit {
  @Input() users: [];
  @Input() isEdit: Boolean;
  forEdit = this.isEdit;
  allDesignstions: any;
  checkoutForm;
  fields: TeamAdd = {
    id:null,
    userName: '',
    password: '',
    designationIds: null,
    email: '',
    name: '',
    employeeId: null,
    address: '',
    bloodgroup: '',
    mobileNumber: null,
    alternateMobileNumber: null,
  };

  constructor(private modalController: ModalController,
              private teamService: TeamService,
              private toastCtrl: ToastController,
              private router: Router,
              private syncService: SyncService,
              private utilService: UtilService,
              private formBuilder: FormBuilder) {
                this.checkoutForm = this.formBuilder.group({
                  id: null,
                  userName: '',
                  password: '',
                  designationIds: null,
                  email: '',
                  name: '',
                  employeeId: null,
                  address: '',
                  bloodgroup: '',
                  mobileNumber: null,
                  alternateMobileNumber: null,
                });
               }

  ngOnInit() {
    this.teamService.getDesignation()
    .pipe(
      catchError(this.utilService.handleError)
    ).subscribe(data => {
      console.log(data);
      this.allDesignstions = data;
    });
    this.fields.id = this.users['id'];
    this.fields.userName = this.users['userName'];
    this.fields.password = this.users['password'];
    this.fields.designationIds = this.users['designationIds'];
    this.fields.email = this.users['email'];
    this.fields.name = this.users['name'];
    this.fields.employeeId = this.users['employeeId'];
    this.fields.address = this.users['address'];
    this.fields.bloodgroup = this.users['bloodgroup'];
    this.fields.mobileNumber = this.users['mobileNumber'];
    this.fields.alternateMobileNumber = this.users['alternateMobileNumber'];
  }
  async close() {
    await this.modalController.dismiss();
  }
  async openToast() {
    const toast = await this.toastCtrl.create({
      message: 'Item added successfully.',
      duration: 2000
    });
    toast.present();
  }

  onSubmit(customerData) {
    const teamDetails = {
      id: this.fields.id,
      userName: this.fields.userName,
      password: this.fields.password,
      designationIds: this.fields.designationIds,
      email: this.fields.email,
      name: this.fields.name,
      employeeId: this.fields.employeeId,
      address: this.fields.address,
      bloodgroup: this.fields.bloodgroup,
      mobileNumber: this.fields.mobileNumber,
      alternateMobileNumber: this.fields.alternateMobileNumber
    };
    if (this.isEdit) {
      this.teamService.updateTeam(teamDetails)
      .pipe(
        catchError(this.utilService.handleError)
      ).subscribe(data => {
        this.openToast();
        console.log(data);
        this.modalController.dismiss();
        this.router.navigateByUrl('/home');
        this.syncService.syncData();
      });
    } else {
    this.teamService.saveTeam(teamDetails)
    .pipe(
      catchError(this.utilService.handleError)
    ).subscribe(data => {
      this.openToast();
      console.log(data);
      this.router.navigateByUrl('/home');
      this.modalController.dismiss();
      this.syncService.syncData();
    });
    console.warn('Your order has been submitted', customerData);
  }
}



}
