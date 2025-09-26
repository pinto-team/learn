import type { ChangeEvent } from "react";

type Props = {
    text: string;
    onTextChange: (text: string) => void;
};

export default function ExerciseConfig({ text, onTextChange }: Props) {
    const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        onTextChange(event.target.value);
    };

    return (
        <section className="card">
            <header className="card__header">
                <h3>متن تمرین</h3>
                <p>جمله یا پاراگراف موردنظر را بنویس تا همان متن را در تمرین تایپ کنی.</p>
            </header>

            <label className="field">
                <span className="field__label">متن تمرین</span>
                <textarea
                    className="field__control field__control--textarea"
                    value={text}
                    onChange={handleChange}
                    rows={3}
                    placeholder="اینجا جمله یا پاراگراف مورد نظر را بنویس..."
                />
                <span className="field__hint">از دکمه بالا برای تغییر زبان و صدای گوینده استفاده کن.</span>
            </label>
        </section>
    );
}
