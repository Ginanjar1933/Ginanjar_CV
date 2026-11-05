import { useMemo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../components/Screen';
import Reveal from '../../components/Reveal';
import SectionHeader from '../../components/SectionHeader';
import HeroIntro from '../../components/HeroIntro';
import LanyardCard from '../../components/LanyardCard';
import ProfileSummary from '../../components/ProfileSummary';
import ExperienceSection from '../../components/ExperienceSection';
import SkillMarquee from '../../components/SkillMarquee';
import SkillItem from '../../components/SkillItem';
import ProjectCard from '../../components/ProjectCard';
import ScoreCard from '../../components/ScoreCard';
import { useTheme } from '../../hooks/useTheme';
import { spacing, radius, typography } from '../../constants/theme';
import profileData from '../../../data/profileData';
import experienceData from '../../../data/experience.json';
import skillsData from '../../../data/skills.json';
import projectsData from '../../../data/projects.json';
import scoreData from '../../../data/score.json';

export default function Home() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <Screen title="Profil Saya">
      <Reveal index={0}>
        <HeroIntro data={profileData} />
      </Reveal>

      <Reveal index={1}>
        <LanyardCard data={profileData} />
      </Reveal>

      <Reveal index={2}>
        <ProfileSummary data={profileData} />
      </Reveal>

      <Reveal index={3}>
        <View style={styles.block}>
          <SectionHeader
            title="Pendidikan"
            onPress={() => router.navigate('/about')}
          />
          <ExperienceSection items={experienceData.slice(0, 2)} />
        </View>
      </Reveal>

      <Reveal index={4}>
        <View style={styles.block}>
          <SectionHeader
            title="Keterampilan"
            onPress={() => router.navigate('/skills')}
          />
          <SkillMarquee skills={skillsData} />
          <View style={styles.card}>
            {skillsData.slice(0, 3).map((skill) => (
              <SkillItem key={skill.id} skill={skill} />
            ))}
          </View>
        </View>
      </Reveal>

      <Reveal index={5}>
        <View style={styles.block}>
          <SectionHeader
            title="Portofolio"
            onPress={() => router.navigate('/portfolio')}
          />
          <View style={styles.card}>
            {projectsData.slice(0, 2).map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </View>
        </View>
      </Reveal>

      <Reveal index={6}>
        <View style={styles.block}>
          <SectionHeader
            title="My Score"
            onPress={() => router.navigate('/my-score')}
          />
          <View style={styles.card}>
            <ScoreCard
              nilai={scoreData.currentScore.nilai}
              grade={scoreData.currentScore.grade}
              totalLP={scoreData.learningPoints.total}
            />
          </View>
        </View>
      </Reveal>

      <Reveal index={7}>
        <Pressable
          onPress={() => router.navigate('/contact')}
          style={styles.cta}
          accessibilityRole="button"
          accessibilityLabel="Hubungi saya"
        >
          <Ionicons name="mail" size={28} color={colors.background} />
          <View style={styles.ctaText}>
            <Text style={styles.ctaTitle}>Mari berkolaborasi</Text>
            <Text style={styles.ctaSub}>Kirim pesan lewat formulir kontak</Text>
          </View>
          <Ionicons name="arrow-forward" size={22} color={colors.background} />
        </Pressable>
      </Reveal>
    </Screen>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    block: { gap: spacing.sm },
    card: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.md,
      gap: spacing.md,
    },
    cta: {
      minHeight: 72,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      backgroundColor: colors.primary,
      borderRadius: radius.lg,
      padding: spacing.lg,
    },
    ctaText: { flex: 1 },
    ctaTitle: {
      fontSize: typography.heading,
      fontWeight: '800',
      color: colors.background,
    },
    ctaSub: {
      fontSize: typography.small,
      color: colors.background,
    },
  });