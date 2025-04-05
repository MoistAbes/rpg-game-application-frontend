import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatCard, MatCardContent, MatCardTitle} from "@angular/material/card";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {UserApiService} from '../../services/api/user-api.service';
import {RegisterUserRequest} from '../../dto/request/register-user-request';

@Component({
  selector: 'app-register-page',
    imports: [
        FormsModule,
        MatButton,
        MatCard,
        MatCardContent,
        MatCardTitle,
        MatFormField,
        MatInput,
        MatLabel
    ],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css',
})
export class RegisterPageComponent {

  username: string = '';
  password: string = '';
  passwordConfirm: string = '';
  email: string = '';

  constructor(private userApiService: UserApiService,
              private toastService: ToastrService,
              private router: Router,) {
  }


  onRegisterButtonClick() {



    if (this.verifyUser()){

      const registerRequest: RegisterUserRequest = {
        username: this.username,
        password: this.password,
        email: this.email
      };

      this.userApiService.registerUser(registerRequest).subscribe({
        next: result => {},
        error: err => {
          this.toastService.error(err.message);
        },
        complete: () => {
          this.toastService.success("Register successfully.");
          this.router.navigate(['/login']);
        }
      })
    }





  }


  verifyUser(): boolean {

    this.checkForEmptyValues()

    this.checkPassword();


    this.checkEmail();



    return true
  }

  //   How This Works:
  // ^[^\s@]+ → Starts with at least one character before @, avoiding spaces.
  // @[^\s@]+ → Must contain exactly one @ followed by more characters.
  // \.[^\s@]+$ → Must have a dot (.) followed by at least one character (e.g., .com).
  checkEmail(): boolean {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(this.email)) {
      this.toastService.warning("Invalid email format (e.g., user@example.com)");
      return false;
    }

    return true;
  }




  checkPassword(): boolean {
    if (this.password.trim() !== this.passwordConfirm.trim()) {
      this.toastService.warning("Passwords do not match");
      return false;
    }

    if (this.password.length < 8) {
      this.toastService.warning("Password must be at least 8 characters long");
      return false;
    }

    if (!/[A-Z]/.test(this.password)) {
      this.toastService.warning("Password must contain at least one uppercase letter");
      return false;
    }

    if (!/[a-z]/.test(this.password)) {
      this.toastService.warning("Password must contain at least one lowercase letter");
      return false;
    }

    if (!/\d/.test(this.password)) {
      this.toastService.warning("Password must contain at least one number");
      return false;
    }

    if (!/[@$!%*?&]/.test(this.password)) {
      this.toastService.warning("Password must contain at least one special character (@$!%*?&)");
      return false;
    }

    return true;
  }


  checkForEmptyValues(): boolean {
    //check for empty values
    if (!this.username || this.username.trim().length == 0) {
      this.toastService.warning("Username cannot be empty");

      return false;
    }

    if (!this.password || this.password.trim().length == 0) {
      this.toastService.warning("Password cannot be empty");

      return false;
    }

    if (!this.passwordConfirm || this.passwordConfirm.trim().length == 0) {
      this.toastService.warning("Password confirm cannot be empty");

      return false
    }

    if  (!this.email || this.email.trim().length == 0) {
      this.toastService.warning("E-mail cannot be empty");
      return false;
    }

    return true;
  }

}
