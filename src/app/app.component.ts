import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { Task } from './models/task';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'my-todo';
  inProgress: Task[] = [

  ];
  done : Task[] = [
  ];
  todos : Task[] = [
    {
      "title": "Drink mill",
      "description": "Go to shop"
    },
    {
      "title": "have beer",
      "description": "Go with friends"
    }
  ];
  drop(event: CdkDragDrop<Task[]>){
    if(event.previousContainer === event.container){
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }
    else{
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  edit(list: string, edit: Task){

  }
}
