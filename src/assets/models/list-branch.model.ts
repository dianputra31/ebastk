
export interface Resultados {
    id: number;
    branch_name: string;
    pic_name: string;
    pic_phone: string;
    city: string;
}

export interface NewApiBranchResponse {
    total_items: number;
    total_pages: number;
    current_page: number;
    results: Resultados[];
}