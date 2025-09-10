export interface UnitData {
    NOPOL: string;
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
}

export interface Resultados {
    id: number;
    notes: string;
    mobilization_by: string;
    mobilization_type: string;
    mobilization_cost: string;
    unit_data: UnitData;
    unit_id: string;
    mobilization: mobilization;
}

export interface NewApiTerjadwalResponse {
    total_items: number;
    total_pages: number;
    current_page: number;
    results: Resultados[];
}