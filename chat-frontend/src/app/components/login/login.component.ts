import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProfileService } from 'src/app/services/profile.service';
import { Router } from '@angular/router';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private profileService: ProfileService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      username: [''],
      password: [''],
    });

    this.profileService.lg$
      .pipe(untilDestroyed(this))
      .subscribe((value) => {
        if (value) {
          this.router.navigateByUrl('/chat');
        }
      });
  }

  public formOnSubmit() {
    this.profileService.acquireLogin(this.form.value.username, this.form.value.password);
  }

}
