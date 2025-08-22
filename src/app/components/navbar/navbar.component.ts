import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { UserService, LoginRequest } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';




@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  modalRef?: BsModalRef;
  loginForm!: FormGroup;
  signupForm!: FormGroup;
  responseData:any;

  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  

  ) { }

  ngOnInit(): void {
    // LOGIN FORM
    this.loginForm = this.fb.group({
      name: ['', Validators.required],
      // ✅ should be 'name', not 'username'
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required]

    });
   

    // SIGNUP FORM
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      role: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  // ✅ Custom validator for matching passwords
  passwordMatchValidator(group: AbstractControl) {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { mismatch: true };
  }

  // ✅ Open login modal
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  // ✅ Submit login form
  onLoginSubmit() {
    if (this.loginForm.valid) {
      const loginData: LoginRequest = {
        name: this.loginForm.value.name.trim(),
        password: this.loginForm.value.password.trim(),
        role: this.loginForm.value.role
      };
       this.userService.loginUser(loginData).subscribe({
        next: (res) => {
          
          
          this.modalRef?.hide();
          this.responseData=res;
              // console.log(res);
              
          // Step 1: Show success alert with 2s loading
          Swal.fire({
            title: 'Login Successful!',
            text: `Welcome, ${loginData.name}. Redirecting...`,
            icon: 'success',
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
            didOpen: () => {
              Swal.showLoading();
              
            },
            willClose: () => {
              // Step 2: After 2s, redirect based on role
             
             
              localStorage.setItem('user', JSON.stringify(res));

              if (res.role === 'Admin' && res.password===loginData.password) {
                this.router.navigate(['/admin-dashboard']);
                
              } else if (res.role === 'User') {
                this.router.navigate(['/user-dashboard']);
              }
            }
          });
        },
        error: (err) => {
          console.error('Login failed:', err);       
          Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: 'Your Data is Not Found in DataBase.',
            confirmButtonColor: '#d33'
          });
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
      this.messageService.add({severity:'error', summary:'Error', detail:'Fill your login details'})
    }
  }


  confirmSubmit() {
    if (this.signupForm.valid) {
      this.confirmationService.confirm({
        message: 'Do you want to submit the form?',
        header: 'Confirm Submission',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.onSignupSubmit();
        },
        reject: () => {
          this.messageService.add({ severity: 'info', summary: 'Cancelled', detail: 'Submission Cancelled' });
        }
      });
    } else{
      this.signupForm.markAllAsTouched();
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed your Requied fields' })
    }
  }

  onSignupSubmit() {
    if (this.signupForm.valid) {
      
      this.userService.registerUser(this.signupForm.value).subscribe({
        next: (res) => {
          Swal.fire({
            title: 'Success',
            text: "Your Data is Added Successfully!",
            icon: 'success',
            confirmButtonText: 'Ok'
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/login']);
            }
          });
          this.modalRef?.hide();
        
          // this.signupForm.reset();
        },
        error: (err) => {
          console.error('Signup failed:', err);

          Swal.fire({
            icon: 'error',
            title: 'Registration Failed',
            text: 'Please try again later.'
          });
        }
      });
    } else {
      this.signupForm.markAllAsTouched();
    }
  }


  // ✅ Switch from login to signup
  openSignup(template: TemplateRef<any>) {
    this.modalRef?.hide();
    setTimeout(() => {
      this.modalRef = this.modalService.show(template, { class: 'modal-md' });
    }, 300);
  }
}
