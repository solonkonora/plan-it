// import { Component, inject } from '@angular/core';
// import { TodosService } from '../../services/todo.service';

// @Component({
//   selector: 'app-todos-header',
//   templateUrl: './header.component.html',
//   standalone: true,
// })
// export class HeaderComponent {
//   todosService = inject(TodosService);
//   text: string = '';

//   changeText(event: Event): void {
//     const target = event.target as HTMLInputElement;
//     this.text = target.value;
//   }

//   addTodo(): void {
//     this.todosService.addTodo(this.text);
//     this.text = '';
//   }
// }

import { Component, inject } from '@angular/core';
import { TodosService } from '../../services/todo.service';

@Component({
  selector: 'app-todos-header',
  templateUrl: './header.component.html',
  standalone: true,
})
export class HeaderComponent {
  todosService = inject(TodosService);
  title: string = '';
  description: string = '';

  changeTitle(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.title = target.value;
  }

  changeDescription(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.description = target.value;
  }

  addTodo(): void {
    this.todosService.addTodo(this.title, this.description);
    this.title = '';
    this.description = '';
  }
}
