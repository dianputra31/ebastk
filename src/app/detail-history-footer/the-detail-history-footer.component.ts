import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiClientService } from '../services/api.client';


@Component({
  selector: 'app-detail-history-footer',
  templateUrl: './the-detail-history-footer.component.html',
  styleUrls: ['./the-detail-history-footer.component.scss']
})
export class TheDetailHistoryFooterComponent implements OnInit {

  constructor(private router:Router,  private apiClient: ApiClientService) { }

  ngOnInit(): void {
  }

    async downloadDokUnit(a:string){
    const unit_id = this.router.url.split('/').pop(); // Mengambil parameter terakhir dari URL
    // alert(unit_id);
    try {
      const endpoint = `/document/?unit_id=${unit_id}`; // Endpoint API
      const response = await this.apiClient.downloadPdf(endpoint, 'document_bastk.pdf');
      return true;
    }catch(error){
      return false;
    }
  }

}
