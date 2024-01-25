"use client";
import { tremorTwMerge } from "lib";
import React from "react";

import Tooltip, { useTooltip } from "components/util-elements/Tooltip/Tooltip";
import { colorPalette, getColorClassNames, makeClassName, mergeRefs } from "lib";
import { Color } from "../../../lib/inputTypes";

export const makeHeatmapClassName = makeClassName("Heatmap");

const colorShades = new Set(Object.entries(colorPalette).map(([_, shades]) => shades).sort((a, b) => a - b));

type HeatmapData = {
    x: string;
    y: string;
    value: number;
}

export interface HeatmapProps extends React.HTMLAttributes<HTMLDivElement> {
    data: HeatmapData[];
    xLabels: string[];
    yLabels: string[];
    color: Color;
    showTooltip?: boolean;
    steps: number[];
}

const Heatmap = React.forwardRef<HTMLDivElement, HeatmapProps>((props, ref) => {
    const {
        data,
        xLabels,
        yLabels,
        color = "blue",
        showTooltip = true,
        steps,
        ...rest
    } = props;
    
    const stepShades = React.useMemo(() => {
        const shades = [...colorShades];
        shades.sort((a, b) => a - b);
        const step = Math.floor(shades.length / steps.length);
        const stepShades = [];
        for (let i = 0; i < steps.length; i++) {
            stepShades.push(shades[i * step]);
        }
        return stepShades;
    }, [steps]);

    const getHeatmapColor = (value: number) => {
        const index = steps.findIndex((step) => value <= step);
        const shade = stepShades[index];
        return getColorClassNames(color, shade);
    };


    return (
        <div
            className={tremorTwMerge(
                makeHeatmapClassName("container"),
                "relative w-40"
            )}
            {...rest}
        >
            <table
                className={tremorTwMerge(
                    makeHeatmapClassName("table"),
                    "w-full h-full"
                )}
            >
                <tbody>
                    <tr>
                        <td
                            className={tremorTwMerge(
                                makeHeatmapClassName("cell"),
                            )}
                        ></td>
                        {xLabels.map((xLabel) => (
                            <td
                                key={xLabel}
                                className={tremorTwMerge(
                                    makeHeatmapClassName("cell"),
                                )}
                            >
                                <div
                                    className={tremorTwMerge(
                                        makeHeatmapClassName("cell-inner"),
                                        "text-center"
                                    )}
                                >
                                    {xLabel}
                                </div>
                            </td>
                        ))}
                    </tr>
                    {yLabels.map((yLabel) => (
                        <tr key={yLabel}>
                            <td
                                className={tremorTwMerge(
                                    makeHeatmapClassName("cell"),
                                    "text-center"
                                )}
                            >
                                {yLabel}
                            </td>
                            {xLabels.map((xLabel) => {
                                const d = data.find(
                                    (d) => d.x === xLabel && d.y === yLabel
                                );

                                if (!d) return null;
                                return (
                                    <td
                                        key={xLabel}
                                        className={tremorTwMerge(
                                            makeHeatmapClassName("cell"),
                                        )}
                                    >
                                        <div
                                            className={tremorTwMerge(
                                                makeHeatmapClassName("cell-inner"),
                                                "w-full h-full",
                                                "text-white",
                                                "p-1 aspect-square",
                                                "rounded-sm flex items-center justify-center",
                                                getHeatmapColor(d.value).bgColor
                                            )}
                                        // style={{
                                        //     backgroundColor: `hsl(0, 0%, ${Math.floor(
                                        //         ((d.value - minValue) /
                                        //             (maxValue - minValue)) *
                                        //         100
                                        //     )}%)`,
                                        // }}
                                        >
                                            {/* {d.value} */}
                                        </div>
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                    <tr>
                        <td
                            className={tremorTwMerge(
                                makeHeatmapClassName("cell"),
                            )}
                        ></td>
                        {xLabels.map((xLabel) => (
                            <td
                                key={xLabel}
                                className={tremorTwMerge(
                                    makeHeatmapClassName("cell"),
                                )}
                            >
                                <div
                                    className={tremorTwMerge(
                                        makeHeatmapClassName("cell-inner"),
                                        "text-center"
                                    )}
                                >
                                    {xLabel}
                                </div>
                            </td>
                        ))}
                    </tr>
                </tbody>
            </table>
        </div>
    );
});

export default Heatmap;

