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
    path: 'groupList',
    component: GroupListComponent,
    canActivate: [RoutingGuard],
  },
  {
    path: 'adminBio',
    component: AdminBioComponent,
    canActivate: [RoutingGuard],
  },

  {
    path: 'profile/:slug',
    component: AdminBioPreviewComponent,
  },

  {
    path: 'groupProfiles',
    component: GroupProfilesComponent,
    canActivate: [RoutingGuard],
  },

  {
    path: 'affiliate',
    component: AffiliatesComponent,
    canActivate: [RoutingGuard],
  },
  {
    path: 'groupPlugin',
    component: GroupPluginComponent,
    canActivate: [RoutingGuard],
  },
  {
    path: 'groupLeads',
    component: GroupLeadsComponent,
    canActivate: [RoutingGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
