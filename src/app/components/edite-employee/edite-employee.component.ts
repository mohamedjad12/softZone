import { MessagesService } from 'src/app/services/messages-service.service';
import { Employee } from 'src/app/models/employee';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { EmployeesService } from 'src/app/services/employees.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edite-employee',
  templateUrl: './edite-employee.component.html',
  styleUrls: ['./edite-employee.component.scss'],
})
export class EditeEmployeeComponent implements OnInit {
  requestCmoplete: boolean = false;
  form!: FormGroup;
  dialModalRef: any;
  subscription: Subscription = new Subscription();

  constructor(
    private _employee: EmployeesService,
    public _MatDialog: MatDialog,
    public dialogRef: MatDialogRef<EditeEmployeeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private messagesService: MessagesService
  ) { }

  ngOnInit(): void {
    this.initForm();
    if (this.data.employee) {
      this.form.patchValue(this.data.employee);
    }
  }

  initForm() {
    this.form = this.fb.group({
      empName: ['', Validators.compose([Validators.required])],
      empEmail: [
        '',
        Validators.compose([Validators.required, Validators.email]),
      ],
      empAddress: ['', Validators.compose([Validators.required])],
      empPhone: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('^01[0-2]{1}[0-9]{8}$'),
        ]),
      ],
    });
  }
  onSubmit() {
    this.requestCmoplete = true;
    this.form.markAllAsTouched();
    if (!this.form.valid) {
      return;
    }
    const body = {
      ...this.form.value,
      empId: this.data?.employee?.empId,
    };
    this.editeEmployee(body);
  }

  editeEmployee(body: any) {
    this.subscription.add(
      this._employee.editeEmployee(body).subscribe((res) => {
        this.dialogRef.close(true);
        this.requestCmoplete = false;
        this.messagesService.openSuccessSnackBar('Edit successfully')

      })
    );
  }
  get addEmployeeFormControl() {
    return this.form.controls;
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
