import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TheDashboardComponent } from './the-dashboard/the-dashboard.component';
import { TheTugasComponent } from './the-tugas/the-tugas.component'; // Import component
import { AuthGuard } from './auth.guard'; // Import guard  
import { TheLoginComponent } from './the-login/the-login.component';
import { TheHistoryComponent } from './the-history/the-history.component';
import { TheAccountComponent } from './the-account/the-account.component';
import { TheDetilTugasComponent } from './the-detil-tugas/the-detil-tugas.component';
import { InspeksiUnitComponent } from './inspeksi-unit/inspeksi-unit.component';
import { ExteriorInspectionComponent } from './exterior-inspection/exterior-inspection.component';
import { InteriorInspectionComponent } from './interior-inspection/interior-inspection.component';
import { EngineInspectionComponent } from './engine-inspection/engine-inspection.component';
import { PhotosInspectionComponent } from './photos-inspection/photos-inspection.component';
import { InspectionSummaryComponent } from './inspection-summary/inspection-summary.component';

const routes: Routes = [
  {
    path:'dashboard',
    component: TheDashboardComponent,
    canActivate: [AuthGuard]   
  },
  {  
    path: 'dashboard',  
    component: TheDashboardComponent,  
    canActivate: [AuthGuard]   
  },  
  {  
    path: 'tugas',  
    component: TheTugasComponent,  
    canActivate: [AuthGuard]   
  },  
  {  
    path: 'login',  
    component: TheLoginComponent // Rute untuk halaman login  
  },  
  {  
    path: 'riwayat',  
    component: TheHistoryComponent, // Rute untuk halaman login  
    canActivate: [AuthGuard]   
  },  
  {  
    path: 'akun',  
    component: TheAccountComponent, // Rute untuk halaman login 
    canActivate: [AuthGuard]    
  },  
  {  
    path: 'inspeksi-unit',  
    component: InspeksiUnitComponent, // Rute untuk halaman login  
    canActivate: [AuthGuard]   
  },  
  {  
    path: 'exterior-inspection',  
    component: ExteriorInspectionComponent, // Rute untuk halaman login  
    canActivate: [AuthGuard]   
  },  
  {  
    path: 'interior-inspection',  
    component: InteriorInspectionComponent, // Rute untuk halaman login  
    canActivate: [AuthGuard] 
  },  
  {  
    path: 'engine-inspection',  
    component: EngineInspectionComponent, // Rute untuk halaman login  
    canActivate: [AuthGuard] 
  },  
  {  
    path: 'unit-photos',  
    component: PhotosInspectionComponent, // Rute untuk halaman login  
    canActivate: [AuthGuard] 
  },  
  {  
    path: 'inspection-summary',  
    component: InspectionSummaryComponent, // Rute untuk halaman login  
    canActivate: [AuthGuard] 
  },  
  {  
    path: '',  
    redirectTo: '/login', // Redirect ke login jika path kosong  
    pathMatch: 'full'  
  },  
  {  
    path: 'detil-tugas',  
    component: TheDetilTugasComponent,
    canActivate: [AuthGuard],    
    pathMatch: 'full'  
  }  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
