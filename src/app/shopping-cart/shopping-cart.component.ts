import { ShoppingCartService } from "./../shopping-cart.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-shopping-cart",
  templateUrl: "./shopping-cart.component.html",
  styleUrls: ["./shopping-cart.component.css"]
})
export class ShoppingCartComponent implements OnInit {
  cart$;
  shoppingCartItem;
  shoppingCartItemCount: number;
  products;
  objectKeys;

  constructor(private shoppingCartService: ShoppingCartService) {}

  async ngOnInit() {
    this.cart$ = await this.shoppingCartService.getCart();
    this.cart$.subscribe(cart => {
      this.shoppingCartItem = cart;
      this.shoppingCartItemCount = this.shoppingCartService.totalItemsCount(
        this.shoppingCartItem
      );

      for (let item in cart) {
        if (cart[item].key === "items") {
          this.products = cart[item];
          console.log(this.products);
          this.objectKeys = Object.keys(this.products);
          console.log(this.objectKeys);
        }
      }
    });
  }
}
