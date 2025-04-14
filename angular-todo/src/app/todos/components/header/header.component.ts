import { Component, inject } from '@angular/core';
import { TodosService } from '../../services/todo.service';

@Component({
  selector: 'app-todos-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
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
