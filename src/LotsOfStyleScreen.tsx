import { Button, StyleSheet, View } from "react-native";
import { Text } from "react-native";

export default function LotsOfStyleScreen({ route, navigation }: any) {
    return (
      <View style={styles.container}>
        <Text style={styles.red}>just red</Text>
        <Text style={styles.bigBlue}>just blue</Text>
        <Text style={[styles.bigBlue, styles.red]}>bigBlue, then red</Text>
        <Text style={[styles.red, styles.bigBlue]}>red, then bigBlue</Text>
        <Button
          title="Ke Home"
          onPress={() => navigation.goBack()}
        />
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      marginTop: 10,
    },
    red: {
      color: 'red',
    },
    bigBlue: {
      color: 'blue',
      fontWeight: 'bold',
      fontSize: 30,
    },
  });   