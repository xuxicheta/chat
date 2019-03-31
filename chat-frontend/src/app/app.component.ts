import { Component } from '@angular/core';
import { LocalStorageService, STORAGE_KEYS } from './services/local-storage.service';
import { ProfileService } from './services/profile.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    private localStorageService: LocalStorageService,
    private profileService: ProfileService,
    private route: ActivatedRoute,
  ) {
    const bearer = this.localStorageService.get(STORAGE_KEYS.BEARER);
    const userId = this.localStorageService.get(STORAGE_KEYS.USER_ID);
    if (bearer && userId) {
      this.profileService.checkLogin(bearer, userId);
    } else {
      this.profileService.doLogout();
    }
  }
}
