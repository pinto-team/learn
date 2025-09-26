type Props = {
    lang: string;
    onChange: (lang: string) => void;
};

export default function LanguageSelect({ lang, onChange }: Props) {
    return (
        <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="lang">زبان: </label>
            <select
                id="lang"
                value={lang}
                onChange={(e) => onChange(e.target.value)}
                style={{ padding: "0.3rem", fontSize: "1rem" }}
            >
                <option value="de-DE">آلمانی 🇩🇪</option>
                <option value="en-US">انگلیسی 🇬🇧</option>
            </select>
        </div>
    );
}
