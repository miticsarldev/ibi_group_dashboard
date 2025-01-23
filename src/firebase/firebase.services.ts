import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  Timestamp,
  orderBy,
} from "firebase/firestore";
import { db } from "./firebase.init";
import { FirestoreQueryOperator } from "./firebase.types";

export const createDocument = async <T extends { id?: string }>(
  collectionName: string,
  data: T
): Promise<string> => {
  try {
    const collectionRef = collection(db, collectionName);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...remainingData } = data;
    const docRef = await addDoc(collectionRef, {
      ...remainingData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error(`Error creating document in ${collectionName}:`, error);
    console.log(error);
    throw new Error(`Failed to create document in ${collectionName}`);
  }
};

export const readDocument = async <T>(
  collectionName: string,
  id: string
): Promise<T | null> => {
  const docRef = doc(db, collectionName, id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as T) : null;
};

export const updateDocument = async <T extends { id: string }>(
  collectionName: string,
  data: T
): Promise<void> => {
  const { id, ...updateData } = data;
  const docRef = doc(db, collectionName, id);
  await updateDoc(docRef, { ...updateData, updatedAt: Timestamp.now() });
};

export const deleteDocument = async (
  collectionName: string,
  id: string
): Promise<void> => {
  const docRef = doc(db, collectionName, id);
  await deleteDoc(docRef);
};

export const listDocuments = async <T>(
  collectionName: string,
  sortBy: { field: string; direction?: "asc" | "desc" } = {
    field: "createdAt",
    direction: "desc",
  }
): Promise<T[]> => {
  const collectionRef = collection(db, collectionName);

  // Add sorting if `sortBy` is provided
  const constraints = sortBy
    ? [orderBy(sortBy.field, sortBy.direction || "asc")]
    : [];

  const q = query(collectionRef, ...constraints);
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as T));
};

export const queryDocuments = async <T>(
  collectionName: string,
  field: string,
  operator: FirestoreQueryOperator,
  value: unknown
): Promise<T[]> => {
  const collectionRef = collection(db, collectionName);
  const q = query(collectionRef, where(field, operator, value));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as T));
};
