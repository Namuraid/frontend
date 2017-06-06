import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SelectScreenComponent } from './select-screen.component';
import { ScreenComponent } from './screen.component';


const appRoutes: Routes = [
  { path: 'screen/:id', component: ScreenComponent },
  { path: '', pathMatch: 'full', component: SelectScreenComponent },
  { path: '**', redirectTo: '' }
];
@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
