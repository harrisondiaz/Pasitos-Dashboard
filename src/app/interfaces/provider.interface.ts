export interface Provider {
    _id(_id: any): unknown;
    nature: string;
    taxRegime: string;
    documentType: string;
    document: string;
    verificationDigit: number;
    firstName: string;
    otherNames: string;
    lastName: string;
    secondLastName: string;
    businessName: string;
    department: string;
    city: string;
    address: string;
    neighborhood: string;
    phone: number;
    zone: string;
    email: string;
}
