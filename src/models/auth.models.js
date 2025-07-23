import { db } from "../data.js"

import { collection, getDocs, query, where } from "firebase/firestore"

const usersCollectionRef = collection(db, "users")

export const login = async (email) => {
  const q = query(usersCollectionRef, where("email", "==", email))
  const snapshot = await getDocs(q)

  if (snapshot.empty) {
    throw new Error("Usuario no encontrado")
  }

  const user = snapshot.docs[0].data();

  return user
}

