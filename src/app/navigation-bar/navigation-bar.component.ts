import { Component, OnInit } from '@angular/core';
import { SpinnerService } from '../general/spinner/spinner.service';
import { TokenStorageService } from '../user/auth/token-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss']
})
export class NavigationBarComponent implements OnInit {
  roles: string[];
  authority: string;

  constructor(
    private tokenStorage: TokenStorageService,
    private spinnerService: SpinnerService,
    private router: Router
  ) { }

  ngOnInit() {
    if (this.tokenStorage.getToken()) {
      this.roles = this.tokenStorage.getAuthorities();
      this.roles.every(role => {
        if (role === 'ROLE_ADMIN') {
          this.authority = 'admin';
          return false;
        }
        this.authority = 'user';
        return true;
      });
    } else {
      this.router.navigate(['auth', 'login']);
    }
  }

  showSpinner() {
    this.spinnerService.show();
  }

  logout() {
    this.spinnerService.show();
    this.tokenStorage.signOut();
    window.location.reload();
  }
}
