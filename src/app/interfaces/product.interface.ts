export interface Product {
    productID:      number;
    reference:      string;
    productName:    string;
    quantity:       number;
    costWithoutVAT: number;
    costWithVAT:    number;
    vat:            number;
    totalCost:      number;
    stock:          number;
    classification: string;
    supplier:       string;
    homePrice:      HomePrice;
    photos:         Photo[];
    description:    string;
}

export interface HomePrice {
    value:            number;
    profitPercentage: number;
    profitValue:      number;
}

export interface Photo {
    color: string;
    url:   string;
}
