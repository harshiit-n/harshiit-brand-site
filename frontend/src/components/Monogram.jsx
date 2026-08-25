// A bold serif monogram with the two letters overlapping, like a crest
// mark rather than handwriting. Reads cleanly at any size, unlike script
// capitals which don't connect the way cursive lowercase does.
export default function Monogram({ className = "", ...rest }) {
  return (
    <svg viewBox="0 0 132 100" className={className} role="img" aria-label="HN monogram" {...rest}>
      <text
        x="0"
        y="82"
        fontFamily="var(--font-serif)"
        fontWeight="700"
        fontSize="92"
        fill="currentColor"
      >
        H
      </text>
      <text
        x="126"
        y="82"
        textAnchor="end"
        fontFamily="var(--font-serif)"
        fontWeight="700"
        fontSize="92"
        fill="currentColor"
        opacity="0.82"
      >
        N
      </text>
    </svg>
  );
}
