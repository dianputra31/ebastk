export interface Query {  
    page: number;  
    limit: number;  
    total_page: number;  
    total_item: number;  
  }  
    
  export interface Product {  
    id: number;  
    Vehicle_Type: string;  
    Model: string;  
    Auction_Location: string;  
    Status: string;  
    Category: string;  
    License_Plate: string;  
    Brand: string;  
    Color: string;  
    Year: number;  
    Mileage: string;  
    Engine_Capacity: string;  
    Transmission: string;  
    img: string;  
  }  
    
  export interface SampleData {  
    rc: number;  
    msg: string;  
    additional_info: any; // Ganti dengan tipe yang sesuai jika ada  
    data: {  
      products: Product[];  
      query: Query;  
    };  
  }  