import React, { useMemo, useState } from "react";
import { useSpeech } from "../hooks/useSpeech";

type Props = {
    voice: SpeechSynthesisVoice | null;
    onWordComplete?: (word: string) => void;
};

export default function InputBox({ voice, onWordComplete }: Props) {
    const [text, setText] = useState("");
    const { speak } = useSpeech(voice);

    const typedWords = useMemo(
        () =>
            text
                .split(/\s+/)
                .map((word) => word.trim())
                .filter(Boolean),
        [text]
    );

    const speakWord = (word: string) => {
        if (!word) return;
        speak(word);
        onWordComplete?.(word);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const trimmed = value.trimEnd();

        if (value.endsWith(" ") && trimmed.length > text.trimEnd().length) {
            const completedWord = trimmed.split(/\s+/).pop();
            if (completedWord) {
                speakWord(completedWord);
            }
        }

        setText(value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const sentence = text.trim();
            if (sentence) {
                speak(sentence);
                const lastWord = typedWords[typedWords.length - 1];
                if (lastWord) {
                    onWordComplete?.(lastWord);
                }
            }
            setText("");
        }
    };

    return (
        <input
            type="text"
            className="input-box"
            placeholder="اینجا تایپ کن و با فاصله کلمات رو کامل کن..."
            value={text}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
        />
    );
}
