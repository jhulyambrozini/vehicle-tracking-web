"use client";

import { useRef } from "react";
import { useMap } from "../../hooks/use-map";

export function AdminPage() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  useMap(mapContainerRef);

  return <div className="h-full w-full" ref={mapContainerRef} />;
}

export default AdminPage;