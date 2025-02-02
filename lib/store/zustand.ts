import { Id } from "@/convex/_generated/dataModel";
import { Client, DraftPurchaseType, ProductType, TableRowType } from "@/types";
import { Row } from "@tanstack/react-table";
import { create } from "zustand";

export interface ProductInfo {
  productId: Id<"product">; // Product ID
  byoseHamwe: number; // Total amount
  aratwaraZingahe: number; // Quantity taken
  yishyuyeAngahe: number; // Amount paid
  productType: string; // Type of product
  ingano: number; // Size/quantity
  ukonyigurishaKuriDetail: number; // Amount left
  igicuruzwa: string; // Product name
  userId: Id<"user">;
  ayomazeGucuruza: number;
}

interface ClientInfo {
  openDrawer: boolean;
  setOpenDrawer: (open: boolean) => void;
  productData: ProductInfo[]; // Array to store product information
  addProduct: (newProduct: ProductInfo) => void; // Add a product to the array
  updateProduct: (id: Id<"product">, updates: Partial<ProductInfo>) => void; // Update a product by ID
  removeProduct: (id: Id<"product">) => void; // Remove a product by ID
  resetProducts: () => void; // Reset the entire product array
  name: string; // Client name
  phone: number; // Client phone number
  factureNumber: number; // Client phone number
  stock: number; // Stock (needs initialization)
  isSubmitting: boolean; // Submission status
  setName: (newName: string) => void; // Set client name
  setPhone: (newPhone: number) => void; // Set client phone
  setFactureNumber: (newPhone: number) => void; // Set client phone
  setReset: () => void; // Reset all client-related fields
  setIsSubmitting: () => void; // Set submission status
  clientData: {
    id: number;
    data: ProductType[] | undefined;
  }[];
  addClientData: (data: ProductType[]) => void;
  resetClientData: () => void;
  draftPurchaseByClient: {
    [key: number]: DraftPurchaseType[]; // Map facture numbers to purchases
  };

  // Add methods for managing draft purchases
  addDraftPurchase: (
    factureNumber: number,
    purchase: DraftPurchaseType[]
  ) => void;
  updateDraftPurchase: (
    factureNumber: number,
    purchaseId: string,
    updates: Partial<DraftPurchaseType>
  ) => void;
  removeDraftPurchase: (factureNumber: number, purchaseId: string) => void;
  resetDraftPurchases: () => void;
}

