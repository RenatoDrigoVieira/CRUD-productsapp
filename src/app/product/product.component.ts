import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from '../product.service';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { Product } from '../product';
import { Department } from '../department';
import { DepartmentService } from '../department.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import { format } from 'url';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  productForm: FormGroup = this.fb.group({
    _id: [null],
    name: ['',[Validators.required]],
    stock: [0,[Validators.required, Validators.min(0)]],
    price: [0,[Validators.required, Validators.min(0)]],
    departments:[[], [Validators.required]]
  })

  private unsubscribe$: Subject<any> = new Subject<any>()

  products: Product[] = []
  departments: Department[] = []

  constructor(private productService: ProductService,
    private fb: FormBuilder,
    private departmentService: DepartmentService,
    private snackbar: MatSnackBar) { }

    @ViewChild('form',{static: false}) form :NgForm

  ngAfterViewInit(){
    this.productService.get().
    pipe(takeUntil(this.unsubscribe$)).subscribe((prods)=> this.products = prods)
    this.departmentService.get().
    pipe(takeUntil(this.unsubscribe$)).subscribe((deps)=>this.departments = deps)
  }
  ngOnInit() {
    

  }
  save(){
    let data= this.productForm.value
    console.log(data)
    if(data._id != null){
      this.productService.update(data)
        .subscribe()
    }else{
      this.productService.add(data)
        .subscribe()
    }
    this.resetForm()
  }
  delete(p: Product){
    this.productService.del(p)
    .subscribe(
      () => this.notify("Deleted"),
      (err) => console.log(err)
    )
  }
  edit(p: Product){
    this.productForm.setValue(p)
  }

  notify(msg: string){
    this.snackbar.open(msg, "OK", {duration: 3000})
  }

  ngOnDestroy(){
    this.unsubscribe$.next()
  }
  resetForm(){
    //this.productForm.reset()
    this.form.resetForm()
  }
}
