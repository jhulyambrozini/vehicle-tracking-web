"use client";

import { useRef } from "react";
import { useMap } from "../../hooks/use-map";

export function MapDriver() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  useMap(mapContainerRef);

  return <div className="w-2/3 h-full" ref={mapContainerRef} />;
}