"use client";

import { Dumbbell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { equipmentOptions, type EquipmentOption } from "@/lib/training-builder-data";
import { cn } from "@/lib/utils";

export function EquipmentSelector({
  selectedEquipment,
  onToggle,
  options = equipmentOptions,
  stepLabel = "Step 2"
}: {
  selectedEquipment: EquipmentOption[];
  onToggle: (equipment: EquipmentOption) => void;
  options?: readonly EquipmentOption[];
  stepLabel?: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <Dumbbell className="h-5 w-5 text-accent/55" />
        <div>
          <p className="text-xs font-black uppercase text-accent/45">{stepLabel}</p>
          <h2 className="text-2xl font-black">Choose Equipment</h2>
        </div>
      </div>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-accent/60">
        Select everything available for this session. Choose No Equipment when the workout should stay field-ready and
        tool-free.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {options.map((equipment) => {
          const isSelected = selectedEquipment.includes(equipment);

          return (
            <button
              key={equipment}
              type="button"
              onClick={() => onToggle(equipment)}
              className={cn(
                "rounded-md border p-4 text-left transition hover:border-accent/50 hover:bg-white/[0.03]",
                isSelected ? "border-accent/80 bg-accent/[0.08]" : "border-white/10 bg-background"
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-black">{equipment}</span>
                {isSelected ? <Badge>Selected</Badge> : null}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
