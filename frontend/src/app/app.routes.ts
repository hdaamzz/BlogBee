import { Routes } from '@angular/router';
import { HomeComponent } from './modules/Base/home/home.component';
import { LoginComponent } from './modules/Auth/login/login.component';
import { RegisterComponent } from './modules/Auth/register/register.component';

export const routes: Routes = [

    {
        path:'',
        component:HomeComponent
    },
    {
        path:'login',
        component:LoginComponent
    },
    {
        path:'register',
        component:RegisterComponent
    },



];
