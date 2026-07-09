/**
 * The fixed dot-grid field behind the whole story: wine dots on the warm-white
 * brand background, masked to fade out toward the edges. Colors come from the
 * `dot-grid` utility in globals.css so they track the brand tokens.
 */
export default function BackgroundDots() {
  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10 bg-background">
      <div className="dot-grid absolute inset-0" />
    </div>
  );
}
