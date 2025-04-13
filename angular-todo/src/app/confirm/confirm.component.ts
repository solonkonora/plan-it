import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
@Component({
  selector: 'app-confirmation',
  imports: [MatButtonModule, MatDialogActions, MatDialogTitle, MatDialogContent],
  templateUrl: './confirm.component.html',
  styleUrl: './confirm.component.css'
})
export class ConfirmationComponent {

  constructor(public dialogRef: MatDialogRef<ConfirmationComponent>) { }

  closeDialog(message: string) {
    this.dialogRef.close(message);
  }
}
