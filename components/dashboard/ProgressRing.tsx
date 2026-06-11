export function ProgressRing({ percent, label = "Complete" }: { percent: number; label?: string }) {
  const clamped = Math.max(0, Math.min(100, percent));

  return (
    <div className="w-36 rounded-md border border-white/10 bg-primary p-4 shadow-premium">
      <div
        className="grid aspect-square place-items-center rounded-full p-2"
        role="img"
        aria-label={`${clamped}% ${label.toLowerCase()}`}
        style={{
          background: `conic-gradient(#e11d2e ${clamped * 3.6}deg, rgba(255,255,255,0.1) 0deg)`
        }}
      >
        <div className="grid h-full w-full place-items-center rounded-full border border-white/10 bg-[#070707] text-center">
          <div>
            <p className="text-4xl font-black">{clamped}%</p>
            <p className="mt-1 text-xs font-bold uppercase text-accent/45">{label}</p>
          </div>
        </div>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10" aria-hidden="true">
        <div className="h-full rounded-full bg-htk-red" style={{ width: `${clamped}%` }} />
      </div>
    </div>
  );
}
