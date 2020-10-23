import { Injectable } from '@angular/core';

@Injectable()
export class UtilsService {

  createErrorMessage(errors) {
    let errorMessage = '';

    errors.forEach(error => {
      if (error.message) {
        errorMessage = 'Error message: ' + error.message + '\n';
      }
      if (error.field) {
        errorMessage += 'Error field: ' + error.field + '\n';
      }

      if (error.reasons && error.reasons.length) {
        errorMessage += 'Reasons: \n';
        error.reasons.forEach(reason => {
          if (reason.message) {
            errorMessage += error.message + '\n';
          }
        });
      }
    });

    return errorMessage;
  }
}
