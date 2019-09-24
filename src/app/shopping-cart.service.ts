import { AngularFireDatabase } from "angularfire2/database";
import { Injectable } from "@angular/core";
import { Product } from "./models/product";
import { take, map } from "rxjs/operators";
import { Observable } from "rxjs";
import { ShoppingCart } from './models/shopping-cart';

@Injectable({
  providedIn: "root"
})
export class ShoppingCartService {
  shoppingCartItemCount: number;

  constructor(private db: AngularFireDatabase) {}

  private create() {
    return this.db.list("/shopping-carts").push({
      dateCreated: new Date().getTime()
    });
  }

    async getCart() {
     let cartId = await this.getOrCreateCartId();
    return this.db.list("/shopping-carts/" + cartId).snapshotChanges()
    .pipe(map(changes => 
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    );
  }

  private getItem(cartId: string, productId: string){
    return this.db.object("/shopping-carts/" + cartId + "/items/" + productId);
  }

  private async getOrCreateCartId(): Promise<string> {
    let cartId = localStorage.getItem("cartId");
    if (cartId) return cartId;

    let result = await this.create();
    localStorage.setItem("cartId", result.key);
    return result.key;
  }

  async addToCart(product: Product) {
    this.updateItemQuantity(product, 1);
  }

  async removeFromCart(product: Product) {
    this.updateItemQuantity(product, -1);
  }

  private async updateItemQuantity(product: Product, change: number){
    const cartId = await this.getOrCreateCartId();
    const item$ = this.getItem(cartId, product.key); 

    item$.valueChanges().take(1).subscribe(item => {
        if (item) item$.update({ quantity: item["quantity"] + change });
         else item$.set({ product, quantity: 1 });        
      });
  }

  totalPrice(cart){
    let sum = 0;
    for (let item in cart) {
      if (cart[item].key === "items") {
        for (let i in cart[item]) { 
          if (cart[item][i].product != undefined){
            sum += cart[item][i].product.price * cart[item][i].quantity;
          }          
        }
      }
    }
    return sum;
  }

  totalItemsCount(cart){
    this.shoppingCartItemCount = 0;

    for (let item in cart) {
      if (cart[item].key === "items") {
        for (let i in cart[item]) {
          if (cart[item][i].quantity != undefined)
            this.shoppingCartItemCount += cart[item][i].quantity;
        }
      }
    }

    return this.shoppingCartItemCount;
  }
}
