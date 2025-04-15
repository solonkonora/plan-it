import { Injectable, signal, computed } from '@angular/core';
import { TodoInterface } from '../types/todo.interface';
import { FilterEnum } from '../types/filter.enum';

@Injectable({
  providedIn: 'root',
})
export class TodosService {

  private apiUrl = 'http://localhost:3000/api/todos';

  // Signals for internal state management
  private todosSig = signal<TodoInterface[]>([]);
  filterSig = signal<FilterEnum>(FilterEnum.all);

  // Public computed signal for components to consume
  public todos = computed(() => this.todosSig());

  constructor() {
    // Fetch initial todos when the service is instantiated
    this.fetchTodos();
  }

  changeFilter(filterName: FilterEnum): void {
    this.filterSig.set(filterName);
  }

  // support for Fetch Requests ---
  private async handleFetchResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`HTTP error! Status: ${response.status}`, errorBody);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    // Only parse JSON if there's content; DELETE might have no content
    if (response.status !== 204 /* No Content */) {
      try {
        return await response.json() as T;
      } catch (e) {
        console.error("Failed to parse JSON response", e);
        throw new Error("Failed to parse JSON response");
      }
    }
    return undefined as T; // Return undefined for 204 No Content
  }

  // READ (Fetch all todos from backend)
  async fetchTodos(): Promise<void> {
    try {
      const response = await fetch(this.apiUrl);
      const todos = await this.handleFetchResponse<TodoInterface[]>(response);
      // Sort todos (adjust sorting as needed)
      const sortedTodos = [...todos].sort((a, b) => (a._id < b._id ? -1 : 1));
      this.todosSig.set(sortedTodos);
    } catch (error) {
      console.error('Failed to fetch todos:', error);
      // Optionally update state to show an error
    }
  }

  // CREATE (Add a new todo)
  async addTodo(title: string, description: string): Promise<void> {
    const newTodoPayload = {
      title,
      description,
      isCompleted: false,
    };

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTodoPayload),
      });

      const createdTodo = await this.handleFetchResponse<TodoInterface>(response);

      // Update the signal
      this.todosSig.update(todos =>
        [...todos, createdTodo].sort((a, b) => (a._id < b._id ? -1 : 1))
      );
    } catch (error) {
      console.error('Failed to add todo:', error);
    }
  }

  async changeTodo(id: string, title: string, description: string): Promise<void> {
    const currentTodo = this.todosSig().find(todo => todo._id === id);
    if (!currentTodo) {
      console.error(`Todo with id ${id} not found for update.`);
      return;
    }

    const updatedTodoPayload: TodoInterface = {
      ...currentTodo,
      title,
      description,
    };

    try {
      const response = await fetch(`${this.apiUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTodoPayload),
      });

      const updatedTodoFromServer = await this.handleFetchResponse<TodoInterface>(response);

      // Update the signal
      this.todosSig.update(todos =>
        todos.map(todo => (todo._id === id ? updatedTodoFromServer : todo))
          .sort((a, b) => (a._id < b._id ? -1 : 1)) // Keep sorted
      );
    } catch (error) {
      console.error(`Failed to change todo ${id}:`, error);
    }
  }

  async removeTodo(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`, {
        method: 'DELETE',
      });

      // Check response.ok, handleFetchResponse handles throwing error if not ok
      await this.handleFetchResponse<void>(response); // Expecting no content (204) usually

      // Update the signal
      this.todosSig.update(todos => todos.filter(todo => todo._id !== id));
    } catch (error) {
      console.error(`Failed to remove todo ${id}:`, error);
      // Optionally update state to show an error
    }
  }

  // UPDATE (Toggle completion status of a single todo)
  async toggleTodo(id: string): Promise<void> {
    const currentTodo = this.todosSig().find(todo => todo._id === id);
    if (!currentTodo) {
      console.error(`Todo with id ${id} not found for toggle.`);
      return;
    }

    const updatedTodoPayload: TodoInterface = {
      ...currentTodo,
      isCompleted: !currentTodo.isCompleted,
    };

    try {
      const response = await fetch(`${this.apiUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTodoPayload),
      });

      const updatedTodoFromServer = await this.handleFetchResponse<TodoInterface>(response);

      // Update the signal
      this.todosSig.update(todos =>
        todos.map(todo => (todo._id === id ? updatedTodoFromServer : todo))
          .sort((a, b) => (a._id < b._id ? -1 : 1)) 
      );
    } catch (error) {
      console.error(`Failed to toggle todo ${id}:`, error);
    }
  }

  // UPDATE (Toggle completion status for ALL todos)
async toggleAll(isCompleted: boolean): Promise<void> {
  const currentTodos = this.todosSig();
  const todosToUpdate = currentTodos.filter(todo => todo.isCompleted !== isCompleted);

  if (todosToUpdate.length === 0) {
    console.log("ToggleAll: No todos needed updating.");
    return;
  }

  // Create promises for each PUT request
  const updatePromises = todosToUpdate.map(todo => {
    const updatedTodoPayload = { ...todo, isCompleted }; 
    return fetch(`${this.apiUrl}/${todo._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTodoPayload),
    })
    .then(response => {
      if (!response.ok) {
        console.error(`ToggleAll: Failed backend update for todo ${todo._id}. Status: ${response.status}`);
      
        return null; 
      }
      return response; 
    })
    .catch(error => {
      console.error(`ToggleAll: Network or processing error for todo ${todo._id}:`, error);
      return null;
    });
  });

  try {
    // Wait for all update attempts to complete
    const results = await Promise.all(updatePromises);

    const allFailed = results.every(res => res === null);

    if (allFailed) {
       console.warn("ToggleAll: All update requests failed or encountered errors. Not refetching.");
       return;
    }

    if (results.some(res => res === null)) {
        console.warn("ToggleAll: Some updates failed, but refetching list for consistency.");
    } else {
        console.log("ToggleAll: All updates seemed successful. Refetching list.");
    }

    await this.fetchTodos();

  } catch (error) {
    console.error('ToggleAll: Error during Promise.all execution:', error);
  
  }
}
}