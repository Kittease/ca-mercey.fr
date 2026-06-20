"use client";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  Loader2Icon,
  XIcon,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
  useAnimate,
  useMotionValue,
  useReducedMotion,
} from "motion/react";
import {
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import Badge from "@/app/_components/ui/badge";
import { Button } from "@/app/_components/ui/button";
import ProgressiveImage from "@/app/_components/ui/progressive-image";
import { Photo } from "@/domain/photography/services/photos/types";
import { cn } from "@/lib/tailwind";
import { useMediaQuery } from "@/lib/tailwind/hooks";

import MetadataPanel from "./metadata-panel";

const EASE_OUT: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

const LightboxImage = ({ photo }: { photo: Photo }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <ProgressiveImage
        placeholder={photo.placeholderUrl}
        src={photo.thumbnailSrc}
        draggable={false}
        className="object-contain"
      />

      <img
        src={photo.src}
        alt=""
        draggable={false}
        onLoad={() => setLoaded(true)}
        className={cn(
          "absolute inset-0 size-full object-contain transition-opacity duration-300",
          loaded ? "opacity-100" : "opacity-0",
        )}
      />

      {!loaded ? (
        <Badge variant="secondary" className="absolute bottom-3 left-3">
          <Loader2Icon data-icon="inline-start" className="animate-spin" />
          Chargement…
        </Badge>
      ) : null}
    </>
  );
};

const fitToViewport = (width: number, height: number) => {
  if (typeof window === "undefined") {
    return { width: 0, height: 0 };
  }

  const maxWidth = window.innerWidth * 0.92;
  const maxHeight = window.innerHeight * 0.9;
  const ratio = width / height;

  if (maxWidth / ratio <= maxHeight) {
    return { width: maxWidth, height: maxWidth / ratio };
  }

  return { width: maxHeight * ratio, height: maxHeight };
};

