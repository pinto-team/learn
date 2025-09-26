import React, { useState } from "react";
import type {Mode} from "./ModeToggle";
import { useSpeech } from "../hooks/useSpeech";

type Props = {
    mode: Mode;
    lang: string;
    onWordComplete?: (word: string) => void;
};


export default function InputBox({ mode, onWordComplete}: Props) {
    const [text, setText] = useState("");
    const [bufferWord, setBufferWord] = useState("");
    const { speak } = useSpeech(null); // voice از App پاس داده میشه


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        const lastChar = val.slice(-1);

        setText(val);

        if (mode === "char") {
            if (lastChar && lastChar !== " ") {
                speak(lastChar); // حرف‌به‌حرف
                setBufferWord(bufferWord + lastChar);
            }
            if (lastChar === " ") {
                if (bufferWord.trim()) {
                    speak(bufferWord.trim()); // کل کلمه
                    if (onWordComplete) onWordComplete(bufferWord.trim());
                }
                setBufferWord("");
            }
        }
    };

    const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
        if (mode === "word") {
            const input = e.nativeEvent as InputEvent;

            if (input.inputType === "insertText" && input.data === " ") {
                const val = (e.target as HTMLInputElement).value.trim();
                const words = val.split(" ");
                const lastWord = words[words.length - 1];

                if (lastWord) {
                    speak(lastWord);
                    if (onWordComplete) onWordComplete(lastWord);
                }
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            const trimmed = text.trim();
            if (trimmed) {
                // آخرین کلمه/متن تایپ‌شده رو بخونه
                speak(trimmed);
                if (onWordComplete) onWordComplete(trimmed);
            }
            setText("");      // اینپوت خالی بشه
            setBufferWord(""); // بافر هم خالی بشه
        }
    };

    return (
        <input
            type="text"
            placeholder="اینجا تایپ کن..."
            value={text}
            onChange={handleChange}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            style={{ width: "100%", padding: "0.5rem", fontSize: "1.2rem" }}
        />
    );
}
