import { Product } from "./../models/product";
import { Component, OnInit, Input } from "@angular/core";
import { ShoppingCartService } from "../shopping-cart.service";

@Component({
  selector: "product-card",
  templateUrl: "./product-card.component.html",
  styleUrls: ["./product-card.component.css"]
})
export class ProductCardComponent {
  @Input("product") product: Product;
  @Input("show-actions") showActions = true;
  @Input("shopping-cart") shoppingCart;

  constructor(private cartService: ShoppingCartService) {}

  addToCart(product: Product) {
    this.cartService.addToCart(product);
  }

  getQuantity() {
    if (!this.shoppingCart) return 0;

    for(var i = 0 ; i < this.shoppingCart.length ; i++)
    {
      if(this.shoppingCart[i].key === "items"){
        let item = this.shoppingCart[i][this.product.key];
        return item ? item.quantity : 0;
      }
    }
  }
}
