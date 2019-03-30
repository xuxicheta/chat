import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProfileService } from 'src/app/services/profile.service';
import { Router } from '@angular/router';

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
      username: ['username'],
      password: ['password'],
    });

    this.profileService.getProfile$().subscribe(() => {
      if (this.profileService.getLogged()) {
        this.router.navigateByUrl('layout');
      }
    });
  }

  public formOnSubmit() {
    this.profileService.aquireLogin(this.form.value.username, this.form.value.password);
  }

}
