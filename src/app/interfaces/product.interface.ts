export interface Product {
    id:      number;
    reference:      string;
    productname:    string;
    quantity:       number;
    costwithoutvat: number;
    costwithvat:    number;
    vat:            number;
    totalcost:      number;
    stock:          number;
    classification: string;
    supplier:       number;
    homeprice:      HomePrice;
    photos:         Photo[];
    description:    string;
    type:           string;
    currentColor:   string;
    hasColor:       boolean;
}

export interface HomePrice {
    value:            number;
    utilitypercentage: number;
    utilityvalue:      number;
}

export interface Photo {
    color: string;
    url:   string;
}
