import { Button, View, Text } from "react-native";

export default function HomeScreen({ navigation }: any) {
    return (
      <View>
        <Text>Home Screen</Text>
        <Button
          title="Ke Profile"
          onPress={() => navigation.navigate('Profile')}
        />
        <Button
          title="Ke Details"
          onPress={() => navigation.navigate('Details')}
        />
        <Button
          title="Ke Login"
          onPress={() => navigation.navigate('Login')}
        />
        <Button
          title="Ke Product"
          onPress={() => navigation.navigate('Product', { item: { id: 1, name: 'Product 1', price: 100 } })}
        />
      </View>
    );
  }