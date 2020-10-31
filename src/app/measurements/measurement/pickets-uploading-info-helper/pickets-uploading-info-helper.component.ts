import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pickets-uploading-info-helper',
  templateUrl: './pickets-uploading-info-helper.component.html',
  styleUrls: ['./pickets-uploading-info-helper.component.scss']
})
export class PicketsUploadingInfoHelperComponent implements OnInit {

  constructor(
    private activeModal: NgbModal
  ) { }

  ngOnInit() {
  }
}
