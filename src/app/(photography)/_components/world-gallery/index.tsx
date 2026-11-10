"use client";

import "maplibre-gl/dist/maplibre-gl.css";

import { ArrowLeftIcon } from "lucide-react";
import { useReducedMotion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Supercluster from "supercluster";

import Lightbox from "@/app/(photography)/_components/lightbox";
import { buttonVariants } from "@/app/_components/ui/button";
import { Photo } from "@/domain/photography/services/photos/types";
import { cn } from "@/lib/tailwind";

import type { Map as MaplibreMap, Marker as MaplibreMarker } from "maplibre-gl";
import type { Route } from "next";

const MAP_STYLE = "https://tiles.openfreemap.org/styles/fiord";
const WORLD_BBOX: [number, number, number, number] = [-180, -85, 180, 85];
const CLUSTER_MAX_ZOOM = 14;
const MAP_MAX_ZOOM = 16;
const DECLUSTER_ZOOM_BUFFER = 1.1;
const FOCUS_BASE_ZOOM = 12;
const FIT_BOUNDS_MAX_ZOOM = 12;

type PointProps = { photoIndex: number };

type OpenState = {
  index: number;
  origin: DOMRect;
};

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

const computeDeclusterZoom = (
  index: Supercluster<PointProps>,
  coordinates: { longitude: number; latitude: number },
  locatedIndex: number,
  fromZoom: number,
) => {
  const epsilon = 0.001;
  const bbox: [number, number, number, number] = [
    coordinates.longitude - epsilon,
    coordinates.latitude - epsilon,
    coordinates.longitude + epsilon,
    coordinates.latitude + epsilon,
  ];

  const startZoom = Math.floor(fromZoom);
  const withBuffer = (zoom: number) =>
    Math.min(MAP_MAX_ZOOM, zoom * DECLUSTER_ZOOM_BUFFER);

  for (let zoom = startZoom; zoom <= CLUSTER_MAX_ZOOM; zoom++) {
    const isIndividual = index.getClusters(bbox, zoom).some((feature) => {
      const props = feature.properties;
      if ("cluster" in props && props.cluster) {
        return false;
      }
      return (props as PointProps).photoIndex === locatedIndex;
    });

    if (isIndividual) {
      return zoom <= startZoom
        ? fromZoom
        : Math.max(fromZoom, withBuffer(zoom));
    }

    if (zoom === CLUSTER_MAX_ZOOM) {
      return Math.max(fromZoom, withBuffer(CLUSTER_MAX_ZOOM));
    }
  }

  return fromZoom;
};

const fillWithPhoto = (
  container: HTMLElement,
  photo: Photo,
  { blur = false }: { blur?: boolean } = {},
) => {
  if (photo.placeholderUrl) {
    const placeholder = document.createElement("img");
    placeholder.src = photo.placeholderUrl;
    placeholder.alt = "";
    placeholder.ariaHidden = "true";
    placeholder.draggable = false;
    placeholder.className = cn(
      "absolute inset-0 size-full object-cover",
      blur && "blur-[2px]",
    );
    container.appendChild(placeholder);
  }

  const thumbnail = document.createElement("img");
  thumbnail.src = photo.thumbnailSrc;
  thumbnail.alt = "";
  thumbnail.draggable = false;
  thumbnail.className = cn(
    "absolute inset-0 size-full object-cover opacity-0",
    "transition-opacity duration-300 ease-out motion-reduce:transition-none",
    blur && "blur-[2px]",
  );
  thumbnail.addEventListener("load", () => {
    thumbnail.classList.remove("opacity-0");
  });
  container.appendChild(thumbnail);
};

const createPhotoMarker = (photo: Photo, onOpen: (origin: DOMRect) => void) => {
  const button = document.createElement("button");
  button.type = "button";
  button.dataset.photoId = photo.id;
  button.setAttribute("aria-label", "Ouvrir la photo");
  button.className = cn(
    "group relative block size-12 cursor-pointer hover:z-10 sm:size-14",
  );

  const inner = document.createElement("div");
  inner.className = cn(
    "relative size-full overflow-hidden rounded-full bg-background shadow-lg",
    "ring-2 ring-white/90 dark:ring-white/60",
    "transition-transform duration-200 group-hover:scale-110 motion-reduce:transition-none",
  );
  fillWithPhoto(inner, photo);
  button.appendChild(inner);

  button.addEventListener("click", () => {
    onOpen(button.getBoundingClientRect());
  });

  return button;
};

const createClusterMarker = (
  count: number,
  representative: Photo,
  onExpand: () => void,
) => {
  const button = document.createElement("button");
  button.type = "button";
  button.setAttribute("aria-label", `${count} photos — agrandir`);
  button.className = cn(
    "group relative block size-12 cursor-pointer hover:z-10 sm:size-14",
  );

  const inner = document.createElement("div");
  inner.className = cn(
    "relative size-full overflow-hidden rounded-full bg-background shadow-lg",
    "ring-2 ring-white/90 dark:ring-white/60",
    "transition-transform duration-200 group-hover:scale-105 motion-reduce:transition-none",
  );
  fillWithPhoto(inner, representative, { blur: true });
  button.appendChild(inner);

  const scrim = document.createElement("div");
  scrim.className = cn(
    "absolute inset-0 flex items-center justify-center bg-black/40",
  );
  const label = document.createElement("span");
  label.textContent = `+${count}`;
  label.className = cn(
    "text-sm font-bold tabular-nums text-white drop-shadow-md sm:text-base",
  );
  scrim.appendChild(label);
  inner.appendChild(scrim);

  button.addEventListener("click", onExpand);

  return button;
};

interface WorldGalleryProps {
  photos: Photo[];
  backPath: string;
  focusPhotoShortId?: string;
  enableFitBoundsIntro?: boolean;
}

const WorldGallery = ({
  photos,
  backPath,
  focusPhotoShortId,
  enableFitBoundsIntro = false,
}: WorldGalleryProps) => {
  const reduce = useReducedMotion();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MaplibreMap | null>(null);
  const markersRef = useRef<MaplibreMarker[]>([]);
  const clusterIndexRef = useRef<Supercluster<PointProps> | null>(null);

  const [open, setOpen] = useState<OpenState | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const located = photos.filter(
      (photo) => photo.metadata.locationCoordinates,
    );

    let cancelled = false;
    let map: MaplibreMap | null = null;

    void (async () => {
      const maplibregl = (await import("maplibre-gl")).default;
      if (cancelled || !containerRef.current) {
        return;
      }

      const points = located.flatMap((photo, photoIndex) => {
        const coordinates = photo.metadata.locationCoordinates;
        if (!coordinates) {
          return [];
        }

        return [
          {
            type: "Feature" as const,
            properties: { photoIndex },
            geometry: {
              type: "Point" as const,
              coordinates: [coordinates.longitude, coordinates.latitude] as [
                number,
                number,
              ],
            },
          },
        ];
      });

      const index = new Supercluster<PointProps>({
        radius: 60,
        maxZoom: CLUSTER_MAX_ZOOM,
      }).load(points);
      clusterIndexRef.current = index;

      const focusPhoto = focusPhotoShortId
        ? located.find((photo) => photo.shortId === focusPhotoShortId)
        : undefined;

      let center: [number, number] = [5, 25];
      let zoom = 1.4;
      if (focusPhoto?.metadata.locationCoordinates) {
        const coordinates = focusPhoto.metadata.locationCoordinates;
        const locatedIndex = located.findIndex(
          (photo) => photo.id === focusPhoto.id,
        );
        center = [coordinates.longitude, coordinates.latitude];
        zoom = computeDeclusterZoom(
          index,
          coordinates,
          locatedIndex,
          FOCUS_BASE_ZOOM,
        );
      }

      map = new maplibregl.Map({
        container,
        style: MAP_STYLE,
        center,
        zoom,
        minZoom: 0.8,
        maxZoom: MAP_MAX_ZOOM,
        attributionControl: { compact: true },
        dragRotate: false,
        pitchWithRotate: false,
      });
      mapRef.current = map;

      map.touchZoomRotate.disableRotation();
      map.touchPitch.disable();
      map.keyboard.disable();

      map.addControl(
        new maplibregl.NavigationControl({ showCompass: false }),
        "bottom-right",
      );

      map.on("style.load", () => {
        map?.setProjection({ type: "globe" });
      });

      map.on("styleimagemissing", (event) => {
        if (map && !map.hasImage(event.id)) {
          map.addImage(event.id, {
            width: 1,
            height: 1,
            data: new Uint8Array(4),
          });
        }
      });

      const fitBoundsToAll = () => {
        if (!map || focusPhoto || !enableFitBoundsIntro) {
          return;
        }

        let minLng = Infinity;
        let minLat = Infinity;
        let maxLng = -Infinity;
        let maxLat = -Infinity;
        for (const photo of located) {
          const coordinates = photo.metadata.locationCoordinates;
          if (!coordinates) {
            continue;
          }
          minLng = Math.min(minLng, coordinates.longitude);
          maxLng = Math.max(maxLng, coordinates.longitude);
          minLat = Math.min(minLat, coordinates.latitude);
          maxLat = Math.max(maxLat, coordinates.latitude);
        }

        if (!Number.isFinite(minLng)) {
          return;
        }

        map.fitBounds(
          [
            [minLng, minLat],
            [maxLng, maxLat],
          ],
          {
            padding: 80,
            maxZoom: FIT_BOUNDS_MAX_ZOOM,
            duration: reduce ? 0 : 900,
            easing: easeOutCubic,
          },
        );
      };

      const render = () => {
        if (!map) {
          return;
        }

        markersRef.current.forEach((marker) => marker.remove());
        markersRef.current = [];

        const clusters = index.getClusters(
          WORLD_BBOX,
          Math.floor(map.getZoom()),
        );

        for (const feature of clusters) {
          const [lng, lat] = feature.geometry.coordinates as [number, number];
          const props = feature.properties;

          if ("cluster" in props && props.cluster) {
            const clusterId = props.cluster_id;
            const count = props.point_count;
            const leaf = index.getLeaves(clusterId, 1).at(0);
            const representative = leaf
              ? located[leaf.properties.photoIndex]
              : undefined;
            if (!representative) {
              continue;
            }

            const element = createClusterMarker(count, representative, () => {
              if (!map) {
                return;
              }

              const leaves = index.getLeaves(clusterId, Infinity);
              let minLng = Infinity;
              let minLat = Infinity;
              let maxLng = -Infinity;
              let maxLat = -Infinity;
              for (const leaf of leaves) {
                const [leafLng, leafLat] = leaf.geometry.coordinates as [
                  number,
                  number,
                ];
                minLng = Math.min(minLng, leafLng);
                maxLng = Math.max(maxLng, leafLng);
                minLat = Math.min(minLat, leafLat);
                maxLat = Math.max(maxLat, leafLat);
              }

              map.fitBounds(
                [
                  [minLng, minLat],
                  [maxLng, maxLat],
                ],
                {
                  padding: 80,
                  maxZoom: 15,
                  duration: reduce ? 0 : 700,
                  easing: easeInOutCubic,
                },
              );
            });

            const marker = new maplibregl.Marker({ element })
              .setLngLat([lng, lat])
              .addTo(map);
            markersRef.current.push(marker);
          } else {
            const photo = located[props.photoIndex];
            if (!photo) {
              continue;
            }

            const element = createPhotoMarker(photo, (origin) => {
              setOpen({
                index: photos.findIndex((p) => p.id === photo.id),
                origin,
              });
            });

            const marker = new maplibregl.Marker({ element })
              .setLngLat([lng, lat])
              .addTo(map);
            markersRef.current.push(marker);
          }
        }
      };

      map.on("load", () => {
        render();
        fitBoundsToAll();
      });
      map.on("moveend", render);
    })();

    return () => {
      cancelled = true;
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      clusterIndexRef.current = null;
      mapRef.current = null;
      map?.remove();
    };
  }, [photos, focusPhotoShortId, enableFitBoundsIntro, reduce]);

  useEffect(() => {
    if (open === null) {
      return;
    }

    const activePhoto = photos[open.index];
    const coordinates = activePhoto?.metadata.locationCoordinates;
    const map = mapRef.current;
    if (!coordinates || !map) {
      return;
    }

    const currentZoom = map.getZoom();
    const clusterIndex = clusterIndexRef.current;

    const locatedIndex = photos
      .filter((photo) => photo.metadata.locationCoordinates)
      .findIndex((photo) => photo.id === activePhoto.id);

    const targetZoom = clusterIndex
      ? computeDeclusterZoom(
          clusterIndex,
          coordinates,
          locatedIndex,
          currentZoom,
        )
      : currentZoom;

    map.easeTo({
      center: [coordinates.longitude, coordinates.latitude],
      zoom: targetZoom,
      duration: reduce ? 0 : 500,
      easing: easeInOutCubic,
    });
  }, [open?.index, open, photos, reduce]);

  const openPhoto = open ? photos[open.index] : undefined;

  return (
    <div className="fixed inset-0 touch-none overscroll-none bg-background">
      <div ref={containerRef} className="size-full" />

      <Link
        href={backPath as Route}
        aria-label="Retour"
        className={cn(
          buttonVariants({ variant: "blur", size: "icon-lg" }),
          "absolute top-4 left-4 z-10",
        )}
      >
        <ArrowLeftIcon className="size-6" />
      </Link>

      {open !== null && openPhoto ? (
        <Lightbox
          photos={photos}
          index={open.index}
          photo={openPhoto}
          origin={open.origin}
          onClose={() => setOpen(null)}
          roundTargetOnClose
          onNavigate={(index) =>
            setOpen((current) => (current ? { ...current, index } : current))
          }
        />
      ) : null}
    </div>
  );
};

export default WorldGallery;
