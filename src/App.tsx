import { useState } from "react";
import ModeToggle, {type Mode } from "./components/ModeToggle";
import InputBox from "./components/InputBox";
import WordList from "./components/WordList";
import ExerciseConfig from "./components/ExerciseConfig";
import TypingExercise from "./components/TypingExercise";

function App() {
    const [mode, setMode] = useState<Mode>("char");
    const [words, setWords] = useState<string[]>([]);
    const [lang, setLang] = useState("de-DE");
    const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
    const [exerciseMode, setExerciseMode] = useState(false);
    const [exerciseText, setExerciseText] = useState("Hallo wie geht es dir");

    const handleWordComplete = (word: string) => {
        if (word) setWords((prev) => [...prev, word]);
    };

    return (
        <div style={{ maxWidth: "700px", margin: "2rem auto", textAlign: "center" }}>
            <h1>🗣️ یادگیری زبان با تایپ</h1>

            <div style={{ marginBottom: "1rem" }}>
                <label>
                    <input
                        type="checkbox"
                        checked={exerciseMode}
                        onChange={(e) => setExerciseMode(e.target.checked)}
                    />
                    حالت تمرین
                </label>
            </div>

            {exerciseMode ? (
                <>
                    <ExerciseConfig
                        lang={lang}
                        voice={voice}
                        onLangChange={setLang}
                        onVoiceChange={setVoice}
                        text={exerciseText}
                        onTextChange={setExerciseText}
                    />
                    <ModeToggle mode={mode} onChange={setMode} />   {/* 👈 اضافه شد */}
                    <TypingExercise targetText={exerciseText} voice={voice} mode={mode} /> {/* 👈 پاس دادن mode */}
                </>
            ) : (
                <>
                    <ModeToggle mode={mode} onChange={setMode} />
                    <InputBox mode={mode} lang={lang} onWordComplete={handleWordComplete} />
                    <WordList words={words} />
                </>
            )}
        </div>
    );
}

export default App;
