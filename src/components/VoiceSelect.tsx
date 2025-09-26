import { useEffect, useState } from "react";

type Props = {
    voice: SpeechSynthesisVoice | null;
    onChange: (voice: SpeechSynthesisVoice) => void;
};

export default function VoiceSelect({ voice, onChange }: Props) {
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

    useEffect(() => {
        const updateVoices = () => {
            const v = speechSynthesis.getVoices();
            setVoices(v);
        };

        // بعضی مرورگرها async لود می‌کنن
        speechSynthesis.onvoiceschanged = updateVoices;
        updateVoices();
    }, []);

    return (
        <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="voice">انتخاب صدا: </label>
            <select
                id="voice"
                value={voice ? voice.name : ""}
                onChange={(e) => {
                    const selected = voices.find((v) => v.name === e.target.value);
                    if (selected) onChange(selected);
                }}
                style={{ padding: "0.3rem", fontSize: "1rem", minWidth: "250px" }}
            >
                {voices.map((v, i) => (
                    <option key={i} value={v.name}>
                        {v.lang} - {v.name}
                    </option>
                ))}
            </select>
        </div>
    );
}
