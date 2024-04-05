import { FIREBASE_AUTH } from "@/constants/firebaseConfig";
import { showFailToast, showSuccesToast } from "@/constants/toasts";
import { User } from "@/Models/userModel";
import userApiService from "@/services/userApiService";
import { useRouter, useSegments } from "expo-router";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import * as React from "react";
import Toast from "react-native-toast-message";

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
  const [userData, setUserData] = React.useState<User | undefined>(); // [1
  const auth = FIREBASE_AUTH;

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser && currentUser.emailVerified) {
        setUser(currentUser.uid);
        try {
          const token = await FIREBASE_AUTH.currentUser?.getIdToken();
          const res = await userApiService.getUser(token as string);
          if (res) {
            setUserData(res);
          }
        } catch (e) {
          console.log(e);
        }
      } else {
        setUser("");
      }
    });

    return () => unsubscribe();
  }, []);

  React.useEffect(() => {
    if( rootSegment[0] === "(booking)" && !userData?.isValidated) {
        router.replace("/(app)");
    }
    if (user === undefined) {
      return;
    }
    if (!user && rootSegment[0] !== "(auth)") {
      router.replace("/(auth)/login");
    } else if (user && rootSegment[0] === "(auth)") {
      router.replace("/");
    }

  }, [user, rootSegment]);

  return (
    <AuthContext.Provider
      value={{
        user: user,
        userData: userData,
        signIn: async (email: string, password: string) => {
          try {
            const res = await signInWithEmailAndPassword(auth, email, password);
            if (res.user.emailVerified) {
              setUser(res.user.uid);
              showSuccesToast("Welcome back!");
            } else {
              showFailToast("Please verify your email");
              await auth.signOut();
            }
          } catch (e: any) {
            const message = e as FirebaseError;
            showFailToast(message.message);
          }
        },
        signOut: async () => {
          try {
            const res = await auth.signOut();
            console.log(res);
          } catch (e) {
            console.log(e);
          }
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
