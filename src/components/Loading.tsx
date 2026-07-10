import { Aperture } from 'lucide-react';

export function Loading() {
  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Aperture className="w-12 h-12 text-amber-500 animate-pulse" />
        <p className="text-neutral-400 text-sm tracking-widest uppercase">Chargement</p>
      </div>
    </div>
  );
}
