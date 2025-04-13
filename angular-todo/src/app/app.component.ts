// import { Component, inject, model, signal, Signal } from '@angular/core';
// import {MatButtonModule} from '@angular/material/button';
// import {MatFormFieldModule} from '@angular/material/form-field';
// import {MatIconModule} from '@angular/material/icon';
// import {MatInputModule} from '@angular/material/input';
// import {MatCardModule} from '@angular/material/card';
// import {MatCheckboxModule} from '@angular/material/checkbox';
// import { FormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { MatDialog, MatDialogModule } from '@angular/material/dialog';
// import { ConfirmationComponent } from './confirm/confirm.component';

// interface ITodo {
//   id: number;
//   description: string;
//   done: boolean;
// }
// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html',
//   styleUrl: './app.component.css',
//   imports: [MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatCardModule, MatCheckboxModule, FormsModule, CommonModule, MatDialogModule]
// })
// export class AppComponent {
//   [x: string]: any;
//   todoList = signal<ITodo[]>([]);

//   description = model('');

//   readonly dialog = inject(MatDialog);

//   selectedIndex: number = -1;

//   save(): void {
//     const obj: ITodo = {
//       description: this.description(),
//       done: false,
//       id: this.todoList().length + 1
//     };
//     this.todoList().push(obj);
//     this.description.set('');
//   }

//   checkmarkChanged(index: number): void {
//     this.todoList()[index].done = !this.todoList()[index].done;
//     this.todoList.set(this.todoList());
//   }

//   deleteConfirmation(index: number): void {
//     this.dialog.open(ConfirmationComponent, {
//       width: '250px'
//     }).afterClosed().subscribe((res: any) => {
//       if (res === 'YES') {
//         this.todoList().splice(index, 1);
//       }
//     });
//   }

//   editItem(index: number, item: ITodo): void {
//     this.selectedIndex = index;
//     this.description.set(item.description);
//   }

//   updateItem() {
//     if (this.selectedIndex >= 0) {
//       this.todoList()[this.selectedIndex].description = this.description();
//       this.description.set('');
//       this.selectedIndex = -1;
//     }
//   }
// }


import { Component, inject, model, signal, Signal } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmationComponent } from './confirm/confirm.component';
import { TodoService } from './features/todo/service/todo.service';

interface ITodo {
  id?: number;
  title: string;
  description: string;
  done: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatCardModule, MatCheckboxModule, FormsModule, CommonModule, MatDialogModule]
})
export class AppComponent {
  [x: string]: any;
  todoList: ITodo[] = [];

  description = model('');

  readonly dialog = inject(MatDialog);
  readonly todoService = inject(TodoService);

  selectedIndex: number = -1;

  ngOnInit(): void {
    this.fetchTodos();
  }

  fetchTodos(): void {
    this.todoService.getTodos().subscribe(
      (data) => this.todoList = data,
      (error) => console.error('Error fetching todos:', error)
    );
  }

  save(): void {
    const obj: ITodo = {
      id: this.todoList.length + 1,
      title: '',
      description: this.description(),
      done: false,
    };
    this.todoService.createTodo(obj).subscribe(
      (data) => this.todoList.push(data),
      (error) => console.error('Error creating todo:', error)
    );
    this.description.set('');

  }

  checkmarkChanged(index: number): void {
    this.todoList[index].done = !this.todoList[index].done;
  }

  deleteConfirmation(index: number): void {
    this.dialog.open(ConfirmationComponent, {
      width: '250px'
    }).afterClosed().subscribe((res: any) => {
      if (res === 'YES') {
        this.todoList.splice(index, 1);
      }
    });
  }

  editItem(index: number, item: ITodo): void {
    this.selectedIndex = index;
    this.description.set(item.description);
  }

  updateItem() {
    if (this.selectedIndex >= 0) {
      this.todoList[this.selectedIndex].description = this.description();
      this.description.set('');
      this.selectedIndex = -1;
    }
  }
}
