import * as Product from "../models/products.models.js"


export const getAllProducts = async () => {
    const productos = await Product.getAllProducts()
    return productos
}

export const getProductById = async (id) => {
    const producto = await Product.getProductById(id)
    if(!id){}
    return producto
}

export const createProduct = async (data) => {
    if (!data?.name || !data?.price) {
        throw new Error("Faltan campos obligatorios")
    } else {
        const producto = await Product.createProduct(data)
        return producto
    }
}

export const deleteProduct = async (id) => {
    const productoEliminado = await Product.deleteProduct(id)
    return productoEliminado
}