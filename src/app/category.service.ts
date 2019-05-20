import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  itemsRef: AngularFireList<any>;

  constructor(private db: AngularFireDatabase) { }

  getCategories(){
    return this.db.list('/categories')
    .snapshotChanges()
    .pipe(map(changes => 
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    );

    //return this.db.list('/categories', ref => ref.orderByChild('name')).valueChanges();
  }
}
