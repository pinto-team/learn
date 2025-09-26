import { useEffect, useMemo, useState } from "react";

type Props = {
    lang: string;
    voice: SpeechSynthesisVoice | null;
    onLangChange: (lang: string) => void;
    onVoiceChange: (voice: SpeechSynthesisVoice) => void;
    text: string;
    onTextChange: (text: string) => void;
};

export default function ExerciseConfig({
                                            lang,
                                            voice,
                                            onLangChange,
                                            onVoiceChange,
                                            text,
                                            onTextChange,
                                        }: Props) {
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

    useEffect(() => {
        const synth = window.speechSynthesis;
        const updateVoices = () => setVoices(synth.getVoices());

        updateVoices();
        synth.addEventListener("voiceschanged", updateVoices);

        return () => {
            synth.removeEventListener("voiceschanged", updateVoices);
        };
    }, []);

    const filteredVoices = useMemo(
        () => voices.filter((v) => v.lang.startsWith(lang)),
        [voices, lang]
    );

    useEffect(() => {
        if (!filteredVoices.length) return;
        const alreadySelected = filteredVoices.some((v) => v.name === voice?.name);
        if (!alreadySelected) {
            onVoiceChange(filteredVoices[0]);
        }
    }, [filteredVoices, onVoiceChange, voice]);

    return (
        <section className="card">
            <header className="card__header">
                <h3>تنظیمات تمرین</h3>
                <p>زبان، صدای گوینده و متن تمرین خودت را انتخاب کن.</p>
            </header>

            <div className="form-grid">
                <label className="field">
                    <span className="field__label">زبان</span>
                    <select
                        className="field__control"
                        value={lang}
                        onChange={(e) => onLangChange(e.target.value)}
                    >
                        <option value="de-DE">آلمانی 🇩🇪</option>
                        <option value="en-US">انگلیسی 🇺🇸</option>
                        <option value="fr-FR">فرانسوی 🇫🇷</option>
                    </select>
                </label>

                <label className="field">
                    <span className="field__label">انتخاب صدا</span>
                    <select
                        className="field__control"
                        value={voice?.name || ""}
                        onChange={(e) => {
                            const selected = filteredVoices.find((v) => v.name === e.target.value);
                            if (selected) onVoiceChange(selected);
                        }}
                    >
                        {filteredVoices.map((v) => (
                            <option key={v.name} value={v.name}>
                                {v.name}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            <label className="field">
                <span className="field__label">متن تمرین</span>
                <textarea
                    className="field__control field__control--textarea"
                    value={text}
                    onChange={(e) => onTextChange(e.target.value)}
                    rows={3}
                    placeholder="اینجا جمله یا پاراگراف مورد نظر را بنویس..."
                />
            </label>
        </section>
    );
}
