import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormsModule, FormBuilder, ReactiveFormsModule,Validators, ValidatorFn } from '@angular/forms';
import { FirstKeyPipe } from '../../pipes/first-key.pipe';
import { HomeApiService } from '../../Services/home-api.service';
import { RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink
  ],
  providers:[FormBuilder],

  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
    passwordMatchValidator: ValidatorFn = (control:AbstractControl):null => {
    const password=control.get('password');
    const confirmPassword=control.get('confirmPassword');

    if(password && confirmPassword && password.value!=confirmPassword.value)
    {
      confirmPassword?.setErrors({passwordMismatch:true})
    }
    else
    {
      confirmPassword?.setErrors(null)
    }
    return null;
  }
  form;
  isSubmitted: boolean =false;
  currentVideoIndex: number = 0;


  constructor(
    private  formBuilder: FormBuilder,
    private service : HomeApiService,
    private snackBar: MatSnackBar)
    {
    this.form = this.formBuilder.group({
      fullName: ['',Validators.required],
      email:['',[Validators.required, Validators.email]],
      password:['',[
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=[^A-Z][A-Z])(?=[^a-z][a-z])(?=\D*\d).{8,}$/)
      ]],
      confirmPassword: [''],
    }, {validators:this.passwordMatchValidator})

    setInterval(() => {
      this.rotateVideo();
    }, 5000);
  }
  rotateVideo() {
    this.currentVideoIndex = (this.currentVideoIndex + 1) % this.videos.length;
  }


  onSubmit() {
    this.isSubmitted=true;
    if(this.form.value) {
      console.log(this.form.value);
      //const { fullName, email, password, confirmPassword } = this.form.value;
      const fullName = this.form.get('fullName')?.value as string;
    const email = this.form.get('email')?.value as string;
    const password = this.form.get('password')?.value as string;
    const confirmPassword = this.form.get('confirmPassword')?.value as string;
      this.service.register(fullName, email, password, confirmPassword).subscribe({
        next:(res:any)=>{
          if(res.succeeded){
            this.form.reset();
            this.isSubmitted=false;
            this.showNotification('Successful Registration', 'success');
          }
        },
        error:err=>{
          if(err.error.errors) {
            err.error.errors.forEach((x: any) => {
              switch(x.code) {
                case "DuplicateUserName":
                  break;

                case "DuplicateEmail":
                  this.showNotification('This Email Already Exists', 'error');
                  break;

                default:
                  console.log(x);
                  break;
              }
          });
        } else {
          console.log('error',err);
        }
      }
      });
    }
  }

  showNotification(message: string, type: 'success' | 'error') {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: type === 'success' ? 'success-snackbar' : 'error-snackbar'
    });
  }

  hasDisplayableError(controlName:string): boolean {
    const control = this.form.get(controlName);
    return Boolean(control?.invalid) &&
      (this.isSubmitted || Boolean(control?.touched))
  }

  videos = [
    {
      id:1,
      url: 'assets/video1.mp4',
      text: 'Follow you favourite content creator cooks, discover new cooks, and stay up-to-date with new viral trends.',
    },
    {
      id:2,
      url: 'assets/video2.mp4',
      text: 'Save recipes, create shopping lists, view nutrition information, ask questions, and much more.',
    },
    {
      id:3,
      url: 'assets/video3.mp4',
      text: "Explore your cook's recipes, collections,products, and social media videos all in one place.",
    },
    {
      id:4,
      url: 'assets/video4.mp4',
      text: "Built from the ground-up to help you discover cooks and explore recipes like never before.",
    },
    {
      id:5,
      url: 'assets/video5.mp4',
      text: "Prefer to watch? Every recipe is connected to the cook's respective social media postings.",
    },
  ];

}
