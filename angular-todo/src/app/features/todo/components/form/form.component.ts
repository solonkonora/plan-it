import { Component, OnInit } from '@angular/core';
import { ITodo, TodoService } from '../../service/todo.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-todo-form',
  imports: [FormsModule],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class TodoFormComponent implements OnInit {
  title = '';
  description = '';

  constructor(private todoService: TodoService) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    const newTodo: Partial<ITodo> = {
      title: this.title,
      description: this.description,
      done: false
    };

    this.todoService.createTodo(newTodo).subscribe(todo => {
      console.log('Todo created:', todo);
      this.title = '';
      this.description = '';
    });
  }
}
