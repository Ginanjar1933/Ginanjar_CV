import { View, Text, Image } from 'react-native';

export default function Index() {
  return (
    <View>
      <Text accessibilityRole="header">Profil Saya</Text>

      <Image
        source={require('../../assets/profile.jpg')}
        style={{ width: 150, height: 150 }}
        accessibilityLabel="Foto profil Ginanjar Saepulloh"
      />

      <Text>Ginanjar Saepulloh</Text>
      <Text>NIM: 242505026</Text>

      <Text>Mahasiswa Sistem Informasi & Developer</Text>
      <Text>
        Mahasiswa Sistem Informasi Universitas Ma'soem yang tertarik pada
        pengembangan aplikasi web dan mobile.
      </Text>
    </View>
  );
}