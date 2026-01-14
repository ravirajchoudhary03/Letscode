"use client";

import { useState, useEffect } from "react";

interface TextScramblerProps {
  text: string;
  duration?: number;
}

export function TextScrambler({ text, duration = 1000 }: TextScramblerProps) {
  const [displayText, setDisplayText] = useState(text);
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";

  useEffect(() => {
    let frame = 0;
    const totalFrames = 20;
    const interval = duration / totalFrames;

    const timer = setInterval(() => {
      frame++;
      if (frame >= totalFrames) {
        setDisplayText(text);
        clearInterval(timer);
        return;
      }

      const scrambled = text
        .split("")
        .map((char, i) => {
          if (char === " ") return " ";
          if (i < (frame / totalFrames) * text.length) return text[i];
          return characters[Math.floor(Math.random() * characters.length)];
        })
        .join("");

      setDisplayText(scrambled);
    }, interval);

    return () => clearInterval(timer);
  }, [text, duration]);

  return <span>{displayText}</span>;
}
