export interface VendorCategory {
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
  fee: string;
  cashback: string;
  roya: string;
  tax_included: boolean;
}

export interface ApiVendorResponse {
  total_items: number;
  total_pages: number;
  current_page: number;
  results: VendorCategory[];
}