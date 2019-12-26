import { Component, OnInit, Input } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { TeamAdd, ITeam } from 'src/app/interface/teamAdd';
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

  title = '';
  submitButtonText = '';
  @Input() user: ITeam;
  @Input() isEdit: boolean;
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
    if (this.isEdit) {
      this.title = 'Edit Team';
      this.submitButtonText = 'Edit';
      this.fields.id = this.user.id;
      this.fields.userName = this.user.userName;
      this.fields.password = this.user.password;
      this.fields.designationIds = this.user.designationIds;
      this.fields.email = this.user.email;
      this.fields.name = this.user.name;
      this.fields.employeeId = this.user.employeeId;
      this.fields.address = this.user.address;
      this.fields.bloodgroup = this.user.bloodgroup;
      this.fields.mobileNumber = this.user.mobileNumber;
      this.fields.alternateMobileNumber = this.user.alternateMobileNumber;
    } else {
      this.title = 'Create Team';
      this.submitButtonText = 'Create';
    }
    this.teamService.getDesignation()
    .pipe(
      catchError(this.utilService.handleError)
    ).subscribe(data => {
      this.allDesignstions = data;
    });
  }
  async close() {
    await this.modalController.dismiss();
  }
  async openToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
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
        this.openToast('User updated successfully');
        this.modalController.dismiss();
        this.router.navigateByUrl('/home');
        this.syncService.syncData();
      });
    } else {
    this.teamService.saveTeam(teamDetails)
    .pipe(
      catchError(this.utilService.handleError)
    ).subscribe(data => {
      this.openToast('User added successfully');
      console.log(data);
      this.router.navigateByUrl('/home');
      this.modalController.dismiss();
      this.syncService.syncData();
    });
    console.warn('Your order has been submitted', customerData);
  }
}



}
