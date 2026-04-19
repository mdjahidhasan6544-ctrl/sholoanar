export default function SectionTitle({ eyebrow, title, body }) {
  return (
    <div className="max-w-3xl px-5 md:px-8">
      {eyebrow ? (
        <p className="mb-4 text-xs uppercase tracking-[0.42em] text-bronze">{eyebrow}</p>
      ) : null}
      <h2 className="font-display text-5xl leading-[0.95] text-white md:text-7xl">{title}</h2>
      {body ? <p className="mt-5 max-w-2xl text-sm leading-7 text-stone-300 md:text-base">{body}</p> : null}
    </div>
  );
}