interface LightboxProps {
  photos: Photo[];
  index: number;
  photo: Photo;
  origin: DOMRect;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

const Lightbox = ({
  photos,
  index,
  photo,
  origin,
  onClose,
  onNavigate,
}: LightboxProps) => {
  const canHover = useMediaQuery("(hover: hover)");
  const reduce = useReducedMotion();

  const morph = useMemo(
    () =>
      reduce
        ? { duration: 0 }
        : { type: "spring" as const, duration: 0.35, bounce: 0.1 },
    [reduce],
  );
  const crossfade = useMemo(
    () => ({ duration: reduce ? 0 : 0.18, ease: EASE_OUT }),
    [reduce],
  );
  const dismissTransition = useMemo(
    () => ({ duration: reduce ? 0 : 0.3, ease: EASE_OUT }),
    [reduce],
  );

  const [showMetadata, setShowMetadata] = useState(false);

  const [hoverEdge, setHoverEdge] = useState<"left" | "right" | null>(null);

  const onPointerMove = (event: ReactPointerEvent) => {
    if (!canHover) {
      return;
    }

    const ratio = event.clientX / window.innerWidth;
    const edge = ratio < 0.25 ? "left" : ratio > 0.75 ? "right" : null;

    setHoverEdge((current) => (current === edge ? current : edge));
  };

  const size = useMemo(
    () => fitToViewport(photo.width, photo.height),
    [photo.width, photo.height],
  );

  const [scope, animate] = useAnimate();
  const stageRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<HTMLDivElement | null>(null);

  const lockedAxis = useRef<"x" | "y" | null>(null);

  const bgOpacity = useMotionValue(0);
  const contentScale = useMotionValue(1);

  const setStageRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      stageRef.current = node;
    }
  }, []);

  const setDragRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      dragRef.current = node;
    }
  }, []);

  const hasPrev = index > 0;
  const hasNext = index < photos.length - 1;

  const goPrev = useCallback(() => {
    if (index > 0) {
      onNavigate(index - 1);
    }
  }, [index, onNavigate]);

  const goNext = useCallback(() => {
    if (index < photos.length - 1) {
      onNavigate(index + 1);
    }
  }, [index, photos.length, onNavigate]);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) {
      return;
    }

    const target = stage.getBoundingClientRect();
    const scale = origin.width / target.width;
    const x = origin.left + origin.width / 2 - (target.left + target.width / 2);
    const y = origin.top + origin.height / 2 - (target.top + target.height / 2);

    void animate(stage, { x: [x, 0], y: [y, 0], scale: [scale, 1] }, morph);
    void animate(bgOpacity, 1, morph);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const close = useCallback(() => {
    const stage = stageRef.current;
    const gridEl = document.querySelector(`[data-photo-id="${photo.id}"]`);

    if (!stage || !gridEl) {
      onClose();

      return;
    }

    const target = stage.getBoundingClientRect();
    const dest = gridEl.getBoundingClientRect();
    const scale = dest.width / target.width;
    const x = dest.left + dest.width / 2 - (target.left + target.width / 2);
    const y = dest.top + dest.height / 2 - (target.top + target.height / 2);

    void animate(bgOpacity, 0, morph);

    void animate(stage, { x, y, scale }, { ...morph, onComplete: onClose });
  }, [photo.id, onClose, animate, bgOpacity, morph]);

  const snapBack = useCallback(() => {
    const surface = dragRef.current;
    if (surface) {
      void animate(surface, { x: 0, y: 0 }, morph);
    }
    void animate(bgOpacity, 1, morph);
    void animate(contentScale, 1, morph);
  }, [animate, bgOpacity, contentScale, morph]);

  const dismissDown = useCallback(() => {
    const surface = dragRef.current;

    void animate(bgOpacity, 0, dismissTransition);

    if (surface) {
      void animate(
        surface,
        { y: window.innerHeight, opacity: 0 },
        { ...dismissTransition, onComplete: onClose },
      );
    } else {
      onClose();
    }
  }, [animate, onClose, bgOpacity, dismissTransition]);

  useEffect(() => {
    [photos[index - 1], photos[index + 1]].forEach((neighbour) => {
      if (neighbour) {
        const preloaded = new Image();
        preloaded.src = neighbour.src;
      }
    });
  }, [index, photos]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
      } else if (event.key === "ArrowLeft" || event.key === "h") {
        goPrev();
      } else if (event.key === "ArrowRight" || event.key === "l") {
        goNext();
      } else if (event.key === "i") {
        setShowMetadata((value) => !value);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [close, goPrev, goNext]);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      ref={scope}
      data-hover-edge={hoverEdge}
      onPointerMove={onPointerMove}
      onPointerLeave={() => setHoverEdge(null)}
      className="group/lightbox fixed inset-0 z-50"
    >
      <motion.div
        style={{ opacity: bgOpacity }}
        className="pointer-events-none absolute inset-0 bg-background/90 backdrop-blur-md"
      />

      <Button
        onClick={close}
        aria-label="Fermer"
        variant="blur"
        size="icon-lg"
        className="absolute top-4 right-4 z-20"
      >
        <XIcon className="size-6" />
      </Button>

      {canHover ? (
        <>
          {hasPrev ? (
            <Button
              onClick={goPrev}
              aria-label="Photo précédente"
              variant="blur"
              size="icon-lg"
              className={cn(
                "absolute top-1/2 left-4 z-20 -translate-y-1/2 transition-opacity",
                "pointer-events-none opacity-0",
                "group-data-[hover-edge='left']/lightbox:pointer-events-auto group-data-[hover-edge='left']/lightbox:opacity-100",
              )}
            >
              <ChevronLeftIcon className="size-6" />
            </Button>
          ) : null}

          {hasNext ? (
            <Button
              onClick={goNext}
              aria-label="Photo suivante"
              variant="blur"
              size="icon-lg"
              className={cn(
                "absolute top-1/2 right-4 z-20 -translate-y-1/2 transition-opacity",
                "pointer-events-none opacity-0",
                "group-data-[hover-edge='right']/lightbox:pointer-events-auto group-data-[hover-edge='right']/lightbox:opacity-100",
              )}
            >
              <ChevronRightIcon className="size-6" />
            </Button>
          ) : null}
        </>
      ) : null}

      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={photo.id}
          ref={setDragRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={crossfade}
          drag={!canHover}
          dragDirectionLock
          dragMomentum={false}
          dragConstraints={{ top: 0 }}
          dragElastic={0}
          onDirectionLock={(axis) => {
            lockedAxis.current = axis;
          }}
          onDrag={(_, info) => {
            if (lockedAxis.current !== "y") {
              return;
            }

            const progress = Math.min(
              Math.max(info.offset.y, 0) / (window.innerHeight * 0.6),
              1,
            );

            bgOpacity.set(1 - progress);
            contentScale.set(1 - progress * 0.15);
          }}
          onDragEnd={(_, info) => {
            const axis = lockedAxis.current;
            lockedAxis.current = null;

            if (axis === "x") {
              if (info.offset.x < -80 && hasNext) {
                goNext();
              } else if (info.offset.x > 80 && hasPrev) {
                goPrev();
              } else {
                snapBack();
              }
            } else if (
              axis === "y" &&
              (info.offset.y > 120 || info.velocity.y > 500)
            ) {
              dismissDown();
            } else {
              snapBack();
            }
          }}
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              close();
            }
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div
            ref={setStageRef}
            className="relative"
            style={{ width: size.width, height: size.height }}
          >
            <motion.div
              style={{ scale: contentScale }}
              className="absolute inset-0"
            >
              <LightboxImage photo={photo} />
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      <MetadataPanel
        photo={photo}
        open={showMetadata}
        onToggle={() => setShowMetadata((value) => !value)}
      />
    </div>
  );
};

export default Lightbox;
