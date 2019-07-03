import { ActivatedRoute } from "@angular/router";
import { CategoryService } from "./../category.service";
import { ProductService } from "./../product.service";
import { Component } from "@angular/core";
import { Product } from "../models/product";
import { Subscription } from "rxjs";

@Component({
  selector: "app-products",
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.css"]
})
export class ProductsComponent {
  products: any[] = [];
  filteredProducts: any[] = [];
  categories$;
  category: string;

  constructor(
    route: ActivatedRoute,
    productService: ProductService,
    categoryService: CategoryService
  ) {
    productService.getAll().subscribe(products => {
      this.products = products;
    });
    console.log(this.products);

    this.categories$ = categoryService.getAll();

    route.queryParamMap.subscribe(params => {
      this.category = params.get("category");

      this.filteredProducts = this.category
        ? this.products.filter(p => p.category === this.category)
        : this.products;
    });
  }
}
