import { useRouter, useSegments } from 'expo-router';
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
             signIn: () => setUser('Moldo'),
             signOut: () => setUser(""),
            }}>
            {children}
        </AuthContext.Provider>
    );
}

