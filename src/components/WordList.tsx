type Props = {
    words: string[];
};

export default function WordList({ words }: Props) {
    if (words.length === 0) return null;

    return (
        <div style={{ marginTop: "1rem" }}>
            <h3>کلمات تایپ‌شده:</h3>
            <ul>
                {words.map((w, i) => (
                    <li key={i}>{w}</li>
                ))}
            </ul>
        </div>
    );
}
