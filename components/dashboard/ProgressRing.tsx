export function ProgressRing({ percent }: { percent: number }) {
  return (
    <div className="flex aspect-square w-32 items-center justify-center rounded-md border border-white/10 bg-primary shadow-premium sm:w-36">
      <div className="text-center">
        <p className="text-4xl font-black">{percent}%</p>
        <p className="mt-1 text-xs font-bold uppercase text-accent/45">Complete</p>
      </div>
    </div>
  );
}
