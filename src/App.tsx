import { useEffect, useMemo, useState } from "react";
import InputBox from "./components/InputBox";
import WordList from "./components/WordList";
import ExerciseConfig from "./components/ExerciseConfig";
import TypingExercise from "./components/TypingExercise";
import VoiceLanguageControl from "./components/VoiceLanguageControl";
import "./App.css";

function App() {
    const [words, setWords] = useState<string[]>([]);
    const [lang, setLang] = useState("de-DE");
    const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
    const [exerciseMode, setExerciseMode] = useState(false);
    const [exerciseText, setExerciseText] = useState("Hallo, wie geht es dir?");

    const handleWordComplete = (word: string) => {
        if (word) {
            setWords((prev) => [...prev, word]);
        }
    };

    useEffect(() => {
        if (!exerciseMode) return;
        setWords([]);
    }, [exerciseMode]);

    const hintText = useMemo(
        () =>
            exerciseMode
                ? "با تایپ هر کلمه، تلفظ همان کلمه و با اتمام جمله، کل متن برایت خوانده می‌شود."
                : "بعد از کامل کردن هر کلمه با فاصله، تلفظ آن را می‌شنوی و با Enter کل جمله خوانده می‌شود.",
        [exerciseMode]
    );

    return (
        <div className="app-shell">
            <main className={`app-card ${exerciseMode ? "app-card--exercise" : ""}`}>
                <header className="app-header">
                    <h1>🗣️ یادگیری زبان با تایپ</h1>
                    <p>{hintText}</p>
                </header>

                <div className="settings-row">
                    <VoiceLanguageControl
                        lang={lang}
                        voice={voice}
                        onLangChange={setLang}
                        onVoiceChange={setVoice}
                    />
                </div>

                <div className="mode-switcher" role="group" aria-label="انتخاب حالت تمرین">
                    <span className={`mode-switcher__label ${!exerciseMode ? "is-active" : ""}`}>
                        تمرین آزاد
                    </span>
                    <label className="switch">
                        <input
                            type="checkbox"
                            checked={exerciseMode}
                            onChange={(e) => setExerciseMode(e.target.checked)}
                        />
                        <span className="switch__slider" aria-hidden="true" />
                    </label>
                    <span className={`mode-switcher__label ${exerciseMode ? "is-active" : ""}`}>
                        تمرین متنی
                    </span>
                </div>

                {exerciseMode ? (
                    <div className="exercise-layout">
                        <div className="exercise-layout__main">
                            <TypingExercise targetText={exerciseText} voice={voice} />
                        </div>
                        <aside className="exercise-layout__sidebar" aria-label="تنظیمات متن تمرین">
                            <ExerciseConfig text={exerciseText} onTextChange={setExerciseText} />
                        </aside>
                    </div>
                ) : (
                    <section className="card">
                        <header className="card__header">
                            <h3>تایپ کن تا بشنوی</h3>
                            <p>هر کلمه را کامل تایپ کن تا بلافاصله تلفظ آن را بشنوی.</p>
                        </header>
                        <InputBox voice={voice} onWordComplete={handleWordComplete} />
                    </section>
                )}

                {!exerciseMode && <WordList words={words} />}
            </main>
        </div>
    );
}

export default App;
