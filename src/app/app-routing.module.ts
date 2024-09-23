import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { LoginSignupComponent } from './login-signup/login-signup.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'login-signup', component: LoginSignupComponent },
  { path: 'dashboard', component: MainComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
