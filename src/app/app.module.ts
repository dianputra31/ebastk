import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { TheDashboardComponent } from './the-dashboard/the-dashboard.component';
import { TheTugasComponent } from './the-tugas/the-tugas.component';
import { HttpClientModule } from '@angular/common/http';
import { TheLoginComponent } from './the-login/the-login.component'; // Pastikan ini ada  
import { FormsModule } from '@angular/forms';
import { TheHistoryComponent } from './the-history/the-history.component';
import { TheAccountComponent } from './the-account/the-account.component';
import { TheMenusOfDetailContentComponent } from './the-detail-content/the-menus-of-detail-content/the-menus-of-detail-content.component';
import { TheDetilTugasComponent } from './the-detil-tugas/the-detil-tugas.component';
import { TheMenuOfDetilTugasComponent } from './menu-of-detil-tugas/the-menu-of-detil-tugas.component'; // Impor FormsModule  
import { MatExpansionModule } from '@angular/material/expansion';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DetailFooterComponent } from './detail-footer/detail-footer.component';
import { InspeksiUnitComponent } from './inspeksi-unit/inspeksi-unit.component';
import { ExteriorInspectionComponent } from './exterior-inspection/exterior-inspection.component';
import { InteriorInspectionComponent } from './interior-inspection/interior-inspection.component';
import { EngineInspectionComponent } from './engine-inspection/engine-inspection.component';
import { PhotosInspectionComponent } from './photos-inspection/photos-inspection.component';
import { InspectionDoneComponent } from './inspection-done/inspection-done.component';
import { MenuOfExteriorInspectionComponent } from './menu-of-exterior-inspection/menu-of-exterior-inspection.component';
import { MenuOfInteriorInspectionComponent } from './menu-of-interior-inspection/menu-of-interior-inspection.component';
import { MenuOfEngineInspectionComponent } from './menu-of-engine-inspection/menu-of-engine-inspection.component';
import { MenuOfPhotosInspectionComponent } from './menu-of-photos-inspection/menu-of-photos-inspection.component';
import { TheMenusOfTugasComponent } from './menu-of-tugas/the-menus-of-tugas.component';
import { TheModalComponent } from './the-modal/the-modal.component';
import { InspectionSummaryComponent } from './inspection-summary/inspection-summary.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ImageUploaderComponent } from './image-uploader/image-uploader.component';
import { FilterRiwayatComponent } from './filter-riwayat/filter-riwayat.component';
import { SharedService } from './services/shared.service';
import { LoadingOverlayComponent } from './loading-overlay/loading-overlay.component';
import { TheDetailHistoryComponent } from './the-detail-history/the-detail-history.component';
import { MenuOfDetailRiwayatComponent } from './menu-of-detail-riwayat/menu-of-detail-riwayat.component';
import { TheDetailHistoryExteriorComponent } from './the-detail-history-exterior/the-detail-history-exterior.component';
import { TheDetailHistoryInteriorComponent } from './the-detail-history-interior/the-detail-history-interior.component';
import { TheDetailHistoryEngineComponent } from './the-detail-history-engine/the-detail-history-engine.component';
import { TheDetailHistoryPhotosComponent } from './the-detail-history-photos/the-detail-history-photos.component';
import { TheDetailHistoryInfoComponent } from './the-detail-history-info/the-detail-history-info.component';
import { TheDetailHistoryFooterComponent } from './detail-history-footer/the-detail-history-footer.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,    
    TheDashboardComponent,
    TheTugasComponent,
    TheLoginComponent,
    TheHistoryComponent,
    TheAccountComponent,
    TheMenusOfDetailContentComponent,
    TheDetilTugasComponent,
    TheMenuOfDetilTugasComponent,
    DetailFooterComponent,
    InspeksiUnitComponent,
    ExteriorInspectionComponent,
    InteriorInspectionComponent,
    EngineInspectionComponent,
    PhotosInspectionComponent,
    InspectionDoneComponent,
    MenuOfExteriorInspectionComponent,
    MenuOfInteriorInspectionComponent,
    MenuOfEngineInspectionComponent,
    MenuOfPhotosInspectionComponent,
    TheMenusOfTugasComponent,
    TheModalComponent,
    InspectionSummaryComponent,
    ImageUploaderComponent,
    FilterRiwayatComponent,
    LoadingOverlayComponent,
    TheDetailHistoryComponent,
    MenuOfDetailRiwayatComponent,
    TheDetailHistoryExteriorComponent,
    TheDetailHistoryInteriorComponent,
    TheDetailHistoryEngineComponent,
    TheDetailHistoryPhotosComponent,
    TheDetailHistoryInfoComponent,
    TheDetailHistoryFooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    MatExpansionModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  providers: [SharedService],
  bootstrap: [AppComponent]
})
export class AppModule { }
