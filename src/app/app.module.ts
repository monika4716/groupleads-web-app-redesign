import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DropdownModule } from 'primeng/dropdown';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { FileUploadModule } from 'primeng/fileupload';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderBeforeLoginComponent } from './header-before-login/header-before-login.component';
import { LoginComponent } from './login/login.component';
import { FooterBeforeLoginComponent } from './footer-before-login/footer-before-login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { CounterdisplayformatePipe } from './pipe/counterdisplayformate.pipe';
import { HeaderProfileComponent } from './header-profile/header-profile.component';
import { CookieService } from 'ngx-cookie-service';
import { BillingComponent } from './billing/billing.component';
import { GroupListComponent } from './group-list/group-list.component';
import { AdminBioComponent } from './admin-bio/admin-bio.component';
import { GroupProfilesComponent } from './group-profiles/group-profiles.component';
import { AffiliatesComponent } from './affiliates/affiliates.component';
import { GroupPluginComponent } from './group-plugin/group-plugin.component';
import { GroupLeadsComponent } from './group-leads/group-leads.component';
import { DialogModule } from 'primeng/dialog';
import { SafePipe } from './pipe/safe.pipe';
import { AdminBioPreviewComponent } from './admin-bio-preview/admin-bio-preview.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderBeforeLoginComponent,
    LoginComponent,
    FooterBeforeLoginComponent,
    DashboardComponent,
    SidebarComponent,
    CounterdisplayformatePipe,
    HeaderProfileComponent,
    BillingComponent,
    GroupListComponent,
    AdminBioComponent,
    GroupProfilesComponent,
    AffiliatesComponent,
    GroupPluginComponent,
    GroupLeadsComponent,
    SafePipe,
    AdminBioPreviewComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    BrowserAnimationsModule,
    DropdownModule,
    ChartModule,
    TableModule,
    FileUploadModule,
    DialogModule,
  ],
  providers: [CookieService],
  bootstrap: [AppComponent],
})
export class AppModule {}
