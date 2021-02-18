
import { Component,  Inject,  OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA,  } from '@angular/material/dialog';
import { Task } from '../models/task';

export interface dialogData{
  enableDelete : boolean;
  task:Task
}

export interface dialogResult{
  task: Task;
  isDeleted: boolean
}

@Component({
  selector: 'app-task-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.scss']
})
export class TaskDialogComponent implements OnInit {
 private backupData : Partial<Task> = {...this.data.task};
  constructor(public dialogRef: MatDialogRef<TaskDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: dialogData) { }

  ngOnInit(): void {

  }
cancel(): void {
  if(!this.backupData.title || !this.backupData.description){
    this.dialogRef.close();
  }
  else{
  this.data.task.title = this.backupData.title;
  this.data.task.description = this.backupData.description;
    this.dialogRef.close(this.data);
  }
  }
}
