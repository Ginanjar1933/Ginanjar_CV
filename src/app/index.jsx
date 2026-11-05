import { View, Text, Image } from 'react-native';

export default function Index() {
  return (
    <View>
      <Image
        source={require('../../assets/profile.jpg')}
        style={{ width: 150, height: 150 }}
      />
      <Text>Ginanjar Saepulloh</Text>
      <Text>242505026</Text>
    </View>
  );
}