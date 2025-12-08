import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { 
  getAuth, 
  onAuthStateChanged, 
  signInAnonymously 
} from "firebase/auth";

export default function ProtectedRoute({ children }) {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        // Auto login user anonymously
        const anon = await signInAnonymously(auth);
        setUser(anon.user);
      } else {
        setUser(currentUser);
      }

      setChecking(false);
    });

    return () => unsubscribe();
  }, []);

  // Wait until Firebase finishes creating or fetching the user
  if (checking) {
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        Authenticating...
      </div>
    );
  }

  // No redirect — anonymous login handles guests
  return children;
}
