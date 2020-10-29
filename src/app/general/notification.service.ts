import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class NotificationService {

  constructor(private toastr: ToastrService) { }

  showSuccess(message, title) {
    this.toastr.success(message, title);
  }

  showSuccessWithProperties(message, title, options) {
    this.toastr.success(message, title, options);
  }

  showError(message, title) {
    this.toastr.error(message, title);
  }

  showErrorWithProperties(message, title, options) {
    this.toastr.error(message, title, options);
  }
}
