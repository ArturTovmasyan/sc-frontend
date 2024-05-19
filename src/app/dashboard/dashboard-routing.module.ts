import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { AuthGuard } from '../shared';

const routes: Routes = [
    {
        path: '',
        component: DashboardComponent,
        children: [
            { path: '', loadChildren: './homepage/homepage.module#HomepageModule', canActivate: [AuthGuard] },
            { path: 'servers', loadChildren: 'app/dashboard/server/server.module#ServerModule', canActivate: [AuthGuard] },
            { path: 'activity', loadChildren: './activity/activity.module#ActivityModule', canActivate: [AuthGuard] },
            { path: 'documentation', loadChildren: './documentation/documentation.module#DocumentationModule', canActivate: [AuthGuard] },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DashboardRoutingModule {}
