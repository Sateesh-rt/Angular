import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

import { MessageService } from 'primeng/api';
import { CartService } from 'src/app/services/cart.service';
import Swal from 'sweetalert2';
// import { parse } from '@babel/parser';




@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  products: Product[] = [];
  username?: string = '';
  cartCount: number = 0;
  display: string = '';
  selectedCategory: string = 'All';
  searchTerm: string = '';
  filteredProducts: Product[] = [];
  selectedPriceRanges: { min: number; max: number }[] = [];
  userRole: string = '';
  quantity: number = 0;




  constructor(private productService: ProductService,
    private http: HttpClient,
    private router: Router,
    private userService: UserService,
    private meassageService: MessageService,
    private cartService: CartService) { }

  ngOnInit(): void {
    this.fetchProducts();

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id;

    if (userId) {
      this.cartService.getCartItems(userId).subscribe((items) => {
        this.cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
      });
    }
    
    this.username = user.name;

    const role = JSON.parse(localStorage.getItem('role') || '{}');
    this.userRole = user.role || '';

    this.noData();
    this.applyFilters();
    this.onSearch(this.searchTerm);
  }
  togglePriceRange(min: number, max: number, event: any) {
    if (event.target.checked) {
      // Add selected range
      this.selectedPriceRanges.push({ min, max });
    } else {
      // Remove unselected range
      this.selectedPriceRanges = this.selectedPriceRanges.filter(
        range => !(range.min === min && range.max === max)
      );
    }
    this.applyFilters();
  }

  applyFilters() {
    let filtered = this.products;

    // Filter by category
    if (this.selectedCategory && this.selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category === this.selectedCategory);
    }

    // Filter by price range
    if (this.selectedPriceRanges.length > 0) {
      filtered = filtered.filter(product =>
        this.selectedPriceRanges.some(range =>
          product.price >= range.min && product.price <= range.max
        )
      );
    }
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term) ||
        product.description?.toLowerCase().includes(term)
      );
    }


    this.filteredProducts = filtered;
    this.noData();
   
  }
  noData() {
    if (this.filteredProducts.length === 0) {
      this.display = "No Data Found";
      
    } else {
      this.display = "";
      
    }
    
  }




  onSearch(value: string): void {
    this.searchTerm = value;
    this.applyFilters();
  }


fetchProducts(): void {
  this.productService.getProducts().subscribe((data) => {
    this.products = data;

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id;

    if (userId) {
      this.cartService.getCartItems(userId).subscribe((cartItems) => {
        this.cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

        this.products.forEach((product) => {
          const cartItem = cartItems.find(ci => ci.productName === product.name);
          if (cartItem) {
            product.quantity = cartItem.quantity;
            product.cartItemId = cartItem.id;
          }
        });

        this.applyFilters();
      });
    } else {
      this.applyFilters();
    }
  });
}

addToCart(product: any) {
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  if (!user || !user.id) {
    Swal.fire({
      title: 'Please login to add items to cart',
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Login'
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/navbar']);
      }
    });
    return;
  }

  const userId = user.id;
  const cartItem = {
    productName: product.name,
    price: product.price,
    imagePath: product.imagePath,
    quantity: 1
  };

  this.cartService.addToCart(userId, cartItem).subscribe({
    next: (res) => {
      // ✅ res = saved Cart entity from backend
      product.quantity = res.quantity;
      product.cartItemId = res.id;

      this.cartCount++;
      this.meassageService.add({
        severity: 'success',
        summary: 'Added',
        detail: `${product.name} added to cart`
      });
    },
    error: (err) => {
      console.error('Error adding to cart:', err);
      this.meassageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Could not add item to cart'
      });
    }
  });
}
increase(product: any) {
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  if (!user || !user.id) {
    Swal.fire({
      title: 'Please login to add items to cart',
      icon: 'warning',
      confirmButtonText: 'Login'
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/navbar']);
      }
    });
    return;
  }

  // Case 1: Not yet in cart → Add first time
  if (!product.cartItemId) {
    const cartItem = {
      productName: product.name,
      price: product.price,
      imagePath: product.imagePath,
      quantity: 1
    };

    this.cartService.addToCart(user.id, cartItem).subscribe({
      next: (savedItem) => {
        product.cartItemId = savedItem.id;
        product.quantity = savedItem.quantity;
        this.cartCount++;
        this.meassageService.add({ severity: 'success', summary: 'Added', detail: `${product.name} added to cart` });
      },
      error: (err) => {
        console.error('Error adding to cart:', err);
        this.meassageService.add({ severity: 'error', summary: 'Error', detail: 'Could not add item to cart' });
      }
    });
  } 
  // Case 2: Already in cart → Update quantity
  else {
    const newQuantity = (product.quantity || 0) + 1;
    this.cartService.updateQuantity(product.cartItemId, newQuantity).subscribe(updated => {
      product.quantity = updated.quantity;
    });
  }
}


decrease(product: any) {
  if (product.cartItemId && product.quantity > 1) {
    this.meassageService.add({ severity: 'success', summary: 'Removed', detail: `${product.name} Removed Succesfully` });
    product.quantity--;
    this.cartService.updateQuantity(product.cartItemId, product.quantity).subscribe();
  } else if (product.cartItemId && product.quantity === 1) {
    this.cartService.removeItem(product.cartItemId).subscribe(() => {
      product.quantity = 0;
      product.cartItemId = null;
    });
  }
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
        this.router.navigate(['/user-dashboard']);
        window.location.reload();
      })
    } else {
      // Swal.fire({
      //   title: `Account Datails Not Found!..`,
      //   confirmButtonText: 'Ok',
      //   icon: 'error'
      // })
      this.router.navigate(['/navbar']);
    }
  }
  cart() {
    this.router.navigate(['/cart'])
  }
   goToUserDetails() {
    this.router.navigate(['/details']);
  }
}
