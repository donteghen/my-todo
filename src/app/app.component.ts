import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import { Component } from '@angular/core';
import { Task } from './models/task';
import { dialogResult, TaskDialogComponent } from './task-dialog/task-dialog.component';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';


const getObservable = (collection: AngularFirestoreCollection<Task>) => {
  const subject = new BehaviorSubject([]);
  collection.valueChanges({ idField: 'id' }).subscribe((val: Task[]) => {
    subject.next(val);
  });
  return subject;
};
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  inProgress  = getObservable(this.fireStore.collection('inProgress'));
  done  = getObservable(this.fireStore.collection('done'));
  todos  = getObservable(this.fireStore.collection('todos'));

  constructor(public dialog: MatDialog, private fireStore: AngularFirestore){}
  drop(event: CdkDragDrop<Task[]>){
    if(event.previousContainer === event.container){
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }
    else{
      const item = event.previousContainer.data[event.previousIndex];
      this.fireStore.firestore.runTransaction(()=>{
        return Promise.all([
          this.fireStore.collection(event.previousContainer.id).doc(item.id).delete(),
          this.fireStore.collection(event.container.id).add(item)
        ]);
      })
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex)
    }
  }

  edit(list: 'todos' | 'inProgress' | 'done', edit: Task){
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '300px',
      data:{
        task:edit,
        enableDelete: true
      }
    })
    dialogRef.afterClosed().subscribe((result : dialogResult )=>{
     
     if(result.isDeleted){
      this.fireStore.collection(list).doc(edit.id).delete();
     }
     else{
       this.fireStore.collection(list).doc(edit.id).update(edit)
     }
    })
  }
  newTask(){
    const dialogRef = this.dialog.open(TaskDialogComponent, { 
      width: '300px',
      data:{
        task:{}
      }
    });

    dialogRef.afterClosed().subscribe((result : dialogResult)=> {
      this.fireStore.collection('todos').add(result.task)
    })
  }
}
