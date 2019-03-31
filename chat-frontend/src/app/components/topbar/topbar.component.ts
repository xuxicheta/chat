import { Component, OnInit } from '@angular/core';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {
  constructor(
    public profileService: ProfileService,
  ) { }

  ngOnInit() {
  }

  onLogoutClick() {
    this.profileService.acquireLogout();
  }

}
