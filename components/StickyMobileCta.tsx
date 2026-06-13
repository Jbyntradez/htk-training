import { ButtonLink } from "@/components/ui/button";

export function StickyMobileCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-background/95 p-3 backdrop-blur md:hidden">
      <ButtonLink href="/checkout" className="w-full">Join HTK</ButtonLink>
    </div>
  );
}
