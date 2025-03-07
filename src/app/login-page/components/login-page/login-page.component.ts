import { Component } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {AuthService} from '../../../global/services/auth.service';
import {LoginRequestModel} from '../../../models/login-request-model';
import {JwtService} from '../../../global/services/jwt.service';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-login-page',
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    // Required for form handling
  ],
  templateUrl: './login-page.component.html',
  standalone: true,
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {


  username: string = '';
  password: string = '';

  constructor(private authService: AuthService,
              private jwtService: JwtService,
              private router: Router,
              private toastr: ToastrService,) {
  }


  public onLoginButtonClick() {

    if (this.username.length > 0 && this.password.length > 0) {
      this.authService.login(new LoginRequestModel(this.username, this.password)).subscribe({
        next: generatedToken => {
          this.jwtService.saveToken(generatedToken.token);
          console.log("Generated token: ", this.jwtService.getToken())
        },
        error: err => {
          console.log("Error happened: ", err);
        },
        complete: () => {
          // Navigate to the 'home' component (or whichever component you want)
          this.router.navigate(['/character-selection']); // or any other route

        }
      });
    }else {
      this.toastr.warning("Both username and password needs to be filled")
    }




  }

}
