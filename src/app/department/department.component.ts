import { Component, OnInit } from '@angular/core';
import { Department } from '../department';
import { DepartmentService } from '../department.service';
import { filter } from 'minimatch';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit {

  depName: string = ''
  depEdit: Department = null
  departments: Department[] = []
  constructor(private departmentService: DepartmentService,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.departmentService.get()
    .subscribe((deps)=>{
      this.departments = deps
    })
  }

  save(){
    if(this.depEdit){
      this.departmentService.update({name: this.depName, _id:this.depEdit._id})
      .subscribe((dep)=>{
        this.notify('Updated')
      },
      (err)=>{
        this.notify('Error')
        console.error(err)
      })


    }else{
      console.log('asdasd')
      this.departmentService.add({name: this.depName})
        .subscribe((dep)=>{
          this.notify('Insertedd')
          console.log(dep)
          
        },
        (err)=>console.log(err))
        this.clear()

    }
  }
  clear(){
    this.depName=''
    this.depEdit = null
  }
  cancel(){
    this.clear()
  }
  delete(dep: Department){
    this.departmentService.del(dep)
      .subscribe(
        ()=> this.notify('Removed'),
        (err)=>this.notify(err.error.err)
      )
  }
  edit(dep: Department){
    this.depName = dep.name
    this.depEdit = dep
  }
  notify(msg: string){
    this.snackBar.open(msg,'OK',{duration:3000})
  }

}
