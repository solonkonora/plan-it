import { Component } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { MainComponent } from './components/main/main.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, MainComponent],
})
export class TodosComponent {}
