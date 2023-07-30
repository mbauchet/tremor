"use client";
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
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
import { CurveType } from "../../../lib/inputTypes";
import { useZoomAndPan } from "hooks/useZoomAndPan";
import { Icon } from "components/icon-elements";
import MinusIcon from "assets/MinusIcon";
import PlusIcon from "assets/PlusIcon";
import ZoomInIcon from "assets/ZoomInIcon";
import ZoomOutIcon from "assets/ZoomOutIcon";

export interface AreaChartProps extends BaseChartProps {
    stack?: boolean;
    curveType?: CurveType;
    connectNulls?: boolean;
    resize?: boolean;
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
        allowDecimals = true,
        noDataText,
        className,
        resize = false,
        ...other
    } = props;
    const [legendHeight, setLegendHeight] = useState(60);
    const categoryColors = constructCategoryColors(categories, colors);

    const yAxisDomain = getYAxisDomain(autoMinValue, minValue, maxValue);

    const [loaded, setLoaded] = useState(false);
    //   const [xPadding, setXPadding] = useState([0, 0]);

    //   const zoomOut = useCallback(() => {
    //     setXPadding((p) => {
    //       const [left, right] = p;
    //       return [Math.min(left + 50, 0), Math.min(right + 50, 0)];
    //     });
    //   }, []);

    //   const zoomIn = useCallback(() => {
    //     setXPadding((p) => {
    //       const [left, right] = p;
    //       return [Math.max(left - 50, -500), Math.max(right - 50, -500)];
    //     });
    //   }, []);

    const {
        xPadding,
        onChartMouseDown,
        onChartMouseUp,
        setWrapperRef,
        onChartMouseMove,
        zoomIn,
        zoomOut,
        resetZoom
    } = useZoomAndPan({});

    return (
        <>
            {resize ? (
                <div className="flex justify-end gap-2 flex-wrap">
                    {(xPadding[0] !== 0 || xPadding[1] !== 0) ? (
                            <button
                                className="
                                    flex items-center justify-center 
                                    p-1 h-7 w-fit	 
                                    outline-none focus:ring-2 transition duration-100 border 
                                    border-tremor-border dark:border-dark-tremor-border 
                                    hover:bg-tremor-background-muted dark:hover:bg-dark-tremor-background-muted 
                                    rounded-tremor-small focus:border-tremor-brand-subtle dark:focus:border-dark-tremor-brand-subtle focus:ring-tremor-brand-muted dark:focus:ring-dark-tremor-brand-muted text-tremor-content-subtle dark:text-dark-tremor-content-subtle hover:text-tremor-content dark:hover:text-dark-tremor-content"
                                type="button"
                                onClick={resetZoom}
                                title="Reset to default zoom"
                            >
                                Reset
                            </button>
                    ) : (
                        null
                    )}
                    <button
                        className="
                            flex 
                            items-center 
                            justify-center 
                            p-1 
                            h-7 
                            w-7 
                            outline-none focus:ring-2 transition duration-100 
                            border 
                            border-tremor-border dark:border-dark-tremor-border 
                            hover:bg-tremor-background-muted dark:hover:bg-dark-tremor-background-muted 
                            rounded-tremor-small focus:border-tremor-brand-subtle dark:focus:border-dark-tremor-brand-subtle focus:ring-tremor-brand-muted dark:focus:ring-dark-tremor-brand-muted text-tremor-content-subtle dark:text-dark-tremor-content-subtle hover:text-tremor-content dark:hover:text-dark-tremor-content
                            disabled:opacity-50 disabled:cursor-not-allowed
                            "
                        type="button"
                        disabled={xPadding[0] === 0 && xPadding[1] === 0}
                        onClick={zoomOut}
                        title="Zoom out"
                    >
                        <ZoomOutIcon />
                    </button>
                    <button
                        className="
                flex 
                items-center 
                justify-center 
                p-1 
                h-7 
                w-7 
                outline-none focus:ring-2 transition duration-100 
                border 
                border-tremor-border dark:border-dark-tremor-border 
                hover:bg-tremor-background-muted dark:hover:bg-dark-tremor-background-muted 
                rounded-tremor-small focus:border-tremor-brand-subtle dark:focus:border-dark-tremor-brand-subtle focus:ring-tremor-brand-muted dark:focus:ring-dark-tremor-brand-muted text-tremor-content-subtle dark:text-dark-tremor-content-subtle hover:text-tremor-content dark:hover:text-dark-tremor-content
                disabled:opacity-50 disabled:cursor-not-allowed
                "
                        type="button"
                        disabled={xPadding[0] === -500 || xPadding[1] === -500}
                        onClick={zoomIn}
                        title="Zoom in"
                    >
                        <ZoomInIcon />
                    </button>
                </div>
            ) : (
                null
            )}
        <div ref={ref} className={tremorTwMerge("w-full h-80", className)} {...other}>

            <ResponsiveContainer className="h-full w-full"
                ref={setWrapperRef}
            >
                {data?.length ? (
                    <ReChartsAreaChart data={data}
                        onMouseMove={onChartMouseMove}
                        onMouseDown={onChartMouseDown}
                        onMouseUp={onChartMouseUp}
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
                            //   padding={{ left: 10, right: 10 }}
                            padding={{ left: xPadding[0], right: xPadding[1] }}
                            minTickGap={5}
                            allowDataOverflow={true}
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
        </>
    );
});

AreaChart.displayName = "AreaChart";

export default AreaChart;
