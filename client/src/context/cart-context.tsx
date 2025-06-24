"use client";

import React, { createContext, useReducer, useContext, useEffect, ReactNode } from 'react';
import type { Product } from '@/lib/dummy-data';

export type CartItem = {
    product: Product;
    quantity: number;
    selectedSize: string;
};

type CartState = {
    items: CartItem[];
};

type CartAction =
    | { type: 'ADD_ITEM'; payload: CartItem }
    | { type: 'UPDATE_QUANTITY'; payload: { sku: string; size: string; quantity: number } }
    | { type: 'REMOVE_ITEM'; payload: { sku: string; size: string } }
    | { type: 'CLEAR_CART' }
    | { type: 'INITIALIZE_CART'; payload: CartState };

const cartReducer = (state: CartState, action: CartAction): CartState => {
    switch (action.type) {
        case 'ADD_ITEM': {
            const existingItemIndex = state.items.findIndex(
                item => item.product.SKU === action.payload.product.SKU && item.selectedSize === action.payload.selectedSize
            );
            if (existingItemIndex > -1) {
                const updatedItems = [...state.items];
                updatedItems[existingItemIndex].quantity += action.payload.quantity;
                return { ...state, items: updatedItems };
            }
            return { ...state, items: [...state.items, action.payload] };
        }
        case 'UPDATE_QUANTITY': {
            const updatedItems = state.items.map(item =>
                item.product.SKU === action.payload.sku && item.selectedSize === action.payload.size
                    ? { ...item, quantity: Math.max(0, action.payload.quantity) }
                    : item
            ).filter(item => item.quantity > 0);
            return { ...state, items: updatedItems };
        }
        case 'REMOVE_ITEM': {
            const filteredItems = state.items.filter(
                item => !(item.product.SKU === action.payload.sku && item.selectedSize === action.payload.size)
            );
            return { ...state, items: filteredItems };
        }
        case 'CLEAR_CART':
            return { ...state, items: [] };

        case 'INITIALIZE_CART':
            return action.payload;
        
        default:
            return state;
    }
};

const CartContext = createContext<{ state: CartState; dispatch: React.Dispatch<CartAction> } | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(cartReducer, { items: [] });

    useEffect(() => {
        try {
            const storedItems = localStorage.getItem('cartItems');
            if (storedItems) {
                dispatch({ type: 'INITIALIZE_CART', payload: JSON.parse(storedItems) });
            }
        } catch (error) {
            console.error("Failed to parse cart items from localStorage", error);
        }
    }, []);

    useEffect(() => {
        if (state.items.length > 0 || localStorage.getItem('cartItems')) {
            localStorage.setItem('cartItems', JSON.stringify(state));
        }
    }, [state]);

    return (
        <CartContext.Provider value={{ state, dispatch }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};