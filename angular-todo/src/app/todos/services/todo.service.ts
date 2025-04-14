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
          .sort((a, b) => (a._id < b._id ? -1 : 1)) // Keep sorted
      );
    } catch (error) {
      console.error(`Failed to toggle todo ${id}:`, error);
      // Optionally update state to show an error
    }
  }

  // UPDATE (Toggle completion status for ALL todos)
  async toggleAll(isCompleted: boolean): Promise<void> {
    const currentTodos = this.todosSig();
    const updatePromises: Promise<TodoInterface | null>[] = []; // Store promises

    currentTodos.forEach(todo => {
      if (todo.isCompleted !== isCompleted) {
        const updatedTodoPayload = { ...todo, isCompleted };
        // Create a promise for each fetch request
        const promise = fetch(`${this.apiUrl}/${todo._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedTodoPayload),
        })
          .then(response => {
            // Process response within the promise chain
            if (!response.ok) {
              console.error(`Failed to toggle todo ${todo._id}. Status: ${response.status}`);
              // Return null or throw to indicate failure for this specific item
              return null;
            }
            return response.json() as Promise<TodoInterface>; // Return promise for JSON data
          })
          .catch(error => {
            console.error(`Network or processing error toggling todo ${todo._id}:`, error);
            return null; // Indicate failure
          });
        updatePromises.push(promise);
      }
    });

    if (updatePromises.length === 0) {
      return; // Nothing to update
    }

    try {
      // Wait for all update fetches to complete
      const results = await Promise.all(updatePromises);

      // Filter out null results (failed updates)
      const successfulUpdates = results.filter((res): res is TodoInterface => res !== null);

      if (successfulUpdates.length > 0) {
        // Update the signal based on successful updates
        this.todosSig.update(todos => {
          const updatedMap = new Map(successfulUpdates.map(t => [t._id, t]));
          return todos.map(t => updatedMap.get(t._id) || { ...t, isCompleted }) // Use updated or set target state
            .sort((a, b) => (a._id < b._id ? -1 : 1)); // Keep sorted
        });
      }
      // Optionally: Check if results.length !== updatePromises.length to see if some failed
      if (results.length !== updatePromises.length || results.some(r => r === null)) {
        console.warn("Some todos failed to toggle.");
        // You might want to refetch or notify the user more explicitly
        // await this.fetchTodos(); // Uncomment to refetch for consistency after partial failure
      }

    } catch (error) {
      // This catch block might not be hit often for individual HTTP errors
      // due to the .catch inside the loop, but could catch errors in Promise.all setup
      console.error('Error processing toggleAll updates:', error);
    }
  }
}