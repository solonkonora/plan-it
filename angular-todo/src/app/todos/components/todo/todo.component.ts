import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, inject, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoInterface } from '../../types/todo.interface';
import { TodosService } from '../../services/todo.service';

@Component({
    selector: 'app-todos-todo',
    templateUrl: './todo.component.html',
    styleUrls: ['./todo.component.css'],
    standalone: true,
    imports: [CommonModule],
})
export class TodoComponent {
    @Input({ required: true }) todo!: TodoInterface;
    @Input({ required: true }) isEditing!: boolean;
    @Output() setEditingId: EventEmitter<string | null> = new EventEmitter();

    @ViewChild('titleInput') titleInput?: ElementRef;
    @ViewChild('descriptionInput') descriptionInput?: ElementRef;

    todosService = inject(TodosService);
    editingTitle = model('');
    editingDescription = model('');

    ngOnInit(): void {
        this.editingTitle.set(this.todo.title);
        this.editingDescription.set(this.todo.description);
    }

    changeTitle(event: Event): void {
        const target = event.target as HTMLInputElement;
        this.editingTitle.set(target.value);
    }

    changeDescription(event: Event): void {
        const target = event.target as HTMLTextAreaElement;
        this.editingDescription.set(target.value);
    }

    changeTodo(): void {
        this.todosService.changeTodo(this.todo._id, this.editingTitle(), this.editingDescription());
        this.setEditingId.emit(null);
    }

    setTodoInEditMode(): void {
        this.setEditingId.emit(this.todo._id);
        setTimeout(() => {
            this.titleInput?.nativeElement.focus();
        }, 0);
    }

    removeTodo(): void {
        this.todosService.removeTodo(this.todo._id);
    }

    toggleTodo(): void {
        this.todosService.toggleTodo(this.todo._id);
    }
}
