import { db } from "../data.js"

import { collection, getDocs, getDoc, addDoc, deleteDoc, doc } from "firebase/firestore"

const userCollectionRef = collection(db,"users")