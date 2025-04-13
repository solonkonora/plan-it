import { Component, OnInit } from '@angular/core';
import { ITodo, TodoService } from '../../service/todo.service';


@Component({
  selector: 'app-todo-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class TodoListComponent implements OnInit {
  todos: ITodo[] = [];

  constructor(private todoService: TodoService) { }

  ngOnInit(): void {
    this.fetchTodos();
  }

  fetchTodos(): void {
    this.todoService.getTodos().subscribe(todos => {
      this.todos = todos;
    });
  }

  deleteTodo(id: number): void {
    this.todoService.deleteTodo(id).subscribe(() => {
      this.todos = this.todos.filter(todo => todo.id !== id);
    });
  }

  updateTodo(todo: ITodo): void {
    this.todoService.updateTodo(todo.id, todo).subscribe(updatedTodo => {
      const index = this.todos.findIndex(t => t.id === updatedTodo.id);
      if (index !== -1) {
        this.todos[index] = updatedTodo;
      }
    });
  }
}
