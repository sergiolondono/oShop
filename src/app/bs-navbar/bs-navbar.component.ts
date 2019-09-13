import { ShoppingCart } from './../models/shopping-cart';
import { AppUser } from "./../models/app-user";
import { AuthService } from "./../auth.service";
import { Component, OnInit } from "@angular/core";
import { ShoppingCartService } from "../shopping-cart.service";

@Component({
  selector: "bs-navbar",
  templateUrl: "./bs-navbar.component.html",
  styleUrls: ["./bs-navbar.component.css"]
})
export class BsNavbarComponent implements OnInit {
  appUser: AppUser;
  shoppingCartItemCount: number;
  shoppingCartItem;
  any;

  constructor(
    private auth: AuthService,
    private shoppingCartService: ShoppingCartService
  ) {}

  async ngOnInit() {
    this.auth.appUser$.subscribe(appUser => (this.appUser = appUser));

    let cart$ = await this.shoppingCartService.getCart();
    cart$.subscribe(cart => {
      this.shoppingCartItem = cart;
      this.shoppingCartItemCount = this.shoppingCartService.totalItemsCount(this.shoppingCartItem);
    });
  }

  logout() {
    this.auth.logout();
  }
}
