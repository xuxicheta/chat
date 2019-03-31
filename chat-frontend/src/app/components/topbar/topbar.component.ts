import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProfileService } from 'src/app/services/profile.service';
import { Router } from '@angular/router';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit, OnDestroy {
  lg = this.profileService.lg$;
  constructor(
    public profileService: ProfileService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.profileService.lg$.pipe(untilDestroyed(this))
      .subscribe(lg => !lg && this.router.navigateByUrl('/login'));
  }

  ngOnDestroy() {}

  onLogoutClick() {
    this.profileService.acquireLogout();
  }

}
