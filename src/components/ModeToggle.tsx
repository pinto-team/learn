export type Mode = "char" | "word";

type Props = {
    mode: Mode;
    onChange: (mode: Mode) => void;
};

export default function ModeToggle({ mode, onChange }: Props) {
    return (
        <div style={{ marginBottom: "1rem" }}>
            <label>
                <input
                    type="radio"
                    name="mode"
                    value="char"
                    checked={mode === "char"}
                    onChange={() => onChange("char")}
                />
                حرف‌به‌حرف
            </label>

            <label style={{ marginLeft: "1rem" }}>
                <input
                    type="radio"
                    name="mode"
                    value="word"
                    checked={mode === "word"}
                    onChange={() => onChange("word")}
                />
                کلمه‌ای
            </label>
        </div>
    );
}
