import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { TokenStorageService } from '../auth/token-storage.service';
import { Router, Routes } from '@angular/router';
import { SpinnerService } from '../../general/spinner/spinner.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../../general/notification.service';
import { UtilsService } from '../../general/utils.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {

  loginForm: FormGroup;

  constructor(
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private spinnerService: SpinnerService,
    private router: Router,
    private notificationService: NotificationService,
    private utilsService: UtilsService
  ) {
    this.spinnerService.show();
  }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  ngOnInit() {
    this.loginForm = new FormGroup({
      username: new FormControl(null, [Validators.required, Validators.minLength(3)]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)])
    });

    if (this.tokenStorage.getToken()) {
      this.router.navigate(['']);
    }
  }

  ngAfterViewInit() {
    this.spinnerService.hide();
  }

  onSubmit() {
    this.spinnerService.show();
    this.authService.attemptAuth(this.loginForm.value).subscribe(
      data => {
        this.tokenStorage.saveToken(data.token);
        this.tokenStorage.saveUsername(data.username);
        this.tokenStorage.saveAuthorities(data.authorities);

        window.location.reload();
        this.router.navigate(['']);
      },
      error => {
        this.spinnerService.hide();
        this.notificationService.showError(this.utilsService.createErrorMessage(error.error.errors), null);
      }
    );
  }
}

export const loginRoutes: Routes = [
  {
    path: 'auth/login',
    component: LoginComponent
  }
];
