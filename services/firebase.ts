
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail, 
  signOut,
  onAuthStateChanged,
  User
} from "firebase/auth";
import { Product } from '../types';

const firebaseConfig = {
  apiKey: "AIzaSyBVBVF3dUyUMNjcMiT5BwaXNB9eJITSciI",
  authDomain: "quickshop-b1145.firebaseapp.com",
  databaseURL: "https://quickshop-b1145-default-rtdb.firebaseio.com",
  projectId: "quickshop-b1145",
  storageBucket: "quickshop-b1145.firebasestorage.app",
  messagingSenderId: "784520356167",
  appId: "1:784520356167:web:24dfe7f3b46670b6e7ac62"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const PRODUCTS_COLLECTION = "products";

export const firebaseService = {
  // Firestore Operations
  getProducts: async (): Promise<Product[]> => {
    try {
      const q = query(collection(db, PRODUCTS_COLLECTION), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
    } catch (e) {
      console.error("Error fetching products: ", e);
      const data = localStorage.getItem('quick_shop_products');
      return data ? JSON.parse(data) : [];
    }
  },

  saveProduct: async (product: Omit<Product, 'id'>): Promise<void> => {
    try {
      await addDoc(collection(db, PRODUCTS_COLLECTION), {
        ...product,
        createdAt: Date.now()
      });
    } catch (e) {
      console.error("Error adding product: ", e);
      const products = JSON.parse(localStorage.getItem('quick_shop_products') || '[]');
      localStorage.setItem('quick_shop_products', JSON.stringify([{...product, id: Date.now().toString()}, ...products]));
    }
  },

  deleteProduct: async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, PRODUCTS_COLLECTION, id));
    } catch (e) {
      console.error("Error deleting product: ", e);
      const products = JSON.parse(localStorage.getItem('quick_shop_products') || '[]');
      localStorage.setItem('quick_shop_products', JSON.stringify(products.filter((p: any) => p.id !== id)));
    }
  },

  // Auth Operations
  login: (email: string, pass: string) => signInWithEmailAndPassword(auth, email, pass),
  signup: (email: string, pass: string) => createUserWithEmailAndPassword(auth, email, pass),
  resetPassword: (email: string) => sendPasswordResetEmail(auth, email),
  logout: () => signOut(auth),
  onAuthStateUpdate: (callback: (user: User | null) => void) => onAuthStateChanged(auth, callback)
};
