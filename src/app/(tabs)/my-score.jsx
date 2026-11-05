import Screen from '../../components/Screen';
import MyScoreSection from '../../components/MyScoreSection';
import scoreData from '../../../data/score.json';

export default function MyScore() {
  return (
    <Screen title="My Score">
      <MyScoreSection data={scoreData} />
    </Screen>
  );
}