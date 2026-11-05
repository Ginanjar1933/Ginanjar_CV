import Screen from '../../components/Screen';
import AboutSection from '../../components/AboutSection';
import ExperienceSection from '../../components/ExperienceSection';
import profileData from '../../../data/profileData';
import experienceData from '../../../data/experience.json';

export default function About() {
  return (
    <Screen title="Tentang Saya">
      <AboutSection data={profileData} />
      <ExperienceSection items={experienceData} />
    </Screen>
  );
}