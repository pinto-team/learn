import React, { useState } from "react";
import { useSpeech } from "../hooks/useSpeech";

type Props = {
    targetText: string;
    voice: SpeechSynthesisVoice | null;
    mode: "char" | "word"; // 👈 حالت تمرین
};

export default function TypingExercise({ targetText, voice, mode }: Props) {
    const [input, setInput] = useState("");
    const { speak } = useSpeech(voice);

    const targetWords = targetText.split(" "); // متن تمرینی به کلمات

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (val.length <= targetText.length) {
            setInput(val);

            const inputWords = val.split(" ");
            const currentWordIndex = inputWords.length - 1; // کلمه فعلی
            const currentInputWord = inputWords[currentWordIndex] || "";
            const expectedWord = targetWords[currentWordIndex] || "";

            if (
                currentInputWord.length > 0 &&
                expectedWord.toLowerCase().startsWith(currentInputWord.toLowerCase())
            ) {
                if (mode === "char") {
                    // حالت هجّی: بخش فعلی رو بخون
                    if (currentInputWord.length < expectedWord.length) {
                        let partToSpeak =
                            currentInputWord.length === 1
                                ? expectedWord.slice(0, 2) // اگه فقط یه حرف تایپ شده → دو حرف اول
                                : expectedWord.slice(0, currentInputWord.length);
                        speak(partToSpeak);
                    }

                    // وقتی کل کلمه کامل شد
                    if (
                        currentInputWord.length === expectedWord.length &&
                        currentInputWord.toLowerCase() === expectedWord.toLowerCase()
                    ) {
                        setTimeout(() => speak(expectedWord), 300);
                    }
                }

                if (mode === "word") {
                    // فقط وقتی کل کلمه کامل شد
                    if (
                        currentInputWord.length === expectedWord.length &&
                        currentInputWord.toLowerCase() === expectedWord.toLowerCase()
                    ) {
                        setTimeout(() => speak(expectedWord), 300);
                    }
                }
            }
        }
    };

    // رنگ‌بندی متن
    const colored = targetText.split("").map((c, i) => {
        if (i < input.length) {
            return (
                <span
                    key={i}
                    style={{
                        color:
                            c.toLowerCase() === input[i]?.toLowerCase() ? "green" : "red",
                    }}
                >
          {c}
        </span>
            );
        }
        return (
            <span key={i} style={{ opacity: 0.3 }}>
        {c}
      </span>
        );
    });

    return (
        <div style={{ marginTop: "2rem" }}>
            <h3>تمرین تایپ</h3>
            <p style={{ fontSize: "1.2rem", lineHeight: "2rem" }}>{colored}</p>

            <input
                type="text"
                value={input}
                onChange={handleChange}
                placeholder="شروع به تایپ کن..."
                style={{
                    width: "100%",
                    padding: "0.5rem",
                    fontSize: "1.1rem",
                    marginTop: "1rem",
                }}
            />

            {input.toLowerCase() === targetText.toLowerCase() && (
                <p style={{ color: "blue", marginTop: "1rem" }}>
                    ✅ کل متن تمرین کامل شد!
                </p>
            )}
        </div>
    );
}
