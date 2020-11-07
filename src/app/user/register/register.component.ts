import {AfterViewInit, Component, OnInit} from '@angular/core';
import { AuthService } from '../auth/auth.service';
import {Router, Routes} from '@angular/router';
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {TokenStorageService} from "../auth/token-storage.service";
import {NotificationService} from "../../general/notification.service";
import {UtilsService} from "../../general/utils.service";
import {SpinnerService} from "../../general/spinner/spinner.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, AfterViewInit {

  registerForm: FormGroup;

  constructor(
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private router: Router,
    private notificationService: NotificationService,
    private utilsService: UtilsService,
    private spinnerService: SpinnerService
  ) { }

  get username() {
    return this.registerForm.get('username');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get firstName() {
    return this.registerForm.get('firstName');
  }

  get lastName() {
    return this.registerForm.get('lastName');
  }

  ngOnInit() {
    this.registerForm = new FormGroup({
      username: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(40)]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      firstName: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
      lastName: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
      role: new FormArray([new FormControl('user')])
    });

    if (this.tokenStorage.getToken()) {
      this.router.navigate(['']);
    }
  }

  ngAfterViewInit() {
    this.spinnerService.hide();
  }

  onSubmit() {
    this.authService.signUp(this.registerForm.value).subscribe(
      data => {
        this.router.navigate(['auth', 'login']);
      },
      error => {
        this.notificationService.showError(this.utilsService.createErrorMessage(error.error.errors), null);
      }
    );
  }
}

export const registerRoutes: Routes = [
  {
    path: 'signup',
    component: RegisterComponent
  }
];
