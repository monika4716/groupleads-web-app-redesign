import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
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
import { ErrorPageComponent } from './error-page/error-page.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'login',
    redirectTo: '',
    pathMatch: 'full',
    title: 'GroupLeads Login',
  },
  {
    path: 'forget-password',
    component: ForgetPasswordComponent,
    title: 'GroupLeads Forget Pasword',
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [RoutingGuard],
    title: 'Groupleads Web App',
  },
  {
    path: 'billing',
    component: BillingComponent,
    canActivate: [RoutingGuard],
    title: 'Billing',
  },
  {
    path: 'group-list',
    component: GroupListComponent,
    canActivate: [RoutingGuard],
    title: 'Group List',
  },
  {
    path: 'group-leads',
    component: GroupLeadsComponent,
    canActivate: [RoutingGuard],
    title: 'Group Leads',
  },
  {
    path: 'admin-bio',
    component: AdminBioComponent,
    canActivate: [RoutingGuard],
    title: 'Admin Bio',
  },
  {
    path: 'profile/:slug',
    component: AdminBioPreviewComponent,
    title: 'Admin Bio Profile',
  },
  // {
  //   path: 'group-plugin',
  //   component: GroupPluginComponent,
  //   canActivate: [RoutingGuard],
  // },
  // {
  //   path: 'plugin/create',
  //   component: GroupPluginCreateComponent,
  //   canActivate: [RoutingGuard],

  // },
  {
    path: 'group-profiles',
    component: GroupProfilesComponent,
    canActivate: [RoutingGuard],
    title: 'Group Profiles',
  },
  {
    path: 'group-profile-create',
    component: GroupProfileCreateComponent,
    canActivate: [RoutingGuard],
    title: 'Group Profile Create',
  },
  {
    path: 'group-profile-manage',
    component: ManageProfileComponent,
    canActivate: [RoutingGuard],
    title: 'Group Profile Manage',
  },
  {
    path: 'group-profile/:slug',
    component: GroupProfilePreviewComponent,
    title: 'Group Profile Preview',
  },
  {
    path: 'affiliate',
    component: AffiliatesComponent,
    canActivate: [RoutingGuard],
    title: 'Affiliate',
  },
  {
    path: '**',
    component: ErrorPageComponent,
    title: 'Groupleads Web App',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
