'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { translateText } from '@/lib/i18n';

export default function T({ text, as: As = 'span', className = '', children }) {
  const content = text ?? (typeof children === 'string' ? children : '');
  const { lang } = useLanguage();
  const [val, setVal] = React.useState(content);

  React.useEffect(() => {
    let alive = true;
    (async () => {
      const out = await translateText(content, lang);
      if (alive) setVal(out);
    })();
    return () => { alive = false; };
  }, [content, lang]);

  return <As className={className}>{val}</As>;
}

