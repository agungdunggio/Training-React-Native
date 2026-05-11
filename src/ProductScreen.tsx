import React from 'react';
import { Button, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from './store';
import { addToCart } from './store/cartSlice'; 
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from './App';

interface ProductItem {
    id: string;
    title: string;
    price: number;
}

type Props = StackScreenProps<RootStackParamList, 'Product'>;

const ProductScreen = ({ route }: Props) => {
    const dispatch = useDispatch<AppDispatch>();
    const item: ProductItem | undefined = route.params?.item;

    const totalItems = useSelector((state: RootState) => state.cart.totalItems);

    return (
        <View style={{ padding: 20 }}>
            <Text>Nama Barang: {item?.title ?? 'Belum ada item dipilih'}</Text>
            <Text>Total di Keranjang: {totalItems}</Text>
            
            <Button 
                title="Tambah ke Keranjang" 
                onPress={() => item && dispatch(addToCart(item))}
                disabled={!item}
            />
        </View>
    );
};

export default ProductScreen;