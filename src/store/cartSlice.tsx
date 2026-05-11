import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: {} as Record<string, any>,
    totalAmount: 0,
    totalItems: 0
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const addedProduct = action.payload;
            const finalPrice = addedProduct.price;

            if (state.items[addedProduct.id]) {
                state.items[addedProduct.id].quantity += 1;
                state.items[addedProduct.id].sum += finalPrice;
            } else {
                state.items[addedProduct.id] = {
                    ...addedProduct,
                    quantity: 1,
                    finalPrice: finalPrice,
                    sum: finalPrice
                };
            }
            
            state.totalAmount += finalPrice;
            state.totalItems += 1;
        },

        removeFromCart: (state, action) => {
            const productId = action.payload.id;
            const selectedCartItem = state.items[productId];

            if (!selectedCartItem) return; 

            if (selectedCartItem.quantity > 1) {
                selectedCartItem.quantity -= 1;
                selectedCartItem.sum -= selectedCartItem.finalPrice;
            } else {
                delete state.items[productId];
            }

            state.totalAmount -= selectedCartItem.finalPrice;
            state.totalItems -= 1;
        },

        emptyCart: () => {
            return initialState;
        }
    }
});

export const { addToCart, removeFromCart, emptyCart } = cartSlice.actions;

export default cartSlice.reducer;