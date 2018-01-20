import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription'

import { UserRequestService } from '../request-services/user-request.service'
import { UserService }  from '../system-services/user/user.service'

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.sass']
})
export class ManagementComponent implements OnInit {

  user: any;

  menus: any;

  subscriptions = new Subscription()

  constructor(
    private UserRequestService: UserRequestService,
    private userService: UserService
  ) {
    }

  ngOnInit() {

    this.subscriptions.add(this.userService.userObs.subscribe(response => this.user = response));

    this.subscriptions.add(this.UserRequestService.getMenus().subscribe(response => this.menus = response));
  }

  ngOnDestroy()
  {
    this.subscriptions.unsubscribe()
  }

}
