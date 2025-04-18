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
import { TheDetailHistoryComponent } from './the-detail-history/the-detail-history.component';

const routes: Routes = [
  {
    path: 'dashboard',
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
    component: TheLoginComponent  
  },  
  {  
    path: 'riwayat',  
    component: TheHistoryComponent,  
    canActivate: [AuthGuard]   
  },  
  {  
    path: 'akun',  
    component: TheAccountComponent,  
    canActivate: [AuthGuard]    
  },  
  {  
    path: 'inspeksi-unit/:unit_id',  
    component: InspeksiUnitComponent,  
    canActivate: [AuthGuard]   
  },  
  {  
    path: 'exterior-inspection/:unit_id',  
    component: ExteriorInspectionComponent,  
    canActivate: [AuthGuard]   
  },  
  {  
    path: 'interior-inspection/:unit_id',  
    component: InteriorInspectionComponent,  
    canActivate: [AuthGuard] 
  },  
  {  
    path: 'engine-inspection/:unit_id',  
    component: EngineInspectionComponent,  
    canActivate: [AuthGuard] 
  },  
  {  
    path: 'unit-photos/:unit_id',  
    component: PhotosInspectionComponent,  
    canActivate: [AuthGuard] 
  },  
  {  
    path: 'inspection-summary/:unit_id',  
    component: InspectionSummaryComponent,  
    canActivate: [AuthGuard] 
  },  
  {  
    path: 'detil-riwayat/:unit_id',  
    component: TheDetailHistoryComponent,  
    canActivate: [AuthGuard] 
  },  
  {  
    path: '',  
    redirectTo: '/login',  
    pathMatch: 'full'  
  },  
  {  
    path: 'detil-tugas/:unit_id',  
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
