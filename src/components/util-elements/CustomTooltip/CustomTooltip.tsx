import React, { useState } from "react";
import {
    ExtendedRefs,
    FloatingPortal,
    ReferenceType,
    Strategy,
    autoPlacement,
    autoUpdate,
    flip,
    offset,
    shift,
    useDismiss,
    useFloating,
    useFocus,
    useHover,
    useInteractions,
    useRole,
} from "@floating-ui/react";
import { mergeRefs, tremorTwMerge } from "lib";
import { spacing } from "lib";

export interface CustomTooltipProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "content"> {
    content?: string | React.ReactNode | React.ReactElement | React.JSX.Element ;
    position?: "top" | "left" | "right" | "bottom";
    delay?: number;
    autoPosition?: boolean;
}

const CustomTooltip = React.forwardRef<HTMLDivElement, CustomTooltipProps>((props, ref) => {
    const {
        content,
        position = "top",
        children,
        className,
        delay = 200,
        autoPosition = false,
        ...other
    } = props
    const [isOpen, setIsOpen] = useState(false);
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>();

    const handleOpenChange = (isOpen: boolean) => {
        if (isOpen && delay) {
            const timer = setTimeout(() => {
                setIsOpen(isOpen);
            }, delay);
            setTimeoutId(timer);
            return;
        }
        clearTimeout(timeoutId);
        setIsOpen(isOpen);
    };

    const { refs, context, strategy, x, y } = useFloating({
        open: isOpen,
        onOpenChange: handleOpenChange,
        placement: position,
        whileElementsMounted: autoUpdate,
        middleware: [
            offset(5),
            // flip({
            //     fallbackAxisSideDirection: "start"
            // }),
            shift()
        ]
    });

    // Event listeners to change the open state
    const hover = useHover(context, { move: false });
    const focus = useFocus(context);
    const dismiss = useDismiss(context);
    // Role props for screen readers
    const role = useRole(context, { role: "tooltip" });

    // Merge all the interactions into prop getters
    const { getReferenceProps, getFloatingProps } = useInteractions([
        hover,
        focus,
        dismiss,
        role
    ]);


    return (
        <>
            <div
                {...other}
                className={tremorTwMerge(
                    // common
                    "w-fit",
                    className
                )}
                ref={mergeRefs([ref, refs.setReference])}
                {...getReferenceProps()}
            >
                {children}
            </div>
            <FloatingPortal>
                {isOpen && (

                    <div
                        {...other}
                        ref={refs.setFloating}
                        className={tremorTwMerge(
                            // common
                            "h-fit text-sm z-20 rounded-tremor-default",
                            // // light
                            // "text-white bg-tremor-background-emphasis",
                            // // dark
                            // "dark:text text-white dark:bg-dark-tremor-background-subtle",
                            // light
                            "bg-tremor-background ring-tremor-ring shadow-tremor-card",
                            // dark
                            "dark:bg-dark-tremor-background dark:ring-dark-tremor-ring dark:shadow-dark-tremor-card",
                            "border border-tremor-border dark:border-dark-tremor-border",
                            spacing.md.paddingX,
                            spacing.twoXs.paddingY,
                        )}
                        //   ref={refs.setFloating}
                        style={{
                            position: strategy,
                            top: y ?? 0,
                            left: x ?? 0,
                        }}
                        {...getFloatingProps()}

                    >
                        {content}
                    </div>
                )}
            </FloatingPortal>
        </>
    )
});

CustomTooltip.displayName = "CustomTooltip";

export default CustomTooltip;
