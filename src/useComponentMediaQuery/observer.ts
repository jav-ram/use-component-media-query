type IntersectionCallback = (intersecting: boolean) => void;
type ResizeCallback = (dimensions: { width: number, height: number }) => void;

interface MediaContainerObserverOptions {
  intersectionOptions?: IntersectionObserverInit;
  onIntersect?: IntersectionCallback;
  onResize?: ResizeCallback;
}

class MediaContainerObserver {
  private intersectionObserver: IntersectionObserver;
  private resizeObserver: ResizeObserver;

  private intersecting: boolean = false;

  constructor({
    intersectionOptions = { rootMargin: "0px 0px 200px 0px" },
    onIntersect,
    onResize,
  }: MediaContainerObserverOptions = {}) {

    // Arrow function preserves 'this' dynamically
    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        // update internal value
        this.intersecting = entry.isIntersecting;

        onIntersect?.(entry.isIntersecting);
        // retrigger resize to calculate first state render
        onResize?.({ width: entry.target.clientWidth, height: entry.target.clientHeight });
      });
    }, intersectionOptions);

    // Arrow function ensures latest 'this.intersecting'
    this.resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        if (this.intersecting) {
          const { width, height } = entry.contentRect;
          onResize?.({ width, height });
        }
      });
    });
  }

  // Observe a single element with both observers
  observe(element: Element): void {
    this.intersectionObserver.observe(element);
    this.resizeObserver.observe(element);
  }

  // Stop observing a single element
  unobserve(element: Element): void {
    this.intersectionObserver.unobserve(element);
    this.resizeObserver.unobserve(element);
  }

  // Disconnect both observers entirely
  disconnect(): void {
    this.intersectionObserver.disconnect();
    this.resizeObserver.disconnect();
  }
}

export default MediaContainerObserver;
