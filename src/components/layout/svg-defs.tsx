/** Shared SVG filters for paper edges. Applied to sheets only, never to text. */
export function SvgDefs() {
  return (
    <svg aria-hidden width="0" height="0" style={{ position: "absolute", width: 0, height: 0 }}>
      <defs>
        <filter id="edge-deckle" x="-6%" y="-6%" width="112%" height="112%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.045" numOctaves={4} seed={7} result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={6} xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="edge-torn" x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.028 0.07" numOctaves={5} seed={19} result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={13} xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="edge-rough" x="-3%" y="-3%" width="106%" height="106%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.02 0.05" numOctaves={3} seed={41} result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={3} xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="ink-bleed" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={3} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={1.4} />
        </filter>
      </defs>
    </svg>
  );
}
