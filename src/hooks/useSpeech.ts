import { useCallback } from "react";

type SpeakOptions = {
    lang?: string;
    rate?: number;
    pitch?: number;
    voice?: SpeechSynthesisVoice | null;
};

export function useSpeech(defaultVoice?: SpeechSynthesisVoice | null) {
    const speak = useCallback(
        (text: string, options: SpeakOptions = {}) => {
            if (!text.trim()) return;

            const utterance = new SpeechSynthesisUtterance(text);
            const resolvedVoice = options.voice ?? defaultVoice ?? null;

            if (resolvedVoice) {
                utterance.voice = resolvedVoice;
                utterance.lang = resolvedVoice.lang;
            }

            utterance.lang = options.lang || utterance.lang || "de-DE";
            utterance.rate = options.rate || 1;
            utterance.pitch = options.pitch || 1;

            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(utterance);
        },
        [defaultVoice]
    );

    return { speak };
}
