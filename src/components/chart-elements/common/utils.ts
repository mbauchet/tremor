import { Color } from "../../../lib/inputTypes";

export const constructCategoryColors = (
    categories: string[],
    colors: Color[],
): Map<string, Color> => {
    const categoryColors = new Map<string, Color>();
    categories.forEach((category, idx) => {
        categoryColors.set(category, colors[idx]);
    });
    return categoryColors;
};

export const getYAxisDomain = (
    autoMinValue: boolean,
    minValue: number | undefined,
    maxValue: number | undefined,
) => {
    const minDomain = autoMinValue ? "auto" : minValue ?? 0;
    const maxDomain = maxValue ?? "auto";
    return [minDomain, maxDomain];
};

export const constructCategories = (data: any[], color?: string): string[] => {
    if (!color) {
        return [];
    }

    const categories = new Set<string>();
    data.forEach((datum) => {
        categories.add(datum[color]);
    });
    return Array.from(categories);
};

export const getLongestValue = (data: any[], categories: string[]) => {
    let longestValue = undefined;

    for (const item of data) {
        for (const category of categories) {

            if (!longestValue || item[category] > longestValue) {
                longestValue = item[category];
            }
        }
    }
    return longestValue
}

export const getMinMax = (data: any[], categories: string[]) => {
    let [min, max] = [undefined, undefined];

    for (const item of data) {
        for (const category of categories) {
            if (!max || item[category] > max) {
                max = item[category];
            }

            if (!min || item[category] < min) {
                min = item[category];
            }
        }
    }
    return [min, max]
}

export const constructDomain = (min:number|undefined, max:number|undefined, minDomain:number|string, maxDomain:number|string) => {
    if(typeof minDomain === 'string' && minDomain !== "auto") return
    if(typeof maxDomain === 'string' && maxDomain !== "auto") return
    // If minDomain is "auto," set it to the closest value to min
    if (minDomain === "auto") {
      minDomain = min ?? 0;
    }
  
    // If maxDomain is "auto," set it to the closest value to max
    if (maxDomain === "auto") {
      maxDomain = max ?? 0;
    }
  
    // Calculate the step size
    const step = (maxDomain - minDomain) / 4;
    const factor = 0.05;
    const finalStep = Math.ceil(step / factor) * factor
    console.log(finalStep);
    
  
    // Initialize an array to store the result
    const result = [];
  
    // Distribute values within the specified domain
    for (let i = 0; i < 5; i++) {
      result.push(Number((minDomain + i * finalStep).toFixed(2)));
    //   result.push(minDomain + i * finalStep);
    }
  
    return result;
  }

  export function findNumberWithLongestLength(arr: string[]|undefined) {
    if (!arr || arr.length === 0) {
      return undefined; // Return undefined for an empty array
    }
  
    const numberWithLongestLength = arr.reduce((prev, current) => {
      const prevLength = elementWidth(prev);
      const currentLength = elementWidth(current);
  
      return currentLength > prevLength ? current : prev;
    });
  
    return numberWithLongestLength;
  }

export const elementWidth = (text: string |undefined) => {
    if(!text) return 0
    const span = document.createElement("span");
    span.style.font = 'normal 0.75rem ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
    span.textContent = text;
    // span.style.fontVariantNumeric = 'tabular-nums';
    span.style.position = 'absolute';
    span.style.visibility = 'hidden';
    document.body.appendChild(span);
    const width = span.offsetWidth;
    document.body.removeChild(span);
    return width
  }

export const getYAxisWidth = (axisWidth: number | "auto", text?: string, maxWidth: number = 100): number => {
    if (axisWidth !== "auto") return axisWidth
    if (!text) return 56

    const span = document.createElement("span");
    span.style.font = 'normal 0.75rem ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
    span.textContent = text;
    // span.style.fontVariantNumeric = 'tabular-nums';
    span.style.position = 'absolute';
    span.style.visibility = 'hidden';
    document.body.appendChild(span);
    const width = span.offsetWidth;
    document.body.removeChild(span);

    console.log(width);
    const yAxisCalculatedWidth = width + 2.1 + (0.25 * parseFloat(getComputedStyle(document.documentElement).fontSize));



    return yAxisCalculatedWidth < maxWidth ? yAxisCalculatedWidth : maxWidth
}
