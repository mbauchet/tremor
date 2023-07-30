import React, { useCallback, useEffect, useRef, useState } from "react";
import { CategoricalChartState } from "recharts/types/chart/generateCategoricalChart";
import { useResizeObserver } from "./useResizeObserver";

const CHART_AXIS_CLIP_PADDING = 50;

const CHART_CLASSES = {
  xAxis: "xAxis",
  grid: "recharts-cartesian-grid",
  line: "chart-line"
};



/**
 * Checks if an object has properties
 * @param potentialObj - The object to check for properties.
 * @param keys - An array of property names to check for in the object.
 * @returns {boolean} - Returns true if all the properties exist in the object, otherwise false.
 */
export function objHasProp<O extends Record<string, any>, K extends keyof O>(
    potentialObj: O,
    keys: K[]
  ): boolean {
    return keys.every((key) => key in potentialObj);
  }
  
  

const getZoomValues = (
  mousePosition: { x: number; width: number } | null,
  edgeTolerance = 0.05,
  zoomCoefficient = 0.25
) => {
  if (!mousePosition) {
    return { zoomLeft: 1, zoomRight: 1 };
  }

  const { x, width } = mousePosition;
  const zoomCoef = width * zoomCoefficient;
  let xToWidth = x / width;
  if (xToWidth <= edgeTolerance) {
    xToWidth = 0;
  } else if (xToWidth >= 1 - edgeTolerance) {
    xToWidth = 1;
  }

  const zoomLeft = xToWidth * zoomCoef;
  const zoomRight = zoomCoef - zoomLeft;
  return { zoomLeft, zoomRight };
};

export const useZoomAndPan = ({
  chartAxisClipPadding = CHART_AXIS_CLIP_PADDING,
}: {
  chartAxisClipPadding?: number;
}) => {
  const wrapperRef = useRef<null | HTMLElement>(null);
  const gridRef = useRef<SVGSVGElement | null>(null);
  const chartMouseDown = useRef<{ x: number; y: number } | null>(null);
  const chartXPaddingOnMouseDown = useRef<[number, number] | null>(null);
  const [xPadding, setXPadding] = useState<[number, number]>([0, 0]);
  const [mousePositionToGrid, setMousePositionToGrid] = useState<{
    x: number;
    width: number;
  } | null>(null);

  const setWrapperRef = useCallback((e: any) => {
    if (
      typeof e === "object" &&
      e !== null &&
      objHasProp(e, ["current"]) &&
      e.current instanceof HTMLElement
    ) {
      wrapperRef.current = e.current;
    }
  }, []);

  const setClipPaths = useCallback(
    (xAxis: SVGSVGElement) => {
      if (
        wrapperRef.current &&
        gridRef.current 
      ) {
       
        gridRef.current?.setAttribute("clip-path", "url(#chart-grid-clip)");
        xAxis.setAttribute("clip-path", "url(#chart-xaxis-clip)");
      }
    },
    [chartAxisClipPadding]
  );

  const resizeObserverCallback = useCallback(
    (e: any) => {
      if (wrapperRef.current) {
        const xAxis = wrapperRef.current.querySelector(
          `.${CHART_CLASSES.xAxis}`
        ) as SVGSVGElement | null;
        if (xAxis) {
          setClipPaths(xAxis);
        }
      }
    },
    [setClipPaths]
  );

  const unobserve = useResizeObserver({
    element: wrapperRef,
    callback: resizeObserverCallback,
    delay: 100
  });

  useEffect(() => () => unobserve());

  const chartPan = (state: CategoricalChartState, e: MouseEvent) => {
    if (
      chartMouseDown.current !== null &&
      state?.chartX &&
      state?.chartY &&
      chartXPaddingOnMouseDown.current
    ) {
      const xDistance = chartMouseDown.current.x - state.chartX;
      const [paddingLeft, paddingRight] = chartXPaddingOnMouseDown.current;

      const panPaddingLeft = paddingLeft - xDistance;
      const panPaddingRight = paddingRight + xDistance;

      if (panPaddingLeft > 0) {
        setXPadding(([, pr]) => [0, pr]);
        return;
      }
      if (panPaddingRight > 0) {
        setXPadding(([pl]) => [pl, 0]);
        return;
      }
      setXPadding([
        Math.min(paddingLeft - xDistance, 0),
        Math.min(paddingRight + xDistance, 0)
      ]);
    }
  };

  const onChartMouseMove = useCallback(
    (state: CategoricalChartState, e: MouseEvent) => {
      if (chartMouseDown.current !== null) chartPan(state, e);
    },
    []
  );

  const onChartMouseDown = useCallback(
    (state: CategoricalChartState, e: MouseEvent) => {
      if (state) {
        const { chartX, chartY } = state;
        if (typeof chartX === "number" && typeof chartY === "number") {
          chartMouseDown.current = { x: chartX, y: chartY };
          chartXPaddingOnMouseDown.current = xPadding;
        }
      }
    },
    [xPadding]
  );

  const onChartMouseUp = useCallback(() => {
    chartMouseDown.current = null;
    chartXPaddingOnMouseDown.current = null;
  }, []);

//   useEffect(() => {
//     if (chartLoaded && wrapperRef.current) {
//       const grid = wrapperRef.current.querySelector(
//         `.${CHART_CLASSES.grid}`
//       ) as SVGSVGElement | null;

//       const xAxis = wrapperRef.current.querySelector(
//         `.${CHART_CLASSES.xAxis}`
//       ) as SVGSVGElement | null;
//       gridRef.current = grid;
//       if (xAxis) setClipPaths(xAxis);
//     }
//   }, [chartLoaded, setClipPaths]);

  const zoomOut = useCallback(() => {
    setXPadding((p) => {
      const [left, right] = p;
      const { zoomRight, zoomLeft } = getZoomValues(mousePositionToGrid);
      return [Math.min(left + zoomLeft + 50, 0), Math.min(right + zoomRight + 50, 0)];
    });
  }, [mousePositionToGrid]);

  const zoomIn = useCallback(() => {
    setXPadding((p) => {
      const [left, right] = p;
      const { zoomRight, zoomLeft } = getZoomValues(mousePositionToGrid);
      return [Math.max(left - zoomLeft - 50, -500), Math.max(right - zoomRight - 50, -500)];
    });
  }, [mousePositionToGrid]);

  const resetZoom = useCallback(() => {
    setXPadding([0, 0]);
  }, [mousePositionToGrid]);

//   useEffect(() => {
//     const ref = wrapperRef.current;
//     const wheelHandler = (e: WheelEvent) => {
//       e.preventDefault();
//       const delta = Math.sign(e.deltaY);
//       if (delta < 0) {
//         zoomOut();
//       } else {
//         zoomIn();
//       }
//     };

//     if (chartLoaded && ref) {
//       ref.addEventListener("wheel", wheelHandler, { passive: false });
//     }

//     return () => {
//       if (ref) {
//         ref.removeEventListener("wheel", wheelHandler);
//       }
//     };
//   }, [chartLoaded, zoomIn, zoomOut]);

  return {
    wrapperRef,
    gridRef,
    xPadding,
    mousePositionToGrid,
    onChartMouseDown,
    onChartMouseUp,
    setWrapperRef,
    onChartMouseMove,
    zoomOut,
    zoomIn,
    resetZoom
  };
};
