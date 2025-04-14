// import { Injectable, signal } from '@angular/core';
// import { TodoInterface } from '../types/todo.interface';
// import { FilterEnum } from '../types/filter.enum';

// @Injectable({
//   providedIn: 'root',
// })
// export class TodosService {
//   todosSig = signal<TodoInterface[]>([]);
//   filterSig = signal<FilterEnum>(FilterEnum.all);

//   changeFilter(filterName: FilterEnum): void {
//     this.filterSig.set(filterName);
//   }

//   addTodo(title: string, description: string): void {
//     const newTodo: TodoInterface = {
//       title,
//       description,
//       isCompleted: false,
//       id: Math.random().toString(16),
//     };
//     this.todosSig.update((todos) => [...todos, newTodo]);
//   }

//   changeTodo(id: string, title: string, description: string): void {
//     this.todosSig.update((todos) =>
//       todos.map((todo) => (todo.id === id ? { ...todo, title, description } : todo))
//     );
//   }

//   removeTodo(id: string): void {
//     this.todosSig.update((todos) => todos.filter((todo) => todo.id !== id));
//   }

//   toggleTodo(id: string): void {
//     this.todosSig.update((todos) =>
//       todos.map((todo) =>
//         todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
//       )
//     );
//   }

//   toggleAll(isCompleted: boolean): void {
//     this.todosSig.update((todos) =>
//       todos.map((todo) => ({ ...todo, isCompleted }))
//     );
//   }
// }

import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TodoInterface } from '../types/todo.interface';
import { FilterEnum } from '../types/filter.enum';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TodosService {
  private readonly apiUrl = 'http://localhost:3000/api/todos'; // Backend API URL

  todosSig = signal<TodoInterface[]>([]);
  filterSig = signal<FilterEnum>(FilterEnum.all);

  constructor(private http: HttpClient) {}

  // Fetch all todos from the backend
  fetchTodos(): void {
    this.http.get<TodoInterface[]>(this.apiUrl)
      .pipe(
        catchError((error) => {
          console.error('Error fetching todos:', error);
          return throwError(() => error);
        })
      )
      .subscribe((todos) => {
        this.todosSig.set(todos);
      });
  }

  // Add a new todo to the backend
  addTodo(title: string, description: string): void {
    const newTodo: Partial<TodoInterface> = {
      title,
      description,
      isCompleted: false,
    };

    this.http.post<TodoInterface>(this.apiUrl, newTodo)
      .pipe(
        catchError((error) => {
          console.error('Error adding todo:', error);
          return throwError(() => error);
        })
      )
      .subscribe((createdTodo) => {
        this.todosSig.update((todos) => [...todos, createdTodo]);
      });
  }

  // Update an existing todo in the backend
  changeTodo(id: string, title: string, description: string): void {
    const updatedTodo: Partial<TodoInterface> = { title, description };

    this.http.put<TodoInterface>(`${this.apiUrl}/${id}`, updatedTodo)
      .pipe(
        catchError((error) => {
          console.error('Error updating todo:', error);
          return throwError(() => error);
        })
      )
      .subscribe((updatedTodo) => {
        this.todosSig.update((todos) =>
          todos.map((todo) => (todo.id === id ? updatedTodo : todo))
        );
      });
  }

  // Remove a todo from the backend
  removeTodo(id: string): void {
    this.http.delete(`${this.apiUrl}/${id}`)
      .pipe(
        catchError((error) => {
          console.error('Error removing todo:', error);
          return throwError(() => error);
        })
      )
      .subscribe(() => {
        this.todosSig.update((todos) => todos.filter((todo) => todo.id !== id));
      });
  }

  // Toggle completion status of a todo in the backend
  toggleTodo(id: string): void {
    const todo = this.todosSig().find((t) => t.id === id);
    if (todo) {
      const updatedTodo = { ...todo, isCompleted: !todo.isCompleted };
      this.http.put<TodoInterface>(`${this.apiUrl}/${id}`, updatedTodo)
        .pipe(
          catchError((error) => {
            console.error('Error toggling todo:', error);
            return throwError(() => error);
          })
        )
        .subscribe(() => {
          this.todosSig.update((todos) =>
            todos.map((t) => (t.id === id ? updatedTodo : t))
          );
        });
    }
  }

  // Toggle all todos' completion status in the backend
  toggleAll(isCompleted: boolean): void {
    const updatedTodos = this.todosSig().map((todo) => ({ ...todo, isCompleted }));
    updatedTodos.forEach((todo) =>
      this.http.put<TodoInterface>(`${this.apiUrl}/${todo.id}`, todo)
        .pipe(
          catchError((error) => {
            console.error('Error toggling all todos:', error);
            return throwError(() => error);
          })
        )
        .subscribe()
    );
    this.todosSig.set(updatedTodos);
  }

  changeFilter(filterName: FilterEnum): void {
    this.filterSig.set(filterName);
  }
}
