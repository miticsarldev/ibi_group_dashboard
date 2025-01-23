import { useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { type User as UserType } from "@/types";
import { auth, db } from "@/firebase/firebase.init";
import { doc, getDoc, setDoc, Timestamp, updateDoc } from "firebase/firestore";

export const useFirebase = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          const docRef = doc(db, "users", user?.uid);
          const docSnap = await getDoc(docRef);
          setUser(docSnap.exists() ? (docSnap.data() as UserType) : null);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error in onAuthStateChanged:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (
    email: string,
    password: string,
    userData: Omit<UserType, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const newUser: UserType = {
        id: user.uid,
        ...userData,
        createdAt: Timestamp.fromDate(new Date()),
        updatedAt: Timestamp.fromDate(new Date()),
        isActive: true,
      };

      await setDoc(doc(db, "users", user.uid), newUser);

      return user.uid;
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error("Unable to create user. Please try again.");
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateDoc(doc(db, "users", userCredential.user.uid), {
        lastLogin: Timestamp.fromDate(new Date()),
      });
      return userCredential.user;
    } catch (error) {
      console.error("Error signing in:", error);
      throw new Error("Invalid email or password.");
    }
  };

  const logOut = () => {
    return signOut(auth);
  };

  return { user, loading, signUp, signIn, logOut };
};
