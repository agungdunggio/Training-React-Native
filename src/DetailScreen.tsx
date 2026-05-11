import { Button, View } from "react-native";


export default function DetailsScreen({ route, navigation }: any) {
    return (
      <View style={{flex:1}}>
        <Button
          title="Kembali"
          onPress={() => navigation.goBack()}
        />
        <Button
          title="Ke Lost Of Style"
          onPress={() => navigation.navigate('LostOfStyle')}
        />
      </View>
    );
  }
  