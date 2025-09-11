import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (user && user.role) {
      const allowedRoles = route.data['roles'] as Array<string>;
      const userRole = user.role.toUpperCase();

      if (allowedRoles && allowedRoles.map(r => r.toUpperCase()).includes(userRole)) {
        return true; // ✅ correct role → allow
      }

      // ❌ role mismatch → redirect to correct dashboard
      if (userRole === 'USER') {
        this.router.navigate(['/user-dashboard']);
      } else if (userRole === 'ADMIN') {
        this.router.navigate(['/admin-dashboard']);
      } else {
        this.router.navigate(['/']); // fallback
      }
      return false;
    }

    // ❌ not logged in
    this.router.navigate(['/navbar']);
    return false;
  }
}
