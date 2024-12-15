"use server";

import { revalidateTag } from "next/cache";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createRouteAction(state: any, formData: FormData) {
  const { sourceId, destinationId } = Object.fromEntries(formData);

  const directionsResponse = await fetch(
    `http://localhost:3000/directions?originId=${sourceId}&destinationId=${destinationId}`,
    {
      // cache: "force-cache", //default
      // next: {
      //   revalidate: 1 * 60 * 60 * 24, // 1 dia
      // }
    }
  );

  if (!directionsResponse.ok) {
    console.error(await directionsResponse.text());
    return { error: "Ocorreu um erro ao buscar destinos" };
  }

  const directionsData: DirectionData = await directionsResponse.json();


  const startAddress = directionsData.routes[0].legs[0].start_address;
  const endAddress = directionsData.routes[0].legs[0].end_address;

  const response = await fetch("http://localhost:3000/routes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: `${startAddress} - ${endAddress}`,
      source_id: directionsData.request.origin.place_id.replace(
        "place_id:",
        ""
      ),
      destination_id: directionsData.request.destination.place_id.replace(
        "place_id:",
        ""
      ),
    }),
  });

  if (!response.ok) {
    console.error(await response.text());
    return { error: "Ocorreu um erro ao criar rotas" };
  }

  revalidateTag("routes");

  return { success: true };
}

type DirectionData = {
    geocoded_waypoints: GeocodedWayPoint[],
    routes: Route[],
    status: string,
    request: Request
}

type GeocodedWayPoint = {
    geocoder_status: string
    place_id: string,
    types: any[]    
}

type Route = {
    bounds: any[],
    copyrights: string,
    legs: any[],
    overview_polyline: any[],
    summary: string,
    warnings: any[],
    waypoint_order: any[]
}

type Request =  {
    origin: Place,
    destination: Place,
    mode: string
}

type Place = {
    place_id: string,
    location:any[]
}