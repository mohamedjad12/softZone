import { MessagesService } from 'src/app/services/messages-service.service';
import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { EmployeesService } from 'src/app/services/employees.service';


@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss'],
})
export class AddEmployeeComponent implements OnInit {
  requestCmoplete: boolean = false;
  form!: FormGroup;
  subscription: Subscription = new Subscription();

  constructor(
    private _employee: EmployeesService,
    public _MatDialog: MatDialog,
    public dialogRef: MatDialogRef<AddEmployeeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private messagesService: MessagesService

  ) { }

  ngOnInit(): void {
    this.initForm();
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
  addEmployee(body: any) {
    this.subscription.add(
      this._employee.addEmployee(body).subscribe((res: any) => {
        this.dialogRef.close(true);
        this.requestCmoplete = false;
        this.messagesService.openSuccessSnackBar('added successfully')


      })
    );
  }

  onSubmit() {
    this.requestCmoplete = true;
    this.form.markAllAsTouched();
    if (!this.form.valid) {
      return;
    }
    this.addEmployee(this.form.value);
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
