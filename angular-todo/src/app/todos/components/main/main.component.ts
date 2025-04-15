import { Component, computed, inject } from '@angular/core';
import { TodosService } from '../../services/todo.service'; // Correct path assumed
import { CommonModule } from '@angular/common';
import { FilterEnum } from '../../types/filter.enum';
import { TodoComponent } from '../todo/todo.component';
import { TodoInterface } from '../../types/todo.interface'; // Import TodoInterface

@Component({
  selector: 'app-todos-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  standalone: true,
  imports: [CommonModule, TodoComponent],
})
export class MainComponent {
  todosService = inject(TodosService);
  editingId: string | null = null;

  visibleTodos = computed(() => {
    // Use the public 'todos' computed signal here (Line 19)
    const todos = this.todosService.todos();
    const filter = this.todosService.filterSig();

    if (filter === FilterEnum.active) {
      return todos.filter((todo: TodoInterface) => !todo.isCompleted);
    } else if (filter === FilterEnum.completed) {
      return todos.filter((todo: TodoInterface) => todo.isCompleted);
    }
    return todos;
  });

  isAllTodosSelected = computed(() => {
    // Use the public 'todos' computed signal here (Line 30)
    const currentTodos = this.todosService.todos();
    // Add a check for empty list to avoid .every() on empty array returning true
    return currentTodos.length > 0 && currentTodos.every((todo: TodoInterface) => todo.isCompleted);
  });

  // Use the public 'todos' computed signal here (Line 32)
  noTodosClass = computed(() => this.todosService.todos().length === 0);

  setEditingId(editingId: string | null): void {
    this.editingId = editingId;
  }

  toggleAllTodos(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.todosService.toggleAll(target.checked); // Calling public method is OK
  }
}