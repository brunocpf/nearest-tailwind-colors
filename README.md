# `nearest-tailwind-colors`

<a href="https://www.npmjs.com/package/nearest-tailwind-colors">
  <img alt="npm version" src="https://img.shields.io/npm/v/nearest-tailwind-colors">
</a>

[Demo](https://bruno-fernandes.dev/demos/nearest-tailwind-colors)

## Overview

`getNearestTailwindColors` is a utility function that calculates the nearest colors from the Tailwind CSS palette using the Euclidean distance formula. It allows customization of the color palette, filtering of specific colors, and choice of color space.

This is very useful to quickly find a similar color in the Tailwind CSS palette even when you have a color in another format (e.g., hex, rgb, hsl).

It supports Tailwind V4.0.0 and later (including the oklch color palette), and requires it to be installed as a dependency.

This package also comes with a handy CLI that can be used to find the nearest Tailwind CSS color from the command line.

## Installation

```bash
npm install nearest-tailwind-colors
```

## Usage

```typescript
import { getNearestTailwindColors } from "nearest-tailwind-colors";

const nearestColors = getNearestTailwindColors("rgb(255, 0, 255)", {
  n: 3,
});

console.log(nearestColors);
```

Output:

```json
[
  {
    "color": "fuchsia-500",
    "distance": 11.261094977568705,
    "value": "oklch(0.667 0.295 322.15)"
  },
  {
    "color": "fuchsia-600",
    "distance": 17.356736553911723,
    "value": "oklch(0.591 0.293 322.896)"
  },
  {
    "color": "fuchsia-400",
    "distance": 30.005412890734906,
    "value": "oklch(0.74 0.238 322.16)"
  }
]
```

## CLI Usage

A CLI tool is available to quickly find the nearest Tailwind CSS colors from the command line.

### Usage

To install it globally:

```sh
npm install -g nearest-tailwind-colors
```

Then you can run it like this:

```sh
nearest-tailwind-colors <color> [options]
```

You may also use `npx` to run it immediately:

```sh
npx nearest-tailwind-colors <color> [options]
```

### Example

```sh
npx nearest-tailwind-colors "yellow" --number 3
```

### Options

- `-n, --number <number>`: Number of nearest colors to return (default: `1`)
- `-e, --exclude <colors>`: Comma-separated list of colors to exclude
- `-s, --space <space>`: Color space to use (`lab`, `rgb`, etc.)

### Example Output

```sh
Nearest Tailwind colors:
- yellow-300 - oklch(0.905 0.182 98.111) (distance: 20.34)
- amber-300 - oklch(0.879 0.169 91.605) (distance: 30.15)
- yellow-400 - oklch(0.852 0.199 91.936) (distance: 32.24)
```

## Function Signature

```typescript
function getNearestTailwindColors(
  inputColor: string,
  config?: getNearestTailwindColorsConfig,
): ColorOutput[];
```

## Parameters

### `inputColor` (string) _(Required)_

A valid CSS color (e.g., hex, rgb, hsl) that will be compared against the Tailwind CSS palette or a custom color set.

### `config` (getNearestTailwindColorsConfig) _(Optional)_

An optional configuration object that customizes the behavior of the function.

#### Properties of `config`:

- **`colors`** (`Record<string, string | Record<string, string>>`)

  - A custom color palette to search for the nearest color.
  - Defaults to the Tailwind CSS colors.

- **`excludeColors`** (`string[]`)

  - A list of colors to exclude from the search.
  - Defaults to an empty array.

- **`n`** (`number`)

  - The number of nearest colors to return.
  - Defaults to `1`.

- **`space`** (`"cmyk" | "gl" | "hcg" | "hcl" | "hsi" | "hsl" | "hsv" | "lab" | "lch" | "oklab" | "oklch" | "rgb"`)
  - The color space used for comparison.
  - Defaults to `"lab"`.

## Return Value

An array of objects representing the nearest colors from the specified palette, ordered by proximity to the input color. The size of the array is determined by the `n` property in the configuration object.

### `ColorOutput[]`

Each object in the array has the following properties:

#### Properties:

- **`color`** (`string`)

  - The matched color name.

- **`value`** (`string`)

  - The matched color value.

- **`distance`** (`number`)

  - The computed distance between the input color and the matched color.

## Errors

- Throws a `TypeError` if the input color is invalid or not recognized.

## Advanced Usage

### Using custom colors from the Tailwind CSS theme

If you have custom colors in your Tailwind CSS theme, you may want to take them into account by using the `colors` property of the configuration object. To do so, you need to access the color values by resolving the equivalent CSS variable value in JavaScript, using `getComputedStyle` on the document root.

```typescript
import colors from "tailwindcss/colors";
import { getNearestTailwindColors } from "nearest-tailwind-colors";

const styles = getComputedStyle(document.documentElement);
const customColorNames = ["custom-1", "custom-2", "custom-3"];
const customColors = customColorNames.reduce((acc, name) => {
  acc[name] = styles.getPropertyValue(`--color-${name}`);
  return acc;
}, {});

const nearestColors = getNearestTailwindColors("rgb(255, 0, 0)", {
  colors: {
    ...colors,
    ...customColors,
  },
});
```

## Notes

- The `distance` value is calculated using Euclidean distance based on the selected color space. The RGB color space will yield different results than the LAB color space, for example.

## See Also

- [Color difference](https://en.wikipedia.org/wiki/Color_difference)
- [Tailwind CSS Color Palette](https://tailwindcss.com/docs/customizing-colors)

## License

MIT
