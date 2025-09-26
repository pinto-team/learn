import { useCallback } from "react";

type SpeakOptions = {
    lang?: string;   // زبان پیش‌فرض: آلمانی
    rate?: number;   // سرعت
    pitch?: number;  // تن صدا
};

export function useSpeech(defaultLang?: any) {
    const speak = useCallback(
        (text: string, options: SpeakOptions = {}) => {
            if (!text.trim()) return;

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = options.lang || defaultLang;
            utterance.rate = options.rate || 1;
            utterance.pitch = options.pitch || 1;

            // اگر صداهای قبلی در صف بودن، همه رو کنسل می‌کنیم
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(utterance);
        },
        [defaultLang]
    );

    return { speak };
}