export const useClientInfoStore = create<ClientInfo>((set) => ({
  productData: [], // Initialize product data as an empty array
  name: "",
  clientData: [],
  factureNumber: 0,
  stock: 0, // Initialize stock as 0
  isSubmitting: false, // Initialize submission status
  phone: 0,
  openDrawer: false,
  setOpenDrawer: (open: boolean) =>
    set(() => ({
      openDrawer: open,
    })),
  // Add a new product to the array
  addProduct: (newProduct: ProductInfo) =>
    set((state) => {
      const exists = state.productData.some(
        (product) => product.productId === newProduct.productId
      );
      if (exists) return state; // Prevent duplicate
      return {
        productData: [...state.productData, newProduct],
      };
    }),

  // Update a specific product by ID
  updateProduct: (id: Id<"product">, updates: Partial<ProductInfo>) =>
    set((state) => {
      const exists = state.productData.some(
        (product) => product.productId === id
      );
      if (!exists) {
        console.warn(`Product with id ${id} not found`);
        return state; // Return unchanged state
      }
      return {
        productData: state.productData.map((product) =>
          product.productId === id ? { ...product, ...updates } : product
        ),
      };
    }),

  // Remove a product from the array by ID
  removeProduct: (id: Id<"product">) =>
    set((state) => ({
      productData: state.productData.filter(
        (product) => product.productId !== id
      ),
    })),

  // Reset the product array
  resetProducts: () =>
    set(() => ({
      productData: [],
    })),

  // Set the client's name
  setName: (newName: string) =>
    set(() => ({
      name: newName,
    })),
  setPhone: (phone: number) =>
    set(() => ({
      phone: phone,
    })),

  // Set the client's phone number
  setFactureNumber: (factureNumber: number) =>
    set(() => ({
      factureNumber: factureNumber,
    })),

  // Reset all client-related fields
  setReset: () =>
    set(() => ({
      productData: [], // Reset product data
      name: "", // Reset client name
      phone: 0, // Reset client phone
      stock: 0, // Reset stock
      isSubmitting: false, // Reset submission status
    })),

  // Set the submission status
  setIsSubmitting: () =>
    set((state) => ({
      isSubmitting: !state.isSubmitting,
    })),

  // Add client data
  addClientData: (data: ProductType[]) =>
    set((state) => {
      if (!data || data.length === 0) return state;

      // For first entry
      if (state.clientData.length === 0) {
        return {
          ...state,
          clientData: [{ id: 1, data }],
        };
      }

      // Get the highest existing ID
      const highestId = Math.max(...state.clientData.map((item) => item.id));

      // Add new entry with incremented id
      return {
        ...state,
        clientData: [
          ...state.clientData,
          {
            id: highestId + 1,
            data,
          },
        ],
      };
    }),
  resetClientData: () =>
    set((state) => ({
      ...state,
      clientData: [],
    })),

  draftPurchaseByClient: {},

  // Add a new draft purchase for a specific client
  addDraftPurchase: (factureNumber: number, purchases: DraftPurchaseType[]) =>
    set((state) => {
      const currentPurchases = state.draftPurchaseByClient[factureNumber] || [];

      // Filter out duplicates based on _id
      const uniquePurchases = purchases.filter(
        (newPurchase) =>
          !currentPurchases.some(
            (existingPurchase) => existingPurchase._id === newPurchase._id
          )
      );

      // Only add if there are new unique purchases
      if (uniquePurchases.length === 0) return state;

      return {
        ...state,
        draftPurchaseByClient: {
          ...state.draftPurchaseByClient,
          [factureNumber]: [...currentPurchases, ...uniquePurchases],
        },
      };
    }),

  // Update an existing draft purchase
  updateDraftPurchase: (
    factureNumber: number,
    purchaseId: string,
    updates: Partial<DraftPurchaseType>
  ) =>
    set((state) => {
      const currentPurchases = state.draftPurchaseByClient[factureNumber] || [];

      return {
        ...state,
        draftPurchaseByClient: {
          ...state.draftPurchaseByClient,
          [factureNumber]: currentPurchases.map((purchase) =>
            purchase._id === purchaseId ? { ...purchase, ...updates } : purchase
          ),
        },
      };
    }),

  // Remove a draft purchase
  removeDraftPurchase: (factureNumber: number, purchaseId: string) =>
    set((state) => {
      const currentPurchases = state.draftPurchaseByClient[factureNumber] || [];

      return {
        ...state,
        draftPurchaseByClient: {
          ...state.draftPurchaseByClient,
          [factureNumber]: currentPurchases.filter(
            (purchase) => purchase._id !== purchaseId
          ),
        },
      };
    }),

  // Reset all draft purchases
  resetDraftPurchases: () =>
    set((state) => ({
      ...state,
      draftPurchaseByClient: {},
    })),
}));

interface BusinessData {
  buzName: string;
  buzPhone: number;
  email: string;
  name: string;
  streetNo: string;
  setBusinessData: (data: Partial<BusinessData>) => void;
  clearBusinessData: () => void;
  clientFacture: Client[] | undefined;
}

const useBusinessStore = create<BusinessData>((set) => ({
  buzName: "",
  buzPhone: 0,
  email: "",
  name: "",
  streetNo: "",
  clientFacture: undefined,
  setBusinessData: (data) =>
    set((state) => ({
      ...state,
      ...data,
    })),
  clearBusinessData: () =>
    set(() => ({
      buzName: "",
      buzPhone: 0,
      email: "",
      streetNo: "",
    })),
}));

export default useBusinessStore;
