"use client";
import React, { useState } from "react";
import {
    Area,
    Bar,
    CartesianGrid,
    Legend,
    Line,
    ComposedChart as ReChartsComposedChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { AxisDomain } from "recharts/types/util/types";

import { constructCategoryColors, getYAxisDomain } from "../common/utils";
import BaseChartProps from "../common/BaseChartProps";
import ChartLegend from "../common/ChartLegend";
import ChartTooltip from "../common/ChartTooltip";
import NoData from "../common/NoData";

import {
    BaseColors,
    defaultValueFormatter,
    themeColorRange,
    colorPalette,
    getColorClassNames,
    tremorTwMerge,
} from "lib";
import { Color, CurveType, ValueFormatter } from "../../../lib/inputTypes";
import BaseAnimationTimingProps from "components/chart-elements/common/BaseAnimationTimingProps";

interface ComposedChartCategories {
    line?: string[];
    area?: string[];
    bar?: string[];
    scatter?: string[];
}

interface ComposedChartColors {
    line?: Color[];
    area?: Color[];
    bar?: Color[];
    scatter?: Color[];
}

const getAllItems = (obj: any) => {
    const allItems: any[] = [];

    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const value = obj[key];

            // Check if the value is an array of strings
            if (Array.isArray(value) && value.every((item) => typeof item === 'string')) {
                // Concatenate the array to the result array
                allItems.push(...value);
            }
        }
    }

    return allItems
}

export interface ComposedChartProps extends BaseAnimationTimingProps {
    data: any[];
    categories: ComposedChartCategories;
    index: string;
    colors?: ComposedChartColors;
    valueFormatter?: ValueFormatter;
    startEndOnly?: boolean;
    showXAxis?: boolean;
    showYAxis?: boolean;
    yAxisWidth?: number;
    showTooltip?: boolean;
    showGradient?: boolean;
    showLegend?: boolean;
    showGridLines?: boolean;
    autoMinValue?: boolean;
    minValue?: number;
    maxValue?: number;
    allowDecimals?: boolean;
    noDataText?: string;
    layout?: "vertical" | "horizontal";
    stack?: boolean;
    relative?: boolean;
    curveType?: CurveType;
    connectNulls?: boolean;
}

