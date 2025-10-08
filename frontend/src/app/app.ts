import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { DashboardComponent } from './components/dashboard/dashboard.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HttpClientModule, DashboardComponent],
  template: `
    <div class="app-container">
      <main class="app-main">
        <app-dashboard></app-dashboard>
      </main>
    </div>
  `,
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Employee Task Tracker');
}
