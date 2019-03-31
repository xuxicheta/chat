import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ProfileService } from 'src/app/services/profile.service';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/common/classes/user.class';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  public userForm: FormGroup;
  public spec: 'register' | 'user';
  private oldUser: User;

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.url.subscribe(url => {
      this.spec = url[0].path as 'register' | 'user';
      if (this.spec === 'register') {
        this.userForm = this.buildForm({} as User);
      } else if (this.spec === 'user') {
        const userData = this.route.snapshot.data.user;
        this.oldUser = new User(userData);
        this.userForm = this.buildForm(userData);
      }
    });
  }

  buildForm(userData: User): FormGroup {
    const form =  this.fb.group({
      username: [userData.username || ''],
      password: [''],
      name: [userData.name || ''],
    });
    form.get('username').disable();
    return form;
  }

  formOnSubmit() {
    if (this.spec === 'register') {
      this.profileService.createUser(this.userForm.value);
    } else if (this.spec === 'user') {
      const data = { ...this.userForm.value };
      data.password = data.password ? data.password : undefined;
      this.profileService.updateUser(this.oldUser.userId, this.userForm.value).subscribe();
    }
  }

}