const ComposedChart = React.forwardRef<HTMLDivElement, ComposedChartProps>((props, ref) => {
    const {
        data = [],
        categories = {},
        index,
        stack = false,
        colors = {
            bar: themeColorRange,
            line: themeColorRange,
            area: themeColorRange,
            scatter: themeColorRange,
        },
        valueFormatter = defaultValueFormatter,
        startEndOnly = false,
        showXAxis = true,
        showYAxis = true,
        yAxisWidth = 56,
        showAnimation = true,
        animationDuration = 900,
        showTooltip = true,
        showLegend = true,
        showGridLines = true,
        showGradient = true,
        autoMinValue = false,
        curveType = "linear",
        minValue,
        maxValue,
        connectNulls = false,
    relative = false,
    allowDecimals = true,
        noDataText,
        className,
        ...other
    } = props;
    const [legendHeight, setLegendHeight] = useState(60);
    const allCategories = getAllItems(categories)
    const allColors = getAllItems(colors)

    const categoryColors = constructCategoryColors(allCategories, allColors);
    const categoriesColors = {
        bar: constructCategoryColors(categories?.bar || [], colors?.bar || []),
        line: constructCategoryColors(categories?.line || [], colors?.line || []),
        area: constructCategoryColors(categories?.area || [], colors?.area || []),
        scatter: constructCategoryColors(categories?.scatter || [], colors?.scatter || []),
    }

    const yAxisDomain = getYAxisDomain(autoMinValue, minValue, maxValue);
    return (
        <div ref={ref} className={tremorTwMerge("w-full h-80", className)} {...other}>
            <ResponsiveContainer className="h-full w-full">
                {data?.length ? (
                    <ReChartsComposedChart data={data}
            stackOffset={relative ? "expand" : "none"}
                    
                    >
                        {showGridLines ? (
                            <CartesianGrid
                                className={tremorTwMerge(
                                    // common
                                    "stroke-1",
                                    // light
                                    "stroke-tremor-content-subtle",
                                    // dark
                                    "dark:stroke-dark-tremor-content-subtle",
                                )}
                                strokeDasharray="3 3"
                                horizontal={true}
                                vertical={false}
                            />
                        ) : null}
                        <XAxis
                            hide={!showXAxis}
                            dataKey={index}
                            tick={{ transform: "translate(0, 6)" }}
                            ticks={startEndOnly ? [data[0][index], data[data.length - 1][index]] : undefined}
                            fill=""
                            stroke=""
                            className={tremorTwMerge(
                                // common
                                "text-tremor-label",
                                // light
                                "fill-tremor-content",
                                // dark
                                "dark:fill-dark-tremor-content",
                            )}
                            interval="preserveStartEnd"
                            tickLine={false}
                            axisLine={false}
                            padding={{ left: 10, right: 10 }}
                            minTickGap={5}
                        />
                        <YAxis
                            width={yAxisWidth}
                            hide={!showYAxis}
                            axisLine={false}
                            tickLine={false}
                            type="number"
                            domain={yAxisDomain as AxisDomain}
                            tick={{ transform: "translate(-3, 0)" }}
                            fill=""
                            stroke=""
                            className={tremorTwMerge(
                                // common
                                "text-tremor-label",
                                // light
                                "fill-tremor-content",
                                // dark
                                "dark:fill-dark-tremor-content",
                            )}
                            tickFormatter={valueFormatter}
                            allowDecimals={allowDecimals}
                        />
                        {showTooltip ? (
                            <Tooltip
                                wrapperStyle={{ outline: "none" }}
                                isAnimationActive={false}
                                cursor={{ stroke: "#d1d5db", strokeWidth: 1 }} // @achi @severin
                                content={({ active, payload, label }) => (
                                    <ChartTooltip
                                        active={active}
                                        payload={payload}
                                        label={label}
                                        valueFormatter={valueFormatter}
                                        categoryColors={categoryColors}
                                    />
                                )}
                                position={{ y: 0 }}
                            />
                        ) : null}
                        {showLegend ? (
                            <Legend
                                verticalAlign="top"
                                height={legendHeight}
                                content={({ payload }) => ChartLegend({ payload }, categoryColors, setLegendHeight)}
                            />
                        ) : null}
                        {categories?.area?.map((category) => {
                            return (
                                <defs key={category}>
                                    {showGradient ? (
                                        <linearGradient
                                            className={
                                                getColorClassNames(
                                                    categoriesColors?.area?.get(category) ?? BaseColors.Gray,
                                                    colorPalette.text,
                                                ).textColor
                                            }
                                            id={categoriesColors?.area?.get(category)}
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop offset="5%" stopColor="currentColor" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="currentColor" stopOpacity={0} />
                                        </linearGradient>
                                    ) : (
                                        <linearGradient
                                            className={
                                                getColorClassNames(
                                                    categoriesColors?.area?.get(category) ?? BaseColors.Gray,
                                                    colorPalette.text,
                                                ).textColor
                                            }
                                            id={categoriesColors?.area?.get(category)}
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop stopColor="currentColor" stopOpacity={0.3} />
                                        </linearGradient>
                                    )}
                                </defs>
                            );
                        })}
                        {categories?.area?.map((category) => (
                            <Area
                                className={
                                    getColorClassNames(
                                        categoriesColors?.area?.get(category) ?? BaseColors.Gray,
                                        colorPalette.text,
                                    ).strokeColor
                                }
                                activeDot={{
                                    className: tremorTwMerge(
                                        "stroke-tremor-background dark:stroke-dark-tremor-background",
                                        getColorClassNames(
                                            categoriesColors?.area?.get(category) ?? BaseColors.Gray,
                                            colorPalette.text,
                                        ).fillColor,
                                    ),
                                }}
                                dot={false}
                                key={category}
                                name={category}
                                type={curveType}
                                dataKey={category}
                                stroke=""
                                fill={`url(#${categoriesColors?.area?.get(category)})`}
                                strokeWidth={2}
                                strokeLinejoin="round"
                                strokeLinecap="round"
                                isAnimationActive={showAnimation}
                                animationDuration={animationDuration}
                            stackId={stack ? "a" : undefined}
                            connectNulls={connectNulls}
                            />
                        ))}
                        {categories?.bar?.map((category) => (
                            <Bar
                                className={
                                    getColorClassNames(
                                        categoriesColors?.bar?.get(category) ?? BaseColors.Gray,
                                        colorPalette.background,
                                    ).fillColor
                                }
                                key={category}
                                name={category}
                                type="linear"
                                stackId={stack || relative ? "a" : undefined}
                                dataKey={category}
                                fill=""
                                isAnimationActive={showAnimation}
                                animationDuration={animationDuration}
                            />
                        ))}
                        {categories?.line?.map((category) => (
                            <Line
                                className={
                                    getColorClassNames(
                                        categoriesColors?.line?.get(category) ?? BaseColors.Gray,
                                        colorPalette.text,
                                    ).strokeColor
                                }
                                activeDot={{
                                    className: tremorTwMerge(
                                        "stroke-tremor-background dark:stroke-dark-tremor-background",
                                        getColorClassNames(
                                            categoriesColors?.line?.get(category) ?? BaseColors.Gray,
                                            colorPalette.text,
                                        ).fillColor,
                                    ),
                                }}
                                dot={false}
                                key={category}
                                name={category}
                                type={curveType}
                                dataKey={category}
                                stroke=""
                                strokeWidth={2}
                                strokeLinejoin="round"
                                strokeLinecap="round"
                                isAnimationActive={showAnimation}
                                animationDuration={animationDuration}
                                connectNulls={connectNulls}
                            />
                        ))}
                    </ReChartsComposedChart>
                ) : (
                    <NoData noDataText={noDataText} />
                )}
            </ResponsiveContainer>
        </div>
    );
});

ComposedChart.displayName = "ComposedChart";

export default ComposedChart;
