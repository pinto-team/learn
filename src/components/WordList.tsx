type Props = {
    words: string[];
};

export default function WordList({ words }: Props) {
    if (words.length === 0) return null;

    return (
        <section className="card word-list">
            <header className="card__header">
                <h3>کلمات خوانده‌شده</h3>
                <p>آرشیوی از واژه‌هایی که سیستم برایت تلفظ کرده است.</p>
            </header>
            <div className="word-list__chips">
                {words.map((word, index) => (
                    <span key={`${word}-${index}`} className="word-chip">
                        {word}
                    </span>
                ))}
            </div>
        </section>
    );
}
