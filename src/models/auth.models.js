import { db } from "../data.js"

import { collection, getDocs, query, where } from "firebase/firestore"

const usersCollectionRef = collection(db,"users")

export const login = async (email)=> {
    const q = query(usersCollectionRef, where("email", "==", email))
    const snapshot = await getDocs(q)
    console.log(snapshot.docs[0].data())
    
    if (snapshot.empty) {
      return console.log({ error: "Credenciales inválidas" });
    }

    const user = snapshot.docs[0].data();

    return user
}

