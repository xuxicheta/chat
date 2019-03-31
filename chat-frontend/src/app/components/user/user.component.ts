import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ProfileService } from 'src/app/services/profile.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/common/classes/user.class';
import { filter, take } from 'rxjs/operators';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  public userForm: FormGroup;
  public spec: 'register' | 'user';
  private oldUser: User;

  get username(): FormControl {
    return this.userForm.get('username') as FormControl;
  }
  get password(): FormControl {
    return this.userForm.get('password') as FormControl;
  }
  get name(): FormControl {
    return this.userForm.get('name') as FormControl;
  }

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    console.log('user init');
    this.route.url.subscribe(url => {
      this.spec = url[0].path as 'register' | 'user';
      if (this.spec === 'register') {
        this.userForm = this.buildForm({} as User);
        this.username.setValidators([Validators.required, Validators.minLength(4)]);
        this.password.setValidators([Validators.required, Validators.minLength(5)]);
      } else if (this.spec === 'user') {
        const userData = this.route.snapshot.data.user;
        this.oldUser = new User(userData);
        this.userForm = this.buildForm(userData);
        this.userForm.get('username').disable();
        this.password.setValidators([Validators.minLength(5)]);
      }
    });
  }

  buildForm(userData: User): FormGroup {
    return this.fb.group({
      username: [userData.username || ''],
      password: [''],
      name: [userData.name || ''],
    });
  }

  formOnSubmit() {
    if (this.spec === 'register') {
      const data = { ...this.userForm.value };
      this.profileService.createUser(data)
        .subscribe(() => {
          this.profileService.acquireLogin(data.username, data.password);
          // listen for login one time, because acquireLogin dont return anything
          this.profileService.lg$.pipe(
            untilDestroyed(this),
            filter(lg => lg),
            take(1),
          )
            .subscribe(() => {
              this.userForm.reset();
              this.router.navigateByUrl('/chat');
            });
        });
    } else if (this.spec === 'user') {
      const data = { ...this.userForm.value };
      data.password = data.password ? data.password : undefined;

      this.profileService.updateUser(this.oldUser.userId, data).subscribe();
    }
  }

}
