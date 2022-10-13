import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RoutingGuard } from './routing.guard';
import { BillingComponent } from './billing/billing.component';
import { GroupListComponent } from './group-list/group-list.component';
import { AdminBioComponent } from './admin-bio/admin-bio.component';
import { GroupProfilesComponent } from './group-profiles/group-profiles.component';
import { AffiliatesComponent } from './affiliates/affiliates.component';
import { GroupPluginComponent } from './group-plugin/group-plugin.component';
import { GroupLeadsComponent } from './group-leads/group-leads.component';
import { AdminBioPreviewComponent } from './admin-bio-preview/admin-bio-preview.component';
import { GroupPluginCreateComponent } from './group-plugin-create/group-plugin-create.component';
import { GroupProfileCreateComponent } from './group-profile-create/group-profile-create.component';
import { GroupProfilePreviewComponent } from './group-profile-preview/group-profile-preview.component';
import { ManageProfileComponent } from './manage-profile/manage-profile.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', redirectTo: '', pathMatch: 'full' },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [RoutingGuard],
  },
  { path: 'billing', component: BillingComponent, canActivate: [RoutingGuard] },
  {
    path: 'group-list',
    component: GroupListComponent,
    canActivate: [RoutingGuard],
  },
  {
    path: 'group-leads',
    component: GroupLeadsComponent,
    canActivate: [RoutingGuard],
  },
  {
    path: 'admin-bio',
    component: AdminBioComponent,
    canActivate: [RoutingGuard],
  },
  {
    path: 'profile/:slug',
    component: AdminBioPreviewComponent,
  },
  {
    path: 'group-plugin',
    component: GroupPluginComponent,
    canActivate: [RoutingGuard],
  },
  {
    path: 'plugin/create',
    component: GroupPluginCreateComponent,
    canActivate: [RoutingGuard],
  },
  {
    path: 'group-profiles',
    component: GroupProfilesComponent,
    canActivate: [RoutingGuard],
  },
  {
    path: 'group-profile-create',
    component: GroupProfileCreateComponent,
    canActivate: [RoutingGuard],
  },
  {
    path: 'group-profile-manage',
    component: ManageProfileComponent,
    canActivate: [RoutingGuard],
  },
  {
    path: 'group-profile/:slug',
    component: GroupProfilePreviewComponent,
  },
  {
    path: 'affiliate',
    component: AffiliatesComponent,
    canActivate: [RoutingGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
