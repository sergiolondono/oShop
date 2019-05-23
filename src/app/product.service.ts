import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private db: AngularFireDatabase) { }

  create(product){
    return this.db.list('/products').push(product);
  }

  getAll(){
    return this.db.list('/products').snapshotChanges()
    .pipe(map(changes => 
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    );
  }    

  get(productId){
     //return this.db.list('/products/' + productId).valueChanges();
    //  return this.db.object('products/-LfUrhkJpj-YKfZaPLYe').snapshotChanges()
    // .pipe(map(res => res.payload.val())
    // );

    // return this.db.object('products/'+productId)
    // .snapshotChanges().map(res => {
    //     return res.payload.val();
    // });

    return this.db.object('/products/' + productId)
    .snapshotChanges()
    .pipe(map(res => res.payload.val()));
    
    //return this.db.object('/products/' + productId).valueChanges();
  }
}
