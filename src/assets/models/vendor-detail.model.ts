export interface VendorDetailResponse {
    id: number;
    vendor_name: string;
    vendor_type: string;
    email: string;
    phone: string;
    province: string;
    city: string;
    address: string;
    id_number: string;
    npwp: string;
    fee: string;         // Jika ingin dikonversi ke number, ubah ke `number`
    pph23: string;       // Sama seperti di atas
    cashback: string;
    roya: string;
    tax_included: boolean;
  }