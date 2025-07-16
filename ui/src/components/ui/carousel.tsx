import React from 'react';
import { ArrowLeft, ArrowRight } from "lucide-react"
import { cn } from "../../utils/index";

interface CarouselProps {
    className?: string;
    children: React.ReactNode;
}

interface CarouselItemProps {
    className?: string;
    children: React.ReactNode;
}

const CarouselContext = React.createContext<{
    scrollPrev: () => void;
    scrollNext: () => void;
    canScrollPrev: boolean;
    canScrollNext: boolean;
} | null>(null);

const useCarousel = () => {
    const context = React.useContext(CarouselContext);
    if (!context) {
        throw new Error("useCarousel must be used within a Carousel");
    }
    return context;
};

const Carousel: React.FC<CarouselProps> = ({ className = "", children }) => {
    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);
    const scrollContainerRef = React.useRef<HTMLDivElement>(null);

    const scrollPrev = React.useCallback(() => {
        if (!scrollContainerRef.current) return;

        const container = scrollContainerRef.current;
        const scrollAmount = container.clientWidth;
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }, []);

    const scrollNext = React.useCallback(() => {
        if (!scrollContainerRef.current) return;

        const container = scrollContainerRef.current;
        const scrollAmount = container.clientWidth;
        
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });

    }, []);

    const checkScrollability = React.useCallback(() => {
        if (!scrollContainerRef.current) return;

        const container = scrollContainerRef.current;
        const { scrollLeft, scrollWidth, clientWidth } = container;

        setCanScrollPrev(scrollLeft > 0);
        setCanScrollNext(scrollLeft < scrollWidth - clientWidth - 1);
    }, []);

    React.useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        checkScrollability();

        const handleScroll = () => checkScrollability();
        const handleResize = () => checkScrollability();

        container.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleResize);

        // Check scrollability after content loads
        const resizeObserver = new ResizeObserver(() => {
            checkScrollability();
        });
        resizeObserver.observe(container);

        return () => {
            container.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
            resizeObserver.disconnect();
        };
    }, [checkScrollability]);

    const contextValue = React.useMemo(() => ({
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
    }), [scrollPrev, scrollNext, canScrollPrev, canScrollNext]);

    return (
        <CarouselContext.Provider value={contextValue}>
            <div className={cn("relative", className)}>
                <div
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto scrollbar-hide scroll-smooth"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {children}
                </div>
            </div>
        </CarouselContext.Provider>
    );
};

const CarouselItem: React.FC<CarouselItemProps> = ({ className = "", children }) => {
    return (
        <div className={cn("min-w-0 shrink-0 grow-0 basis-full", className)}>
            {children}
        </div>
    );
};

const CarouselPrevious: React.FC<{ className?: string }> = ({ className = "" }) => {
    const { scrollPrev, canScrollPrev } = useCarousel();

    return (
        <button
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            className={cn(
                "absolute left-4 top-1/2 -translate-y-1/2 z-10",
                "flex h-10 w-10 items-center justify-center rounded-full",
                "bg-white/90 hover:bg-white shadow-md",
                "transition-all duration-200",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "hover:scale-105 active:scale-95",
                className
            )}
            aria-label="Previous slide"
        >
            <ArrowLeft className="h-5 w-5" />
        </button>
    );
};

const CarouselNext: React.FC<{ className?: string }> = ({ className = "" }) => {
    const { scrollNext, canScrollNext } = useCarousel();

    return (
        <button
            onClick={scrollNext}
            disabled={!canScrollNext}
            className={cn(
                "absolute right-4 top-1/2 -translate-y-1/2 z-10",
                "flex h-10 w-10 items-center justify-center rounded-full",
                "bg-white/90 hover:bg-white shadow-md",
                "transition-all duration-200",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "hover:scale-105 active:scale-95",
                className
            )}
            aria-label="Next slide"
        >
            <ArrowRight className="h-5 w-5" />
        </button>
    );
};

const CarouselContent: React.FC<{ className?: string; children: React.ReactNode }> = ({
    className = "",
    children
}) => {
    return (
        <div className={cn("flex", className)}>
            {children}
        </div>
    );
};

export {
    Carousel,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
    CarouselContent,
    useCarousel
};