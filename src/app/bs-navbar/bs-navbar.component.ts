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
      this.shoppingCartItemCount = 0;

      // console.log(cart.length);
      // console.log(this.shoppingCartItem[1]);

      for (let item in this.shoppingCartItem) {
        if (this.shoppingCartItem[item].key === "items") {
          for (let i in this.shoppingCartItem[item]) {
            if (this.shoppingCartItem[item][i].quantity != undefined)
              this.shoppingCartItemCount += this.shoppingCartItem[item][i].quantity;
          }
        }
      }

      // for (let productId in cart.items)
      //   this.shoppingCartItemCount += cart.items[productId].quantity;
    });
  }

  logout() {
    this.auth.logout();
  }
}
