

// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
// import { InputTextModule } from 'primeng/inputtext';
// import { PasswordModule } from 'primeng/password';
// import { FloatLabelModule, FloatLabel } from 'primeng/floatlabel';
// import { ToastModule } from 'primeng/toast';
// import { HomeApiService } from '../../Services/home-api.service';
// import { Router } from '@angular/router';
// import { MessageService } from 'primeng/api';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [
//     CommonModule,
//     ReactiveFormsModule,
//     InputTextModule,
//     PasswordModule,
//     FloatLabelModule,
//     FloatLabel,
//     ToastModule
//   ],
//   providers: [FormBuilder, MessageService],
//   templateUrl: './login.component.html',
//   styleUrl: './login.component.css'
// })
// export class LoginComponent {
//   form;
//   isSubmitted: boolean = false;

//   constructor(
//     private formBuilder: FormBuilder,
//     private service: HomeApiService,
//     private router: Router,
//     private messageService: MessageService
//   ) {
//     this.form = this.formBuilder.group({
//       email: ['', [Validators.required]],
//       password: ['', [Validators.required]],
//     });
//   }

//   onSubmit() {
//     this.isSubmitted = true;

//     if (this.form.valid) {
//       const email: string = this.form.value.email ?? '';
//       const password: string = this.form.value.password ?? '';

//       this.service.login(email, password).subscribe({
//         next: user => {
//           this.router.navigateByUrl('/discover');
//         },
//         error: err => {
//           this.messageService.add({
//             severity: 'error',
//             summary: 'Login Failed',
//             detail: 'Incorrect Email or password'
//           });
//         }
//       });
//     }
//   }

//   hasDisplayableError(controlName: string): boolean {
//     const control = this.form.get(controlName);
//     return Boolean(control?.invalid) && (this.isSubmitted || Boolean(control?.touched));
//   }
// }
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HomeApiService } from './../../Services/home-api.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  imports: [CommonModule,ReactiveFormsModule],
  providers:[FormBuilder],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
    form;
    isSubmitted: boolean =false;
    showPassword: boolean = false;


    constructor(
      private formBuilder: FormBuilder,
      private service : HomeApiService,
      private router:Router,
      private snackBar: MatSnackBar
    ){
      this.form = this.formBuilder.group({
        email:['',[Validators.required, Validators.email]],
        password:['',[Validators.required]],
      })
    }

    onSubmit() {
      this.isSubmitted = true;

     if (this.form.valid) {
       const email: string = this.form.value.email ?? '';
      const password: string = this.form.value.password ?? '';

      this.service.login(email, password).subscribe({
        next: user => {
            this.router.navigateByUrl('/discover');
          },
          error:err =>{
            if(err.status==400){
              this.snackBar.open('Incorrect Email or password', 'Close', {
              duration: 5000,
              panelClass: ['error-snackbar']
            });
            }

          }
        })

      }
    }
    togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

    hasDisplayableError(controlName:string): boolean {
      const control = this.form.get(controlName);
      return Boolean(control?.invalid) &&
        (this.isSubmitted || Boolean(control?.touched))
    }

}
