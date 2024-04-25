export interface Product {
    productID:      number;
    reference:      string;
    productname:    string;
    quantity:       number;
    costwithoutvat: number;
    costwithvat:    number;
    vat:            number;
    totalcost:      number;
    stock:          number;
    classification: string;
    supplier:       string;
    homeprice:      HomePrice;
    photos:         Photo[];
    description:    string;
    type:           string;
    currentColor:   string;
}

export interface HomePrice {
    value:            number;
    utilityPercentage: number;
    utilityValue:      number;
}

export interface Photo {
    color: string;
    url:   string;
}
