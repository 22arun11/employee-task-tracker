import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { DashboardComponent } from './components/dashboard/dashboard.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HttpClientModule, DashboardComponent],
  template: `
    <div class="app-container">
      <header class="app-header">
        <div class="container">
          <h1>🏢 Employee Task Tracker</h1>
          <nav>
            <a href="#" class="nav-link active">Dashboard</a>
            <a href="#" class="nav-link">Tasks</a>
            <a href="#" class="nav-link">Employees</a>
          </nav>
        </div>
      </header>
      
      <main class="app-main">
        <app-dashboard></app-dashboard>
      </main>
      
      <footer class="app-footer">
        <div class="container">
          <p>&copy; 2025 Employee Task Tracker. Built with Angular & .NET</p>
        </div>
      </footer>
    </div>
  `,
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Employee Task Tracker');
}
