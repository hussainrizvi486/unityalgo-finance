
import { cn } from "../../utils/index";
import React from "react"


function calculatePosition(action: 'open' | 'close') {
    return function calculate(el: HTMLDivElement, transitionMs: number = 0) {
        if (action === 'open') {
            // 1. Determine whether we are scaling by height or width.
            //    We will scale based on which ever one is smaller.
            // 2. translateX the element to the center of the screen always.
            // 3. If we are scaling by height, translateY based on
            //    the viewport's top / 0px.
            // 4. If we are scaling by width, translateY based on the center
            //    of the viewport height (window.innerHeight / 2)
            const { innerWidth, innerHeight } = window
            const { height, width, top, left } = el.getBoundingClientRect()
            const scaleBy = innerWidth < innerHeight ? 'width' : 'height'
            const scale =
                scaleBy === 'width' ? innerWidth / width : innerHeight / height

            // Calculate translateX to center of x axis.
            const scaledImageWidth = width * scale
            const leftOfWhereScaledImageNeedsToBe =
                innerWidth / 2 - scaledImageWidth / 2
            const leftOfWhereScaledImageIs = left - (scaledImageWidth - width) / 2

            const translateX =
                (leftOfWhereScaledImageNeedsToBe - leftOfWhereScaledImageIs) / scale
            let translateY: number = 0

            if (scaleBy === 'width') {
                const scaledImageHeight = height * scale
                const centerOfScreen = innerHeight / 2

                const topOfWhereImageShouldBe = centerOfScreen - scaledImageHeight / 2

                translateY = (topOfWhereImageShouldBe - top) / scale
            } else {
                translateY = (top / scale) * -1
            }

            el.style.opacity = '1'
            el.style.transform = `scale(${scale}) translate3d(${translateX}px, ${translateY}px, 0px)`
            el.style.transition = `transform ${transitionMs}ms ease, opacity 0ms`
            el.style.transformOrigin = '50% 0'
            el.style.zIndex = '9'
            el.style.pointerEvents = 'initial'
            el.style.touchAction = 'initial'

            return
        }

        if (action === 'close') {
            el.style.opacity = '0'
            el.style.transform = `scale(1) translate3d(0px, 0px, 0px)`
            el.style.transition = `transform ${transitionMs}ms ease, opacity 0ms ease ${transitionMs}ms, z-index 0ms ease ${transitionMs}ms`
            el.style.transformOrigin = '50% 0'
            el.style.zIndex = '-1'
            el.style.pointerEvents = 'none'
            el.style.touchAction = 'none'

            return
        }
    }
}


interface ImageProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    className: string,
    src: string
    alt: string
    style?: React.CSSProperties
    [k: string]: any;
}

export function Image({ src, alt, style, className, ...props }: ImageProps) {
    const {
        onClick,
        isFocused,
        shouldAnimate,
        isImageGroupExpanded,
        transitionMs,
        ...rest
    } = props

    const scalingImage = React.useRef<HTMLDivElement>(null)
    const wasPreviouslyFocused = React.useRef(false)
    const initialRender = React.useRef(false)
    React.useEffect(() => {
        if (!initialRender.current) {
            initialRender.current = true
            return
        }

        const element = scalingImage.current
        if (element) {
            if (isFocused) {
                if (shouldAnimate) {
                    // Animate in
                    calculatePosition('open')(element, transitionMs)
                } else {
                    // Immediately show
                    calculatePosition('open')(element, 0)
                }

                wasPreviouslyFocused.current = true
            }

            if (!isFocused && wasPreviouslyFocused.current) {
                if (shouldAnimate) {
                    // Animate out
                    calculatePosition('close')(element, transitionMs)
                } else {
                    // Immediately hide
                    calculatePosition('close')(element, 0)
                }

                wasPreviouslyFocused.current = false
            }
        }
    }, [isFocused, shouldAnimate, transitionMs])

    return (
        <div className={cn("fullscreen-container", className)}>
            <button
                className="fullscreen-btn"
                onClick={onClick}
                tabIndex={isFocused || !isImageGroupExpanded ? 0 : -1}
                {...rest}
            >
                <div className="fullscreen-image">
                    <img src={src} alt={alt} style={style} />
                </div>
                <div ref={scalingImage} className="fullscreen-image">
                    <img src={src} alt={alt} style={style} />
                </div>
            </button>
        </div>
    )
}

Image.displayName = 'Image'