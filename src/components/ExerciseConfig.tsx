import { useEffect, useState } from "react";

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
        const updateVoices = () => {
            setVoices(speechSynthesis.getVoices());
        };
        speechSynthesis.onvoiceschanged = updateVoices;
        updateVoices();
    }, []);

    const filteredVoices = voices.filter((v) => v.lang.startsWith(lang));

    return (
        <div style={{ marginBottom: "1rem", textAlign: "left" }}>
            {/* انتخاب زبان */}
            <div style={{ marginBottom: "0.5rem" }}>
                <label>زبان: </label>
                <select
                    value={lang}
                    onChange={(e) => onLangChange(e.target.value)}
                    style={{ padding: "0.3rem", marginLeft: "0.5rem" }}
                >
                    <option value="de-DE">آلمانی 🇩🇪</option>
                    <option value="en-US">انگلیسی 🇬🇧</option>
                    <option value="fr-FR">فرانسوی 🇫🇷</option>
                </select>
            </div>

            {/* انتخاب صدا */}
            <div style={{ marginBottom: "0.5rem" }}>
                <label>صدا: </label>
                <select
                    value={voice?.name || ""}
                    onChange={(e) => {
                        const selected = filteredVoices.find((v) => v.name === e.target.value);
                        if (selected) onVoiceChange(selected);
                    }}
                    style={{ padding: "0.3rem", marginLeft: "0.5rem", minWidth: "220px" }}
                >
                    {filteredVoices.map((v, i) => (
                        <option key={i} value={v.name}>
                            {v.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* متن تمرینی */}
            <div>
                <label>متن تمرین: </label>
                <textarea
                    value={text}
                    onChange={(e) => onTextChange(e.target.value)}
                    rows={3}
                    style={{ width: "100%", padding: "0.5rem", marginTop: "0.3rem" }}
                    placeholder="اینجا متن تمرین رو بنویس..."
                />
            </div>
        </div>
    );
}
