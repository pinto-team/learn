import React, { useEffect, useMemo, useState } from "react";
import { useSpeech } from "../hooks/useSpeech";

type Props = {
    targetText: string;
    voice: SpeechSynthesisVoice | null;
};

export default function TypingExercise({ targetText, voice }: Props) {
    const [input, setInput] = useState("");
    const [lastSpokenIndex, setLastSpokenIndex] = useState(-1);
    const [hasSpokenSentence, setHasSpokenSentence] = useState(false);
    const { speak } = useSpeech(voice);

    const targetWords = useMemo(
        () =>
            targetText
                .trim()
                .split(/\s+/)
                .filter(Boolean),
        [targetText]
    );

    useEffect(() => {
        setInput("");
        setLastSpokenIndex(-1);
        setHasSpokenSentence(false);
    }, [targetText]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value.length > targetText.length + 10) return;

        setInput(value);

        const inputWords = value.trim().split(/\s+/);
        const currentWordIndex = inputWords.length - 1;
        const currentInputWord = inputWords[currentWordIndex] || "";
        const expectedWord = targetWords[currentWordIndex] || "";

        const isWordComplete =
            currentInputWord.length > 0 &&
            currentInputWord.localeCompare(expectedWord, undefined, { sensitivity: "base" }) === 0;

        if (isWordComplete && currentWordIndex > lastSpokenIndex) {
            setLastSpokenIndex(currentWordIndex);
            setTimeout(() => speak(expectedWord), 200);
        }

        const isSentenceComplete =
            value.trim().localeCompare(targetText.trim(), undefined, { sensitivity: "base" }) === 0;

        if (isSentenceComplete && !hasSpokenSentence) {
            setHasSpokenSentence(true);
            setTimeout(() => speak(targetText), 250);
        } else if (!isSentenceComplete && hasSpokenSentence) {
            setHasSpokenSentence(false);
        }
    };

    const characters = useMemo(() => {
        return targetText.split("").map((char, index) => {
            let state: "pending" | "correct" | "incorrect" = "pending";

            if (index < input.length) {
                state =
                    char.localeCompare(input[index] ?? "", undefined, { sensitivity: "base" }) === 0
                        ? "correct"
                        : "incorrect";
            }

            return (
                <span key={`${char}-${index}`} className={`exercise-input__char exercise-input__char--${state}`}>
                    {char === " " ? "\u00A0" : char}
                </span>
            );
        });
    }, [input, targetText]);

    return (
        <section className="card typing-card">
            <header className="card__header">
                <h3>تمرین تایپ هوشمند</h3>
                <p>هر کلمه را کامل و صحیح تایپ کن تا سیستم آن را با صدای طبیعی برایت بخواند.</p>
            </header>

            <div className="exercise-input" aria-live="polite">
                <div className="exercise-input__overlay" aria-hidden="true">
                    {targetText ? (
                        characters
                    ) : (
                        <span className="exercise-input__placeholder">متن تمرین را اینجا تایپ کن...</span>
                    )}
                </div>

                <input
                    type="text"
                    className="input-box exercise-input__field"
                    value={input}
                    onChange={handleChange}
                    placeholder=""
                    autoComplete="off"
                    aria-label="محل تایپ متن تمرینی"
                    spellCheck={false}
                />
            </div>

            {hasSpokenSentence && (
                <p className="exercise-success">🎉 عالی! کل جمله را بدون خطا تایپ کردی.</p>
            )}
        </section>
    );
}
