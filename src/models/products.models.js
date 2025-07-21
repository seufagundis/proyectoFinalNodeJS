
import {db} from "../data.js"

import {
    collection,
    getDocs,
    getDoc,
    addDoc,
    deleteDoc,
    doc
} from "firebase/firestore"

export const productsCollectionRef = collection(db,"products")


export const getAllProducts = async () => {
    const querySnapshot = await getDocs(productsCollectionRef)
    const productos = querySnapshot.docs.map((documento)=>({
        id: documento.id,
        ...documento.data()   
    }))

    return productos
}

export const getProductById = async (id) => {
    const productoSnap = await getDoc(doc(db,"products",id))

    if(productoSnap.exists()){
        const producto = {
            id:productoSnap.id,
            ...productoSnap.data()
        }
        return producto
    }else{
        console.log(`Producto id: ${id} no encontrado.`)
        return null
    }

}


export const createProduct = async (data) => {
    const docRef = await addDoc(productsCollectionRef, data)
    const newProduct = {id: docRef.id, ... data}
    return newProduct
}



export const deleteProduct = async (id) => {
    
    const productoSnap = await getDoc(doc(db,"products",id))

    if(!productoSnap.exists()){
        console.log(`Producto id: ${id} no encontrado.`)
        return null
        
    }else{
        const docRef = doc(db,"products",id) 
        const producto = {
            id:productoSnap.id,
            ...productoSnap.data()
        }
        await deleteDoc(docRef)
        return producto
    }

}