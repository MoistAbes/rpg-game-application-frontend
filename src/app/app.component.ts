import {Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {NavbarComponent} from './global/components/navbar/navbar/navbar.component';
import {NgIf} from '@angular/common';
import {LoadingService} from './global/services/loading.service';
import {SidebarComponent} from './global/components/sidebar/sidebar.component';
import {JwtService} from './global/services/jwt.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    NavbarComponent,
    NgIf,
    SidebarComponent
  ],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'rpg-game-application-frontend';
  isLoading: boolean = false;

  constructor(private loadingService: LoadingService,
              protected jwtService: JwtService,) {}

  /*
    Angular’s Change Detection Runs Synchronously
    When isLoading updates inside subscribe(), it can change during the rendering phase, causing an expression mismatch.
    setTimeout() Defers Execution
    Wrapping it in setTimeout() moves it to the next event loop cycle, avoiding issues with Angular’s change detection.
   */
  ngOnInit() {
    this.loadingService.isLoading$.subscribe(status => {
      setTimeout(() => {
        this.isLoading = status;
      });
    });

  }

}
