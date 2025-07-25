# proyectoFinalNodeJS

API REST construida con Node.js, Express y Firebase Firestore para gestión de productos y autenticación de usuarios.


DOCUMENTACIÓN TÉCNICA DETALLADA - API REST

1. CAPA DE RUTAS
Define los endpoints disponibles y su estructura. Cada ruta especifica:

Método HTTP (GET, POST, etc.)

Path o URL

Middlewares aplicables

Controlador que lo manejará

Ejemplo completo de products.routes.js:

const router = Router()

// Obtener todos los productos (acceso público)
router.get("/products", productsController.getAllProducts)

// Obtener producto por ID (acceso público)
router.get("/products/:id", productsController.getProductById)

// Crear nuevo producto (requiere autenticación)
router.post("/products/create", auth, productsController.createProduct)

// Eliminar producto (requiere autenticación)
router.delete("/products/:id", auth, productsController.deleteProduct)

export default router



2. CAPA DE CONTROLADORES
Recibe las peticiones HTTP y gestiona las respuestas. Se encarga de:

Recibir los parámetros de la petición (body, params, query)

Invocar los servicios correspondientes

Manejar los errores

Enviar las respuestas HTTP adecuadas

Ejemplo detallado de products.controller.js:


export const getAllProducts = async (req, res) => {
    try {
        // Llamada al servicio para obtener productos
        const productos = await productsServices.getAllProducts()
        
        // Respuesta exitosa con código 200
        res.status(200).json(productos)
    } catch (error) {
        // Captura de errores
        console.error(error)
        res.status(500).json({ 
            message: "Error al obtener los productos",
            error: error.message 
        })
    }
}

export const createProduct = async (req, res) => {
    try {
        // Validación básica del body
        if(!req.body) {
            return res.status(400).json({ message: "Datos del producto requeridos" })
        }

        // Llamada al servicio para creación
        const nuevoProducto = await productsServices.createProduct(req.body)
        
        // Respuesta exitosa con código 201 (creado)
        res.status(201).json({
            message: "Producto creado exitosamente",
            data: nuevoProducto
        })
    } catch (error) {
        // Manejo de errores específicos
        if(error.message.includes("Faltan campos obligatorios")) {
            return res.status(400).json({ message: error.message })
        }
        
        // Error genérico
        res.status(500).json({ 
            message: "Error al crear el producto",
            error: error.message 
        })
    }
}



3. CAPA DE SERVICIOS
Contiene la lógica de negocio principal:

Validaciones de datos

Transformaciones

Llamadas a los modelos

Reglas de negocio

Ejemplo extendido de products.services.js:

text
import * as Product from "../models/products.models.js"

export const getAllProducts = async () => {
    try {
        // Obtener todos los productos del modelo
        const productos = await Product.getAllProducts()
        
        // Validar si hay productos
        if(!productos || productos.length === 0) {
            throw new Error("No se encontraron productos")
        }
        
        // Transformación opcional de datos
        return productos.map(producto => ({
            ...producto,
            price: `$${producto.price.toFixed(2)}`
        }))
    } catch (error) {
        console.error("Error en servicio getAllProducts:", error)
        throw error // Propaga el error al controlador
    }
}

export const createProduct = async (productData) => {
    try {
        // Validación de campos requeridos
        if (!productData?.name || !productData?.price) {
            throw new Error("Los campos 'name' y 'price' son obligatorios")
        }

        // Validación de tipo de datos
        if(typeof productData.price !== 'number' || productData.price <= 0) {
            throw new Error("El precio debe ser un número positivo")
        }

        // Crear objeto con datos adicionales
        const productToCreate = {
            ...productData,
            createdAt: new Date(),
            status: 'active'
        }

        // Llamada al modelo para creación
        return await Product.createProduct(productToCreate)
    } catch (error) {
        console.error("Error en servicio createProduct:", error)
        throw error
    }
}



4. CAPA DE MODELOS
Interactúa directamente con la base de datos (Firestore):

Operaciones CRUD

Consultas específicas

Manejo de conexiones

Ejemplo completo de products.models.js:

text
import { db } from "../data.js"
import { 
    collection, 
    getDocs, 
    getDoc, 
    addDoc, 
    deleteDoc, 
    doc,
    serverTimestamp 
} from "firebase/firestore"



// Referencia a la colección de productos
const productsCollectionRef = collection(db, "products")

export const getAllProducts = async () => {
    try {
        const querySnapshot = await getDocs(productsCollectionRef)
        
        if(querySnapshot.empty) {
            return []
        }

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            // Conversión de Firestore Timestamp a fecha legible
            createdAt: doc.data().createdAt?.toDate() || null
        }))
    } catch (error) {
        console.error("Error en modelo getAllProducts:", error)
        throw error
    }
}

export const createProduct = async (productData) => {
    try {
        const docRef = await addDoc(productsCollectionRef, {
            ...productData,
            createdAt: serverTimestamp() // Usa timestamp del servidor
        })
        
        const newProduct = {
            id: docRef.id,
            ...productData,
            createdAt: new Date() // Fecha local para respuesta
        }
        
        return newProduct
    } catch (error) {
        console.error("Error en modelo createProduct:", error)
        throw error
    }
}
5. MIDDLEWARE DE AUTENTICACIÓN
Implementa la seguridad JWT:

text
import jwt from "jsonwebtoken"

export const auth = (req, res, next) => {
    try {
        // Obtener token del header Authorization
        const authHeader = req.headers['authorization']
        
        if(!authHeader) {
            return res.status(401).json({ 
                message: "Token de autorización requerido" 
            })
        }

        // Formato esperado: "Bearer <token>"
        const token = authHeader.split(' ')[1]
        
        if(!token) {
            return res.status(401).json({ 
                message: "Formato de token inválido. Use 'Bearer <token>'" 
            })
        }

        // Verificar token
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if(err) {
                console.error("Error de verificación JWT:", err)
                return res.status(403).json({ 
                    message: "Token inválido o expirado" 
                })
            }
            
            // Añadir información del usuario al request
            req.user = decoded
            next()
        })
    } catch (error) {
        console.error("Error en middleware auth:", error)
        return res.status(500).json({ 
            message: "Error interno en autenticación" 
        })
    }
}


CONFIGURACIÓN DE FIREBASE (data.js)


const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
}

// Inicializar Firebase
const app = initializeApp(firebaseConfig)

// Obtener instancia de Firestore
const db = getFirestore(app)

export { db }



EJEMPLO DE .env

text
PORT=3001
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-bucket.appspot.com
FIREBASE_MESSAGING_SENDER_ID=1234567890
FIREBASE_APP_ID=1:1234567890:web:abcdef123456
JWT_SECRET=your_super_secret_key_32chars_min