import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IBloodPressure } from '../blood-pressure.model';
import { BloodPressureService } from '../service/blood-pressure.service';

@Component({
  templateUrl: './blood-pressure-delete-dialog.component.html',
})
export class BloodPressureDeleteDialogComponent {
  bloodPressure?: IBloodPressure;

  constructor(protected bloodPressureService: BloodPressureService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.bloodPressureService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
