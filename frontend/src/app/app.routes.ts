import { Routes } from '@angular/router';
import { HomeComponent } from './modules/Base/home/home.component';
import { LoginComponent } from './modules/Auth/login/login.component';
import { RegisterComponent } from './modules/Auth/register/register.component';
import { ExploreComponent } from './modules/Base/explore/explore.component';
import { authGuard, nonAuthGuard } from './core/guards/auth/auth.guard';

export const routes: Routes = [

    {
        path:'',
        component:HomeComponent
    },
    {
        path:'login',
        component:LoginComponent,
        canActivate:[nonAuthGuard]
    },
    {
        path:'register',
        component:RegisterComponent,
        canActivate:[nonAuthGuard]
    },
    {
        path:'explore',
        component:ExploreComponent,
        canActivate:[authGuard]
    },




];
