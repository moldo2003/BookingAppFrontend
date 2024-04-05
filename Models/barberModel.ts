
interface Service{
    serviceName : string;
    servicePrice : number;
    serviceTime : number;
    
}


interface Barber {
    _id?: string;
    firebaseUid: string;
    username: string;
    email: string;
    phonenumber: string;
    profilePic: string;
    photos: string[];
    smallDescription: string;
    bigDescription: string;
    services: Service[];
}


export { Barber ,Service };
