import { Component, OnInit } from '@angular/core';
import { NgForm }            from '@angular/forms';

import { AdminRequestService }  from '../../../request-services/admin-request.service'

import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-menus',
  templateUrl: './menus.component.html',
  styleUrls: ['./menus.component.sass']
})
export class MenusComponent implements OnInit {

  menus: any

  selected_one: any

  open_form: boolean = false

  create_new: boolean = false

  subs = new Subscription()

  roles: Array<any> = []

  filtered_role: any

  filtered_not_role: any

  create_new_filtered_role: any

  create_new_filtered_not_role: any

  constructor(
    private adminRequest: AdminRequestService
  ) { }

  ngOnInit() {
    let rq1 = this.adminRequest.getMenus().subscribe( response => {
      this.menus = response.menus
      this.roles = response.roles
    })

    this.subs.add(rq1)
  }

  ngOnDestroy()
  {
    this.subs.unsubscribe()
  }

  selectPan(i: number)
  {
    if(this.selected_one)
      if(this.selected_one.id === this.menus[i].id){

        this.closePan()

        return
      }

    this.selected_one = this.menus[i]

    this.filtered_not_role =  this.filterRole(this.selected_one.id, true)

    this.filtered_role =  this.filterRole(this.selected_one.id, false)

    this.open_form = true
  }

  filterRole(id: number, bool: boolean)
  {
    if(bool){
      let array = this.roles

      for(let one of this.menus.find( obj => obj.id === id).menu_roles)
        array = array.filter( obj => obj.id !== one)

      return array
    }else{
      let array = []
      for(let one of this.selected_one.menu_roles)
        array.push(this.roles.find( obj => obj.id === one))

      return array
    }
  }

  deleteRole(i: number)
  {
    this.filtered_not_role.push(this.filtered_role[i])
    this.filtered_role.splice(i, 1)
  }

  addRole(item: any)
  {
    let value = item.selected.value

    if(value == undefined || value == null) return;

    let index = this.roles.findIndex( obj => obj.id === value)

    this.filtered_role.push(this.roles[index])

    this.filtered_not_role.splice(this.filtered_not_role.findIndex( obj => obj.id === value), 1)
  }

  closePan()
  {
    this.selected_one = null

    this.open_form = false
  }

  createNew()
  {
    this.create_new = !this.create_new

    if(!this.create_new){
      return
    }

    this.create_new_filtered_role = []

    this.create_new_filtered_not_role = this.roles.filter( obj => true)
  }

  addNewRole(item: any)
  {
    let value = item.selected.value

    if(value == undefined || value == null) return;

    let index = this.roles.findIndex( obj => obj.id === value)

    this.create_new_filtered_role.push(this.roles[index])

    this.create_new_filtered_not_role.splice(this.create_new_filtered_not_role.findIndex( obj => obj.id === value), 1)
  }

  deleteNewRole(i: number)
  {
    this.create_new_filtered_not_role.push(this.create_new_filtered_role[i])
    this.create_new_filtered_role.splice(i, 1)
  }

  updateMenu(f: NgForm)
  {
    let rq2 = this.adminRequest.postMenu({
      id: f.value.id,
      menu_name: f.value.menu_name,
      menu_url: f.value.menu_url,
      menu_roles: this.filtered_role,
      menu_tooltip: f.value.menu_tooltip,
      menu_weight: f.value.menu_weight,
      menu_parent: f.value.menu_parent
    }).subscribe(response => {
      this.afterChange()
    })

    this.subs.add(rq2)
  }

  createMenu(f: NgForm)
  {
    let rq3 = this.adminRequest.putMenu({
      menu_name: f.value.menu_name,
      menu_url: f.value.menu_url,
      menu_roles: this.create_new_filtered_role,
      menu_tooltip: f.value.menu_tooltip,
      menu_weight: f.value.menu_weight,
      menu_parent: f.value.menu_parent
    }).subscribe(response => {
      this.afterChange()
    })

    this.subs.add(rq3)
  }

  deleteMenu(id: number)
  {
    let rq4 = this.adminRequest.deleteMenu(id).subscribe(response => {
      this.afterChange()
    })

    this.subs.add(rq4)
  }

  afterChange()
  {
    this.selected_one = null

    this.open_form = false

    this.menus = null

    this.create_new = false

    let rq1 = this.adminRequest.getMenus().subscribe( response => {
      this.menus = response.menus
      this.roles = response.roles
    })

    this.subs.add(rq1)
  }

}
