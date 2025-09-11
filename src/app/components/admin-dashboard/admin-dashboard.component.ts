import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/product.model';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { MessageService } from 'primeng/api';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  productForm!: FormGroup;
  products: Product[] = [];
  isUpdate = false;
  updatingProductId!: number;
  username: string = '';
  userPassword: string = '';
  userRole: string = '';
  imageUrl?: string | null = '';
  filename: string = '';
  selectedImageUrl: string | null = null;
  imageFile: File | null = null;
  showModal: boolean = false;
  




  constructor(private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private messageService: MessageService,
    private userService: UserService


  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadProducts();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.username = user.name || '';


    const role = JSON.parse(localStorage.getItem('role') || '{}');
    this.userRole = user.role || '';

  }

  initForm() {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      category: ['', Validators.required],

    });
  }


  // On file selection
  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.imageFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  // Open the popup
  openModal(): void {
    if (this.imageUrl) {
      this.showModal = true;
    } else {
      Swal.fire('Not Found', 'Image is Not Uploded here', 'warning');
    }
  }

  // Close the popup
  closeModal(): void {
    this.showModal = false;
  }


  onSubmit(): void {
    
    if (this.productForm.invalid || (!this.imageFile === null || this.imageUrl === null)) {
     
      
        this.productForm.markAllAsTouched();

        Swal.fire({
          icon: 'error',
          title: 'Form Incomplete',
          text: 'Please fill all fields and upload an image.',
          confirmButtonColor: '#d33'
        });
      
      return;
    }

    const productData = this.productForm.value;

    const formData = new FormData();
    formData.append('product', new Blob([JSON.stringify(productData)], { type: 'application/json' }));

    if (this.imageFile) {
      formData.append('image', this.imageFile);
    }

    const actionText = this.isUpdate ? 'Update' : 'Add';

    Swal.fire({
      title: `Confirm ${actionText}`,
      text: `Are you sure you want to ${actionText.toLowerCase()} this product?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.isUpdate) {
          this.productService.updateProduct(this.updatingProductId, formData).subscribe(() => {
            Swal.fire('Updated!', 'Product updated successfully.', 'success');

            this.resetForm();
            this.loadProducts();
          });
        } else {
          this.productService.addProduct(formData).subscribe((res) => {
            console.log(res);
            Swal.fire('Added!', 'Product added successfully.', 'success');
            this.resetForm();
            this.loadProducts();
          });
        }
      }
    });
  }





  loadProducts(): void {
    this.productService.getProducts().subscribe(response => {
      console.log(response);
      this.products = response
     })
  }

  onEdit(productId: number): void {
    this.productService.getProductById(productId).subscribe((product: Product) => {
      this.productForm.patchValue(product);
      this.messageService.add({ severity: 'success', detail: 'ok', summary: 'lets go for Update Form' })
      console.log(product);
      this.imageUrl = product.imageUrl;
      //  console.log(this.imageUrl);
      this.isUpdate = true;
      this.updatingProductId = product.id!;
    });
  }



  onDelete(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action will permanently delete the product.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.deleteProduct(id).subscribe(() => {
          this.loadProducts();
          Swal.fire('Deleted!', 'The product has been deleted.', 'success');
        });
      }
      else if (!result.isConfirmed) {
        this.messageService.add({ severity: 'error', detail: 'delete cancel', summary: 'you cancelled to delete', })
      }
    });
  }

  resetForm(): void {
    this.productForm.reset();
    this.isUpdate = false;
    this.imageFile = undefined!;
    // this.selectedImage = undefined!;
  }
  logout() {

    let user = localStorage.getItem('user');
    if (user) {
      Swal.fire({
        title: 'Logout successfully',
        icon: 'success',
        confirmButtonColor: 'green',
        timer: 2000,

      }).then(() => {
        localStorage.removeItem('user');
        this.router.navigate(['/navbar']);
      })
    } else {
      Swal.fire({
        title: `Account Datails Not Found!..`,
        icon: 'error',
        cancelButtonColor: 'Ok'
      })
    }
  }
  goToUserDetails() {
    this.router.navigate(['/details']); 
  }
}

