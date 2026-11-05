import Screen from '../../components/Screen';
import ProfileHeader from '../../components/ProfileHeader';
import ProfileSummary from '../../components/ProfileSummary';
import profileData from '../../../data/profileData';

export default function Home() {
  return (
    <Screen title="Profil Saya">
      <ProfileHeader data={profileData} />
      <ProfileSummary data={profileData} />
    </Screen>
  );
}