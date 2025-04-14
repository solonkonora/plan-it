// import { Component, computed, inject } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { TodosService } from '../../services/todo.service';
// import { FilterEnum } from '../../types/filter.enum';

// @Component({
//   selector: 'app-todos-footer',
//   templateUrl: './footer.component.html',
//   styleUrls: ['./footer.component.css'],
//   standalone: true,
//   imports: [CommonModule],
// })
// export class FooterComponent {
//   todosService = inject(TodosService);
//   filterSig = this.todosService.filterSig;
//   filterEnum = FilterEnum;
//   activeCount = computed(() => {
//     return this.todosService.todosSig().filter((todo) => !todo.isCompleted)
//       .length;
//   });
//   noTodosClass = computed(() => this.todosService.todosSig().length === 0);
//   itemsLeftText = computed(
//     () => `item${this.activeCount() !== 1 ? 's' : ''} left`
//   );

//   changeFilter(event: Event, filterName: FilterEnum): void {
//     event.preventDefault();
//     this.todosService.changeFilter(filterName);
//     console.log('after changeFilter', this.todosService.filterSig());
//   }
// }



import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodosService } from '../../services/todo.service'; // Correct path assumed
import { FilterEnum } from '../../types/filter.enum';
import { TodoInterface } from '../../types/todo.interface'; // Import TodoInterface if not already

@Component({
  selector: 'app-todos-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class FooterComponent {
  todosService = inject(TodosService);
  filterSig = this.todosService.filterSig; // filterSig is public, so this is OK
  filterEnum = FilterEnum;

  // Use the public 'todos' computed signal instead of the private 'todosSig'
  activeCount = computed(() => {
    // Access the public computed signal 'todos' from the service
    return this.todosService.todos().filter((todo: TodoInterface) => !todo.isCompleted)
      .length;
  });

  // Use the public 'todos' computed signal instead of the private 'todosSig'
  noTodosClass = computed(() => this.todosService.todos().length === 0);

  itemsLeftText = computed(
    () => `item${this.activeCount() !== 1 ? 's' : ''} left`
  );

  changeFilter(event: Event, filterName: FilterEnum): void {
    event.preventDefault();
    this.todosService.changeFilter(filterName);
    // console.log('after changeFilter', this.todosService.filterSig()); // Logging filterSig is still fine
  }
}