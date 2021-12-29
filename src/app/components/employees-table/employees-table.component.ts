import { Employee } from 'src/app/models/employee';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogClose, MatDialogRef } from '@angular/material/dialog';

import { Subject, Subscription } from 'rxjs';

import { EmployeesService } from 'src/app/services/employees.service';
import { MessagesService } from 'src/app/services/messages-service.service';
import { AddEmployeeComponent } from '../add-employee/add-employee.component';
import { EditeEmployeeComponent } from '../edite-employee/edite-employee.component';

@Component({
  selector: 'app-employees-table',
  templateUrl: './employees-table.component.html',
  styleUrls: ['./employees-table.component.scss'],
})
export class EmployeesTableComponent implements OnInit {
  // Begin bulk assign properties
  idsOfSelectedemployee: number[] = [];
  selection = new SelectionModel<any>(true, []);
  // End bulk assign properties
  page = 1;
  employeeId: any;
  employee!: Employee
  data: Employee[] = [];
  sortAZ: boolean = true;
  isSelcted:boolean = true
  subscription: Subscription = new Subscription();
  @ViewChild('confirmDialog') public confirmDialog!: TemplateRef<any>;
  totalItems = 0;
  pageOptions = {
    length: 10,
    defaultPageSize: 10,
  };

  constructor(
    public dialog: MatDialog,
    private _employee: EmployeesService,
    private messagesService: MessagesService
  ) { }

  ngOnInit(): void {
    this.getAllEmployess();
  }

  getAllEmployess() {
    this.subscription.add(
      this._employee.getAllEmployess().subscribe((res: any) => {
        this.data = res;
        this.pageOptions.length = this.data.length;
        this.totalItems = this.data.length;
      })
    );
  }

  sortName() {
    this.sortAZ = !this.sortAZ;
    if (this.sortAZ) {
      this.data.sort((b, a) => a.empName.localeCompare(b.empName));
    } else {
      this.data.sort((a, b) => a.empName.localeCompare(b.empName));
    }
  }

  sortAddress() {
    this.sortAZ = !this.sortAZ;
    if (this.sortAZ) {
      this.data.sort((b, a) => a.empAddress.localeCompare(b.empAddress));
    } else {
      this.data.sort((a, b) => a.empAddress.localeCompare(b.empAddress));
    }
  }

  openDialogAdd(): void {
    const dialogRef = this.dialog.open(AddEmployeeComponent, {
      width: '300px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getAllEmployess();
        this.selection.clear();
      }
    });
  }

  openDialogEdit(rowdata: Employee): void {
    const dialogRef = this.dialog.open(EditeEmployeeComponent, {
      width: '300px',
      data: {
        employee: rowdata,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getAllEmployess();
        this.selection.clear();
      }
    });
  }

  deleteItem(rowdata: Employee) {
    const dialogRef = this.dialog.open(this.confirmDialog, {
      width: '300px',
      id: 'delete',
      data: {
        employeeI: rowdata,
      },
    });
    this.employeeId = rowdata.empId;

    this.subscription.add(
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.getAllEmployess();
          this.selection.clear();
        }
      })
    );
  }

  deleteSelectedEmp(rowdata: Employee) {
    if(this.selection.selected.length){
      const dialogRef = this.dialog.open(this.confirmDialog, {
        width: '300px',
        id: 'delete',
        data: {
          employeeI: rowdata,
        },
      });
  
      this.subscription.add(
        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            this.getAllEmployess();
            this.selection.clear();
          }
        })
      );
    }
    
  }

  confirmeDelete(id: any) {
    this.isSelcted = !this.isSelcted;
    if (this.isSelcted) {
      this.subscription.add(
        this._employee.deleteEmpByID(id).subscribe((res: any) => {
          // this.dialog.closeAll();
          this.dialog.getDialogById('delete')?.close(true)
          this.messagesService.openSuccessSnackBar('Deleted successfully');
        })
      );

    } else {
      this.idsOfSelectedemployee.forEach((employeeId) => {
        this.subscription.add(
          this._employee.deleteEmpByID(employeeId).subscribe((res: any) => {
            // this.dialog.closeAll();
            this.dialog.getDialogById('delete')?.close(true)
            this.messagesService.openSuccessSnackBar('Deleted successfully');
          })
        );
      });
    }

  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.data?.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.data);
  }
  //

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Employee): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    this.idsOfSelectedemployee = this.selection.selected.map(
      (employee) => employee.empId
    );
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1
      }`;
  }

  getPageSymbol(current: number) {
    return [current];
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

