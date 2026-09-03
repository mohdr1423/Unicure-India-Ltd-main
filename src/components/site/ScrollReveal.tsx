import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

export type Variant = "fade-up" | "fade-in" | "slide-left" | "slide-right" | "scale";

type VariantStyle = {
  hidden: CSSProperties;
  visible: CSSProperties;
};

const variantStyles: Record<Variant, VariantStyle> = {
  "fade-up": {
    hidden: { opacity: 0, transform: "translateY(24px)" },
    visible: { opacity: 1, transform: "translateY(0)" },
  },
  "fade-in": {
    hidden: { opacity: 0, transform: "none" },
    visible: { opacity: 1, transform: "none" },
  },
  "slide-left": {
    hidden: { opacity: 0, transform: "translateX(-24px)" },
    visible: { opacity: 1, transform: "translateX(0)" },
  },
  "slide-right": {
    hidden: { opacity: 0, transform: "translateX(24px)" },
    visible: { opacity: 1, transform: "translateX(0)" },
  },
  scale: {
    hidden: { opacity: 0, transform: "scale(0.96)" },
    visible: { opacity: 1, transform: "scale(1)" },
  },
};

export function ScrollReveal({
  children,
  variant = "fade-up",
  delay = 0,
  duration = 0.6,
  threshold = 0.1,
  once = true,
  className,
}: {
  children: ReactNode;
  variant?: Variant;
  delay?: number;
  duration?: number;
  threshold?: number;
  once?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // Default isVisible to true on SSR so crawlers and initial render have 100% visible content
  const [isVisible, setIsVisible] = useState(true);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference or missing IntersectionObserver
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || typeof IntersectionObserver === "undefined") {
      setHasHydrated(true);
      setIsVisible(true);
      return;
    }

    const element = ref.current;
    if (!element) return;

    // Check if element is already intersecting immediately
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const isAlreadyInViewport = rect.top < windowHeight + 40 && rect.bottom > -40;

    if (isAlreadyInViewport) {
      setHasHydrated(true);
      setIsVisible(true);
      return;
    }

    // Element is below the fold: initialize hidden state so it animates when scrolled into view
    setIsVisible(false);
    setHasHydrated(true);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.disconnect();
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold: Math.min(threshold, 0.1),
        rootMargin: "60px 0px",
      },
    );

    observer.observe(element);

    // Fail-safe: ensure content is revealed after 2.5s even if observer doesn't fire
    const safetyTimer = setTimeout(() => {
      setIsVisible(true);
    }, 2500);

    return () => {
      observer.disconnect();
      clearTimeout(safetyTimer);
    };
  }, [threshold, once]);

  // SSR or before hydration: render clean div with no inline hidden styles
  if (!hasHydrated) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  const v = variantStyles[variant];
  const currentStyle = isVisible ? v.visible : v.hidden;

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...currentStyle,
        transitionProperty: "opacity, transform",
        transitionDuration: `${duration}s`,
        transitionDelay: `${delay}s`,
        transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
        willChange: isVisible ? "auto" : "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}

type StaggerContextType = {
  inView: boolean;
  stagger: number;
};

const StaggerContext = createContext<StaggerContextType | null>(null);

/**
 * Staggered reveal for grid items.
 * Wrap each child item in <StaggerItem> inside a <StaggerGrid>.
 */
export function StaggerGrid({
  children,
  className,
  stagger = 0.08,
  threshold = 0.1,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  threshold?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || typeof IntersectionObserver === "undefined") {
      setHasHydrated(true);
      setInView(true);
      return;
    }

    const element = ref.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const isAlreadyInViewport = rect.top < windowHeight + 40 && rect.bottom > -40;

    if (isAlreadyInViewport) {
      setHasHydrated(true);
      setInView(true);
      return;
    }

    setInView(false);
    setHasHydrated(true);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: Math.min(threshold, 0.1),
        rootMargin: "60px 0px",
      },
    );

    observer.observe(element);

    const safetyTimer = setTimeout(() => {
      setInView(true);
    }, 2500);

    return () => {
      observer.disconnect();
      clearTimeout(safetyTimer);
    };
  }, [threshold]);

  const childrenWithIndex = React.Children.map(children, (child, index) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        index: (child.props as any).index ?? index,
      } as any);
    }
    return child;
  });

  return (
    <StaggerContext.Provider value={{ inView, stagger }}>
      <div ref={ref} className={className}>
        {childrenWithIndex}
      </div>
    </StaggerContext.Provider>
  );
}

export function StaggerItem({
  children,
  className,
  index = 0,
}: {
  children: ReactNode;
  className?: string;
  index?: number;
}) {
  const ctx = useContext(StaggerContext);
  const inView = ctx ? ctx.inView : true;
  const stagger = ctx ? ctx.stagger : 0.08;
  const delay = index * stagger;

  return (
    <div
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : "translateY(24px)",
        transitionProperty: "opacity, transform",
        transitionDuration: "0.5s",
        transitionDelay: `${delay}s`,
        transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
        willChange: inView ? "auto" : "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
