import { AngularFireDatabase } from "angularfire2/database";
import { Injectable } from "@angular/core";
import { Product } from "./models/product";
import { take, map } from "rxjs/operators";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class ShoppingCartService {
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
    const cartId = await this.getOrCreateCartId();
    const item$ = this.getItem(cartId, product.key); 

    item$.valueChanges().take(1).subscribe(item => {
      // item$.update({ product: product, quantity: (item["quantity"] || 0) + 1 });
        if (item) item$.update({ quantity: item["quantity"] + 1 });
         else item$.set({ product, quantity: 1 });        
      });
  }
}
