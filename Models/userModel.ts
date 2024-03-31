//user tabel
//id , name , email , isAdmin , isBarber , phonenumber , isValidated
interface User {
    _id?: string;
    firebaseUid: string;
    username: string;
    email: string;
    isAdmin: boolean;
    isBarber: boolean;
    phonenumber: string;
    isValidated: boolean;
}


export { User };
