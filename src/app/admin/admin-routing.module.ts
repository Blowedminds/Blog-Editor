import { NgModule } from '@angular/core';
import { RouterModule, Routes }    from '@angular/router';

const routes = [
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes,
      { enableTracing: false}
  )],
  exports: [
    RouterModule
  ]
})
export class AdminRoutingModule { }
