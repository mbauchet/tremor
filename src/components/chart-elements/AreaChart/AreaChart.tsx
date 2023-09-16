"use client";
import React, { useState } from "react";
import {
    Area,
    CartesianGrid,
    Legend,
    AreaChart as ReChartsAreaChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { AxisDomain } from "recharts/types/util/types";

import { constructCategoryColors, constructDomain, elementWidth, findNumberWithLongestLength, getLongestValue, getMinMax, getYAxisDomain, getYAxisWidth } from "../common/utils";
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
import { CurveType } from "../../../lib/inputTypes";


export interface AreaChartProps extends BaseChartProps {
    stack?: boolean;
    curveType?: CurveType;
    connectNulls?: boolean;
}

const AreaChart = React.forwardRef<HTMLDivElement, AreaChartProps>((props, ref) => {
    const {
        data = [],
        categories = [],
        index,
        stack = false,
        colors = themeColorRange,
        valueFormatter = defaultValueFormatter,
        startEndOnly = false,
        showXAxis = true,
        showYAxis = true,
        yAxisWidth = "auto",
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
        allowDecimals = true,
        noDataText,
        className,
        ...other
    } = props;
    const [legendHeight, setLegendHeight] = useState(60);
    const categoryColors = constructCategoryColors(categories, colors);
    
    const yAxisDomain = getYAxisDomain(autoMinValue, minValue, maxValue);
    const [min, max] = getMinMax(data, categories)

    const constructedDomain = constructDomain(min, max, yAxisDomain[0], yAxisDomain[1])
    
    console.log(min, max);
    console.log(constructedDomain);

    console.log(findNumberWithLongestLength(constructedDomain?.map(e => valueFormatter(e))));
    const longestValue = findNumberWithLongestLength(constructedDomain?.map(e => valueFormatter(e)))
    const longestValueWidth = elementWidth(longestValue) + (0.25 * parseFloat(getComputedStyle(document.documentElement).fontSize));
    
    
    // const longestValue = getLongestValue(data, categories)

    // const calculatedYAxisWidth = getYAxisWidth(yAxisWidth, longestValue ? valueFormatter(longestValue) : undefined)
    
    return (
        <div ref={ref} className={tremorTwMerge("w-full h-80", className)} {...other}>
            <span className="tabular-nums text-tremor-label">{longestValue}</span>
            <ResponsiveContainer className="h-full w-full">
                {data?.length ? (
                    <ReChartsAreaChart data={data}>
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
                            width={longestValueWidth}
                            hide={!showYAxis}
                            axisLine={false}
                            tickLine={false}
                            type="number"
                            domain={yAxisDomain as AxisDomain}
                            // tick={{ transform: "translate(-3, 0)" }}
                            tick={(props: any) =>  {
                                // console.log(props);
                                return (
                                    <foreignObject 
                                        x={0} 
                                        y={props.y - 9} 
                                        width={props.width} 
                                        height={props.height}
                                    >
                                        <div 
                                            className={
                                                tremorTwMerge(
                                                    // common
                                                    "text-tremor-label",
                                                    // light
                                                    "text-tremor-content",
                                                    // dark
                                                    "dark:text-dark-tremor-content",
                                                    //auto size
                                                    "overflow-hidden text-ellipsis text-right mr-1",
                                                )
                                            }
                                            title={valueFormatter(props.payload.value)}
                                        >
                                            {valueFormatter(props.payload.value)}
                                        </div> 
                                    </foreignObject>
                                )
                            }}
                            fill=""
                            stroke=""
                            className={tremorTwMerge(
                                // common
                                "text-tremor-label whitespace-nowrap",
                            )}
                            // tickFormatter={valueFormatter}
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
                        {categories.map((category) => {
                            return (
                                <defs key={category}>
                                    {showGradient ? (
                                        <linearGradient
                                            className={
                                                getColorClassNames(
                                                    categoryColors.get(category) ?? BaseColors.Gray,
                                                    colorPalette.text,
                                                ).textColor
                                            }
                                            id={categoryColors.get(category)}
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
                                                    categoryColors.get(category) ?? BaseColors.Gray,
                                                    colorPalette.text,
                                                ).textColor
                                            }
                                            id={categoryColors.get(category)}
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
                        {categories.map((category) => (
                            <Area
                                className={
                                    getColorClassNames(
                                        categoryColors.get(category) ?? BaseColors.Gray,
                                        colorPalette.text,
                                    ).strokeColor
                                }
                                activeDot={{
                                    className: tremorTwMerge(
                                        "stroke-tremor-background dark:stroke-dark-tremor-background",
                                        getColorClassNames(
                                            categoryColors.get(category) ?? BaseColors.Gray,
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
                                fill={`url(#${categoryColors.get(category)})`}
                                strokeWidth={2}
                                strokeLinejoin="round"
                                strokeLinecap="round"
                                isAnimationActive={showAnimation}
                                animationDuration={animationDuration}
                                stackId={stack ? "a" : undefined}
                                connectNulls={connectNulls}
                            />
                        ))}
                    </ReChartsAreaChart>
                ) : (
                    <NoData noDataText={noDataText} />
                )}
            </ResponsiveContainer>
        </div>
    );
});

AreaChart.displayName = "AreaChart";

export default AreaChart;
