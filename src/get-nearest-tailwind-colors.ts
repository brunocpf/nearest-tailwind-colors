import tailwindCssColors from "tailwindcss/colors";
import flattenColorPalette from "tailwindcss/lib/util/flattenColorPalette";
import chroma from "chroma-js";

export interface GetNearestTailwindColorsConfig {
  /**
   * A color palette to search for the nearest color.
   * Defaults to the Tailwind CSS colors.
   */
  colors?: Record<string, string | { [key: string]: string }>;

  /**
   * A list of colors to exclude from the search.
   * Defaults to an empty array.
   */
  excludeColors?: string[];

  /**
   * The number of nearest colors to n from the palette.
   * Defaults to 1.
   */
  n?: number;

  /**
   * Color space to use.
   * Default to lab.
   */
  space?:
    | "cmyk"
    | "gl"
    | "hcg"
    | "hcl"
    | "hsi"
    | "hsl"
    | "hsv"
    | "lab"
    | "lch"
    | "oklab"
    | "oklch"
    | "rgb";
}

export interface ColorOutput {
  /**
   * The color name.
   */
  color: string;

  /**
   * The color value.
   */
  value: string;

  /**
   * The distance between the input color and this color.
   */
  distance: number;
}

const invalidColors = ["inherit", "current", "transparent"] as const;

/**
 * Calculates the nearest colors from the Tailwind CSS palette using the euclidean distance formula.
 * Throws a TypeError if the input color is invalid.
 * @param inputColor An input color. Can be any valid CSS color.
 * @param config A configuration object.
 * @returns An array of nearest colors from the Tailwind CSS palette.
 * The size of the array is determined by the `n` parameter, and it is ordered by proximity to the input color.
 */
export function getNearestTailwindColors(
  inputColor: string,
  {
    colors = tailwindCssColors,
    n = 1,
    excludeColors = [],
    space = "lab",
  }: GetNearestTailwindColorsConfig = {},
): ColorOutput[] {
  if (chroma.valid(inputColor) === false) {
    throw new TypeError("Invalid color input");
  }

  const flatColors = flattenColorPalette(colors);
  const colorsToExclude = [...invalidColors, ...excludeColors];
  const flatColorArray = Object.entries(flatColors)
    .filter(([key]) => colorsToExclude.includes(key) === false)
    .map(([key, value]) => ({
      key,
      value,
    }));

  const colorDistances: ColorOutput[] = flatColorArray.map(
    ({ key, value }) => ({
      color: key,
      value,
      distance: chroma.distance(inputColor, value, space),
    }),
  );

  return colorDistances.sort((a, b) => a.distance - b.distance).slice(0, n);
}
