"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";

export function PropertyGallery({ images, title }: { images: string[]; title: string }) {
  const [activeImage, setActiveImage] = useState(images[0]);

  useEffect(() => {
    setActiveImage(images[0]);
  }, [images]);

  return (
    <div className="space-y-4">
      <div className="glass-panel relative aspect-[16/11] overflow-hidden sm:aspect-[16/10]">
        <Image
          src={activeImage}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 100vw, 60vw"
          quality={78}
          priority
        />
      </div>
      <div className="grid grid-flow-col auto-cols-[minmax(5.5rem,1fr)] gap-3 overflow-x-auto pb-1 sm:grid-flow-row sm:grid-cols-3 sm:overflow-visible sm:pb-0">
        {images.map((image) => (
          <button
            key={image}
            type="button"
            onClick={() => setActiveImage(image)}
            className={cn(
              "glass-panel relative aspect-[4/3] min-w-0 overflow-hidden border transition-all duration-300",
              activeImage === image ? "border-primary shadow-soft" : "border-transparent"
            )}
          >
            <Image src={image} alt={title} fill className="object-cover" sizes="(max-width: 768px) 30vw, 18vw" quality={64} />
          </button>
        ))}
      </div>
    </div>
  );
}
