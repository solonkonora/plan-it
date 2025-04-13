// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';

// export interface ITodo {
//   id: number;
//   title: string;
//   description: string;
//   done: boolean;
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class TodoService {
//   private apiUrl = 'http://localhost:3000/api/todos'; // Backend API URL

//   constructor(private http: HttpClient) {}

//   // Fetch all todos
//   getTodos(): Observable<ITodo[]> {
//     return this.http.get<ITodo[]>(this.apiUrl);
//   }

// // Create a new todo
// createTodo(todo: Partial<ITodo>): Observable<ITodo> {
//   return this.http.post<ITodo>(this.apiUrl, todo);
// }

// // Update an existing todo
// updateTodo(id: number, todo: Partial<ITodo>): Observable<ITodo> {
//   return this.http.put<ITodo>(`${this.apiUrl}/${id}`, todo);
// }

// // Delete a todo
// deleteTodo(id: number): Observable<void> {
//   return this.http.delete<void>(`${this.apiUrl}/${id}`);
// }
// }


import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Todo {
  id?: number;
  title: string;
  description: string;
  done: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private apiUrl = 'http://localhost:3000/api/todos'; // Backend API URL

  constructor(private http: HttpClient) { }

  // Fetch all todos
  getTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.apiUrl);
  }

  // Create a new todo
  createTodo(todo: Todo): Observable<Todo> {
    return this.http.post<Todo>(this.apiUrl, todo);
  }

  // Update an existing todo
  updateTodo(id: number, todo: Partial<Todo>): Observable<Todo> {
    return this.http.put<Todo>(`${this.apiUrl}/${id}`, todo);
  }

  // Delete a todo
  deleteTodo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
