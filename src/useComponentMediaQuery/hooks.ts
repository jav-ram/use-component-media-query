import {
  RefCallback,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import MediaContainerObserver from "./observer";
import type { ContainerDimensions } from "./types";

const PRELOAD_OFFSET = "0px 0px 400px 0px";
type useComponentMediaQueryPropsType = {
  preload?: boolean | string,
  // ref?: React.RefObject<HTMLDivElement | null>,
};

/**
 * useComponentMediaQuery is a hook that tracks dimension changes of a DOM component.
 * 
 * The hook only updates dimensions when the element is visible or within 
 * a specified preload area, preventing unnecessary re-renders for offscreen elements.
 *
 * @param [preload=true] - Controls the preload behavior:
 *   - `true` (default): Uses a default preload area ("0px 0px 400px 0px")
 *   - `false`: Disables preloading - only updates when element is visible
 *   - `string`: Custom CSS margin string (e.g., "100px 0px 200px 50px")
 * 
 * @returns An object containing:
 *   - `dimensions`: {width: number, height: number} - Current dimensions of the element
 *   - `ref`: React ref - Attach this to the element you want to track
 *
 * @example
 * // Basic usage with default preload
 * const { dimensions, ref } = useComponentMediaQuery();
 * 
 * @example
 * // Disable preloading - only track when visible
 * const { dimensions, ref } = useComponentMediaQuery(false);
 * 
 * @example
 * // Custom preload area
 * const { dimensions, ref } = useComponentMediaQuery("100px 0px 300px 0px");
 */
export const useComponentMediaQuery = ({
  preload = true,
}: useComponentMediaQueryPropsType) => {
  const [dimension, setDimension] = useState<ContainerDimensions>({
    width: 0,
    height: 0,
  });
  const elementRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<ResizeObserver>(null);

  // set default preloadConfig
  const preloadConfig = (typeof preload === 'boolean' && preload) ? PRELOAD_OFFSET : preload;

  // isOnScreen?
  const [isOnScreen, setIsOnScreen] = useState(false);
  const isOnScreenRef = useRef(true);
  isOnScreenRef.current = isOnScreen;

  // setting up resize observer
  useEffect(() => {
    if (!elementRef.current) return;

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
    observerRef.current.observe(elementRef.current);

    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [isOnScreen]);

  // setting up intersection observer
  const setRefs = (node: HTMLDivElement | null): void => {
    elementRef.current = node;
  };

  useEffect(() => {
    // ignore when no ref container
    if (!elementRef.current) return;    

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        setIsOnScreen(entry.isIntersecting);
      },
      {
        // set root as the viewport
        root: null,
        // percentage of intersection to trigger
        threshold: 0.01,
        // offset from view to start triggering process
        rootMargin: preloadConfig ? preloadConfig : '0px',
      },
    );

    intersectionObserver.observe(elementRef.current);
    return () => intersectionObserver.disconnect();
  }, []);

  return {
    ref: setRefs,
    dimension,
  };
};

type onResizePropsType = ContainerDimensions;
/**
 * useMediaContainerNewObserver experimental hook using a custom "observer"
 * This is at least 2 times slower than using 2 observers. Might need more
 * research or probably a more experience approach
 */
export const useMediaContainerNewObserver = (preload: boolean | string = true) => {
  const [dimension, setDimension] = useState<ContainerDimensions>({
    width: 0,
    height: 0,
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<ResizeObserver>(null);

  // set default preloadConfig
  const preloadConfig = (typeof preload === 'boolean' && preload) ? PRELOAD_OFFSET : preload;

  const onResize = ({ width, height }: onResizePropsType) => {
    if (width === dimension.width && height === dimension.height) return;

    setDimension({ width, height });
  };

  // setting up resize observer
  useEffect(() => {
    if (!containerRef.current) return;
    observerRef.current = new MediaContainerObserver({
      onResize,
      intersectionOptions: {
        rootMargin: preloadConfig? preloadConfig : '',
      },
  });

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
  const setRefs = (node: HTMLDivElement | null) => {
    containerRef.current = node;
  };

  return {
    ref: setRefs,
    dimension,
  };
};
