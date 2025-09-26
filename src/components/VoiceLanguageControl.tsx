import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
    lang: string;
    voice: SpeechSynthesisVoice | null;
    onLangChange: (lang: string) => void;
    onVoiceChange: (voice: SpeechSynthesisVoice) => void;
};

const LANG_OPTIONS: { value: string; label: string }[] = [
    { value: "de-DE", label: "آلمانی 🇩🇪" },
    { value: "en-US", label: "انگلیسی 🇺🇸" },
    { value: "fr-FR", label: "فرانسوی 🇫🇷" },
];

export default function VoiceLanguageControl({ lang, voice, onLangChange, onVoiceChange }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const containerRef = useRef<HTMLDivElement | null>(null);

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
        () => voices.filter((v) => v.lang?.toLowerCase().startsWith(lang.toLowerCase())),
        [voices, lang]
    );

    useEffect(() => {
        if (!filteredVoices.length) return;
        const hasSelectedVoice = filteredVoices.some((item) => item.name === voice?.name);
        if (!hasSelectedVoice) {
            onVoiceChange(filteredVoices[0]);
        }
    }, [filteredVoices, voice, onVoiceChange]);

    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (!containerRef.current) return;
            if (!containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEsc);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEsc);
        };
    }, [isOpen]);

    return (
        <div className="settings-control" ref={containerRef}>
            <button
                type="button"
                className="settings-control__trigger"
                onClick={() => setIsOpen((prev) => !prev)}
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                <span aria-hidden="true">🎛️</span>
                تنظیم زبان و صدا
            </button>

            <div
                className={`settings-control__popover ${isOpen ? "is-open" : ""}`}
                role="dialog"
                aria-modal="false"
                aria-label="تنظیمات زبان و صدا"
            >
                <div className="settings-control__section">
                    <span className="settings-control__label">زبان تمرین</span>
                    <select
                        className="settings-control__select"
                        value={lang}
                        onChange={(event) => onLangChange(event.target.value)}
                    >
                        {LANG_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="settings-control__section">
                    <span className="settings-control__label">انتخاب صدا</span>
                    {filteredVoices.length ? (
                        <select
                            className="settings-control__select"
                            value={voice?.name ?? filteredVoices[0]?.name ?? ""}
                            onChange={(event) => {
                                const selected = filteredVoices.find((item) => item.name === event.target.value);
                                if (selected) {
                                    onVoiceChange(selected);
                                }
                            }}
                        >
                            {filteredVoices.map((item) => (
                                <option key={item.name} value={item.name}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <p className="settings-control__empty">هیچ صدایی برای این زبان پیدا نشد.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
