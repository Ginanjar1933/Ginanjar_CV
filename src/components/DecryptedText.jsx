import { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&@<>/';
const random = () => CHARS[Math.floor(Math.random() * CHARS.length)];

const scramble = (text, fixed) =>
  text
    .split('')
    .map((c, i) => (c === ' ' || i < fixed ? c : random()))
    .join('');

export default function DecryptedText({ text, style, duration = 1400 }) {
  const reduced = useReducedMotion();
  const [out, setOut] = useState(reduced ? text : scramble(text, 0));

  useEffect(() => {
    if (reduced) {
      setOut(text);
      return undefined;
    }
    const start = Date.now();
    const id = setInterval(() => {
      const progress = Math.min(1, (Date.now() - start) / duration);
      setOut(scramble(text, Math.floor(progress * text.length)));
      if (progress >= 1) clearInterval(id);
    }, 50);
    return () => clearInterval(id);
  }, [text, duration, reduced]);

  return (
    <Text style={style} accessibilityLabel={text}>
      {out}
    </Text>
  );
}