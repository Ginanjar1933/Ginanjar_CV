import { useEffect, useState } from 'react';
import { Text, Platform } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';

const MONO = Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' });

export default function TypeText({ phrases, style, speed = 70, pause = 1400 }) {
  const reduced = useReducedMotion();
  const key = phrases.join('|');
  const [text, setText] = useState(reduced ? phrases[0] : '');
  const [cursor, setCursor] = useState(true);

  useEffect(() => {
    if (reduced) return undefined;
    let word = 0;
    let len = 0;
    let deleting = false;
    let timer;

    const tick = () => {
      const current = phrases[word];
      if (!deleting) {
        len += 1;
        setText(current.slice(0, len));
        if (len === current.length) {
          deleting = true;
          timer = setTimeout(tick, pause);
          return;
        }
      } else {
        len -= 1;
        setText(current.slice(0, len));
        if (len === 0) {
          deleting = false;
          word = (word + 1) % phrases.length;
        }
      }
      timer = setTimeout(tick, deleting ? speed / 2 : speed);
    };

    timer = setTimeout(tick, speed);
    return () => clearTimeout(timer);
  }, [key, speed, pause, reduced]);

  useEffect(() => {
    if (reduced) return undefined;
    const id = setInterval(() => setCursor((c) => !c), 500);
    return () => clearInterval(id);
  }, [reduced]);

  return (
    <Text
      style={[{ fontFamily: MONO }, style]}
      accessibilityLabel={phrases.join(', ')}
    >
      {text}
      {reduced ? '' : cursor ? '▌' : ' '}
    </Text>
  );
}