import {
  type ForwardedRef,
  type RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import MediaContainerObserver from "./observer";
import type { ContainerDimensions } from "./types";

export const useComponentMediaQuery = (preload = true) => {
  const [dimension, setDimension] = useState<ContainerDimensions>({
    width: 0,
    height: 0,
  });
  const containerRef = useRef<HTMLElement>(null);
  const observerRef = useRef<ResizeObserver>(null);

  // isOnScreen?
  const [isOnScreen, setIsOnScreen] = useState(false);
  const isOnScreenRef = useRef(true);
  isOnScreenRef.current = isOnScreen;

  // setting up resize observer
  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize ResizeObserver
    observerRef.current = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (!isOnScreenRef.current) return;
        const { width, height } = entry.contentRect;
        if (width === dimension.width && height === dimension.height) return;

        setDimension({ width, height });
      }
    });

    // Start observing
    observerRef.current.observe(containerRef.current);

    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [isOnScreen]);

  // setting up intersection observer
  const setRefs = (node: HTMLElement | null) => {
    containerRef.current = node;
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        setIsOnScreen(entry.isIntersecting);
      },
      {
        threshold: 0.01, // percentage of intersection to trigger
        rootMargin: preload ? "0px 0px 400px 0px" : "", // offset from view to start triggering process
      },
    );

    intersectionObserver.observe(containerRef.current);
    return () => intersectionObserver.disconnect();
  }, []);

  return {
    ref: setRefs,
    dimension,
  };
};

type onResizePropsType = ContainerDimensions;
type useMediaContainerNewObserverPropsType = {
  ref: ForwardedRef<HTMLElement> | RefObject<HTMLElement>;
  preload?: boolean;
};
/**
 * useMediaContainerNewObserver experimental hook using a custom "observer"
 * This is at least 2 times slower than using 2 observers. Might need more
 * research or probably a more experience approach
 */
export const useMediaContainerNewObserver = ({
  ref: initialRef,
}: useMediaContainerNewObserverPropsType) => {
  const [dimension, setDimension] = useState<ContainerDimensions>({
    width: 0,
    height: 0,
  });
  const containerRef = useRef<HTMLElement>(null);
  const observerRef = useRef<ResizeObserver>(null);

  // isOnScreen?
  const [isOnScreen, setIsOnScreen] = useState(false);
  const isOnScreenRef = useRef(true);
  isOnScreenRef.current = isOnScreen;

  const onResize = ({ width, height }: onResizePropsType) => {
    if (width === dimension.width && height === dimension.height) return;

    setDimension({ width, height });
  };

  // setting up resize observer
  useEffect(() => {
    if (!containerRef.current) return;
    observerRef.current = new MediaContainerObserver({ onResize });

    // Start observing
    observerRef.current.observe(containerRef.current);

    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // setting up intersection observer
  const setRefs = (node: HTMLElement | null) => {
    containerRef.current = node;

    if (typeof initialRef === "function") {
      initialRef(node);
    } else if (initialRef) {
      (initialRef as RefObject<HTMLElement | null>).current = node;
    }
  };

  return {
    ref: setRefs,
    dimension,
  };
};
