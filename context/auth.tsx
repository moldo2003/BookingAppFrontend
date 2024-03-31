import { FIREBASE_AUTH } from '@/constants/firebaseConfig';
import { useRouter, useSegments } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import * as React from 'react';

// Create the context with a default value matching AuthContextType
const AuthContext = React.createContext<any>(null);

export function useAuth() {
    return React.useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    // Set the type for the user state
    const rootSegment = useSegments();
    const router = useRouter();
    const [user, setUser] = React.useState<string | undefined>("");
    const auth = FIREBASE_AUTH;

    React.useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            if (currentUser && currentUser.emailVerified) {
                setUser(currentUser.uid);
            } else {
                setUser("");
            }
        });

        return () => unsubscribe();
    }, []);
    
    React.useEffect(() => {
        if(user === undefined){
            return;
        }   
        if(!user && rootSegment[0] !== "(auth)"){
            router.replace("/(auth)/login");
         }else if(user && rootSegment[0] !== "(app)"){
            router.replace("/");
         }

    },[user,rootSegment]);   

    return (
        <AuthContext.Provider 
        value={{ 
             user: user,
             signIn: async (email:string , password: string) =>  {
                try{
                    const res = await signInWithEmailAndPassword(auth,email,password)
                    if(res.user.emailVerified)
                     setUser(res.user.uid)
                    else
                      await auth.signOut()
                }
                catch(e){
                    console.log(e);
                }

            },
             signOut: async () => {
                try{
                    const res = await auth.signOut()
                    console.log(res)
                }
                catch(e){
                    console.log(e)
                }
            },
            }}>
            {children}
        </AuthContext.Provider>
    );
}

