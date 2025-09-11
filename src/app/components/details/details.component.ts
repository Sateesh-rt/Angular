import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { DetailsService } from 'src/app/services/details.service';
import { ConfirmDialog } from 'primeng/confirmdialog';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  name: string = '';
  userEmail: string = '';
  userMobile: string = '';
  userRole: string = '';
  UserData: any[] = [];  
  userForm!: FormGroup;
  editUser: boolean = false;
  id: any = null;
  bankForm!: FormGroup;

  constructor(private detailService: DetailsService, private fb: FormBuilder) { }

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id;
    this.initUserForm();
    this.initBankForm();
    this.fetchUserDetails(userId);
    this.fetchBankDetails();
  }

  initUserForm() {
    this.userForm = this.fb.group({
      id: [''],
      name: [''],
      email: [''],
      mobile: [''],
      role: ['']
    });
  }
  initBankForm() {
    this.bankForm = this.fb.group({
      bankName: [''],
      branchName: [''],
      accountNumber: [''],
      accountHolderName: [''],
      ifscCode: ['']
    });

  }

  // ✅ Fetch user details
  fetchUserDetails(userId?: number) {
    // Prefer passed userId
    const id = userId || JSON.parse(localStorage.getItem('user') || '{}').id;

    if (id) {
      this.detailService.getUserDetails(id).subscribe({
        next: (data: any) => {
          // Patch into form
          this.userForm.patchValue({
            id: data.id,
            name: data.name,
            email: data.email,
            mobile: data.mobile,
            role: data.role
          });

          // Store variables
          this.id = data.id;
          this.name = data.name;
          this.userEmail = data.email;
          this.userMobile = data.mobile;
          this.userRole = data.role;
        },
        error: (err) => {
          console.error(' Error fetching user from DB:', err);
        }
      });
    } else {
      console.warn(' No userId found in param or localStorage');
    }
  }



  // Fetch multiple bank details
  fetchBankDetails() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id;

    if (userId) {
      this.detailService.getBankDetails(userId).subscribe((banks: any[]) => {
        // Attach a form to each bank detail
        this.UserData = banks.map(bank => ({
          ...bank,
          // editing: false,
          form: this.fb.group({
            bankName: [bank.bankName],
            branchName: [bank.branchName],
            accountHolderName: [bank.accountHolderName],
            accountNumber: [bank.accountNumber],
            ifscCode: [bank.ifscCode]
          })
        }));
      });
    }

  }

  //  Toggle edit mode for user
  toggleUserEdit() {
    this.editUser = !this.editUser;

  }

 updateUser(userId?: number) {
  const id = userId || JSON.parse(localStorage.getItem('user') || '{}').id;

  if (!id) {
    console.error('No userId found for updating user details');
    return;
  }

  if (this.userForm.valid) {
    Swal.fire({
      title: 'Confirm Update',
      text: 'Are you sure you want to update this user?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Update',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.detailService.updateUserDetails(id, this.userForm.value).subscribe({
          next: (res: any) => {
            console.log('Response from backend:', res);

            // update UI with backend response
            this.name = res.name;
            this.userEmail = res.email;
            this.userMobile = res.mobile;

            Swal.fire('Updated!', 'User details updated successfully.', 'success');
              window.location.reload();
            this.toggleUserEdit();
          
          },
          error: (err) => {
            console.error('Error updating user:', err);
            Swal.fire('Error', 'Failed to update user details.', 'error');
          }
        });
      }
    });
  } else {
    Swal.fire('Invalid Form', 'Please fill all required fields correctly.', 'warning');
  }
}



  //  Toggle edit mode for a bank card
  toggleBankEdit(detail: any) {
    detail.editing = !detail.editing;
  }

updateBank(detail: any) {
  if (detail.form.valid) {
    Swal.fire({
      title: 'Confirm Update',
      text: 'Are you sure you want to update bank details?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Update',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.detailService.updateBankDetails(detail.id, detail.form.value).subscribe({
          next: (res: any) => {
            console.log('Response from backend:', res);

            // Update local data to reflect changes
            detail.bankName = res.bankName;
            detail.branchName = res.branchName;
            detail.accountNumber = res.accountNumber;
            detail.ifscCode = res.ifscCode;
            detail.accountHolderName = res.accountHolderName;

            Swal.fire('Updated!', 'Bank details updated successfully.', 'success');
            this.toggleBankEdit(detail);
          },
          error: (err) => {
            console.error('Error updating bank details:', err);
            Swal.fire('Error', 'Failed to update bank details.', 'error');
          }
        });
      }
    });
  } else {
    Swal.fire('Invalid Form', 'Please fill all required fields correctly.', 'warning');
  }
}

  // Placeholders for future
  onDelete() {
  if (this.id) {
    Swal.fire({
      title: 'Confirm Deletion',
      text: 'Are you sure you want to delete this user account?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.detailService.deleteUserDetails(this.id).subscribe({
          next: (res) => {
            console.log('User deleted:', res);

            Swal.fire('Deleted!', 'User account deleted successfully.', 'success');

            // Clear local storage and redirect
            localStorage.removeItem('user');
            // Example: navigate to login
            // this.router.navigate(['/login']);
          },
          error: (err) => {
            console.error('Error deleting user:', err);
            Swal.fire('Error', 'Failed to delete user account.', 'error');
          }
        });
      }
    });
  } else {
    Swal.fire('No User ID', 'User ID not found for deletion.', 'warning');
  }
}



deleteBank(detail: any) {
  if (detail.id) {
    Swal.fire({
      title: 'Confirm Deletion',
      text: 'Are you sure you want to delete this bank detail?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.detailService.deleteBankDetails(detail.id).subscribe({
          next: (res) => {
            console.log('Bank detail deleted:', res);

            Swal.fire('Deleted!', 'Bank detail deleted successfully.', 'success');

            // Remove from local array to update UI
            this.UserData = this.UserData.filter(d => d.id !== detail.id);
          },
          error: (err) => {
            console.error('Error deleting bank detail:', err);
            Swal.fire('Error', 'Failed to delete bank detail.', 'error');
          }
        });
      }
    });
  } else {
    Swal.fire('No Bank ID', 'Bank ID not found for deletion.', 'warning');
  }
}



}
