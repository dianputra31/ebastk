export interface UnitDataMobilisasi {
  [key: string]: string; 
}

export interface mobilization {
    id: number;
    assignment_number: string;
    assignment_date: string;
    unit_location: string;
    pic: string;
    notes: string;
    unit_destination: string;
    assignment_number_st: string;
    pic_phone: string;
    vendor_id: number;
}

export interface MobilisasiUnit {
    id: number;
    notes: string;
    mobilization_by: string;
    mobilization_type: string;
    mobilization_cost: string;
    unit_id: string;
    unit_data: UnitDataMobilisasi;
    mobilization: mobilization;
}