import { Component, OnInit } from '@angular/core';
import { ProfileService } from 'src/app/services/profile.service';
import { Router } from '@angular/router';
import { User } from 'src/app/common/classes/user.class';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  profile: User;

  constructor(
    public profileService: ProfileService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.profileService.getProfile$().subscribe(profile => {
      if (!this.profileService.getLogged()) {
        this.router.navigateByUrl('login');
      }
      this.profile = profile;
    });
  }

}
