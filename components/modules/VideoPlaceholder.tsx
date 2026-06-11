import { Video } from "lucide-react";

export function VideoPlaceholder({
  title,
  videoUrl
}: {
  title: string;
  videoUrl: string;
}) {
  return (
    <div className="rounded-md border border-white/10 bg-black/35 p-4">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-htk-red/30 bg-htk-red/[0.08]">
          <Video className="h-4 w-4 text-htk-red" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-black uppercase text-htk-red">Video demonstration</p>
          <h4 className="mt-1 font-black text-accent">{title}</h4>
          <p className="mt-2 break-all text-xs leading-5 text-htk-muted">{videoUrl}</p>
        </div>
      </div>
    </div>
  );
}
