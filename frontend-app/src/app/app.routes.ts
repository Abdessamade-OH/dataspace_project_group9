import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginRegisterComponent } from './shared/components/login-register/login-register.component';
import { HomeComponent } from './components/home/home.component';
import { authGuard } from './shared/guards/auth.guard';

export const routes: Routes = [

    {
        path: '',
        component: DashboardComponent,
        canActivate: [authGuard]
      },    //{ path: 'dashboard', component: DashboardComponent},
    { path: 'auth', component: LoginRegisterComponent},
    { path: '**', redirectTo: '/' },

];
