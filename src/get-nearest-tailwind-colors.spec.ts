import { getNearestTailwindColors } from "./get-nearest-tailwind-colors";

describe("getNearestTailwindColors", () => {
  it("should throw a TypeError if the input color is invalid", () => {
    const inputColor = "invalid";

    expect(() => getNearestTailwindColors(inputColor)).toThrow(TypeError);
  });

  it("should return the color from the Tailwind CSS palette with default config", () => {
    const inputColor = "black";

    const result = getNearestTailwindColors(inputColor);

    expect(result).toEqual([
      {
        color: "black",
        distance: 0,
        value: "#000",
      },
    ]);
  });

  it("should return the color from the Tailwind CSS palette (color name)", () => {
    const inputColor = "white";

    const result = getNearestTailwindColors(inputColor, { n: 1 });

    expect(result).toEqual([
      {
        color: "white",
        value: "#fff",
        distance: 0,
      },
    ]);
  });

  it("should return the color from the Tailwind CSS palette (hex)", () => {
    const inputColor = "#ffffff";

    const result = getNearestTailwindColors(inputColor, { n: 1 });

    expect(result).toEqual([
      {
        color: "white",
        distance: 0,
        value: "#fff",
      },
    ]);
  });

  it("should return the color from the Tailwind CSS palette (rgb)", () => {
    const inputColor = "rgb(255, 255, 255)";

    const result = getNearestTailwindColors(inputColor, { n: 1 });

    expect(result).toEqual([
      {
        color: "white",
        distance: 0,
        value: "#fff",
      },
    ]);
  });

  it("should return the 3 nearest colors from the Tailwind CSS palette", () => {
    const inputColor = "oklch(.577 .245 27.325)";

    const result = getNearestTailwindColors(inputColor, { n: 3 });

    expect(result).toEqual([
      {
        color: "red-600",
        distance: 0,
        value: "oklch(57.7% 0.245 27.325)",
      },
      {
        color: "red-500",
        distance: expect.closeTo(13.75),
        value: expect.any(String),
      },
      {
        color: "red-700",
        distance: expect.closeTo(14.42),
        value: expect.any(String),
      },
    ]);
  });

  it("should exclude color", () => {
    const inputColor = "oklch(.577 .245 27.325)";

    const result = getNearestTailwindColors(inputColor, {
      n: 3,
      excludeColors: ["red-600"],
    });

    expect(result).toEqual([
      {
        color: "red-500",
        distance: expect.closeTo(13.75),
        value: expect.any(String),
      },
      {
        color: "red-700",
        distance: expect.closeTo(14.42),
        value: expect.any(String),
      },
      {
        color: "orange-600",
        distance: expect.closeTo(15.84),
        value: expect.any(String),
      },
    ]);
  });

  it("should return the nearest colors in the rgb space", () => {
    const inputColor = "oklch(.577 .245 27.325)";

    const result = getNearestTailwindColors(inputColor, {
      space: "rgb",
      n: 3,
    });

    expect(result).toEqual([
      {
        color: "red-600",
        distance: 0,
        value: "oklch(57.7% 0.245 27.325)",
      },
      {
        color: "red-700",
        distance: expect.closeTo(38.21),
        value: expect.any(String),
      },
      {
        color: "rose-600",
        distance: expect.closeTo(52.24),
        value: expect.any(String),
      },
    ]);
  });

  it("should return the nearest colors given a custom palette", () => {
    const inputColor = "oklch(.577 .245 27.325)";
    const customPalette = {
      "custom-red": "red",
      "custom-green": "green",
      "custom-blue": "blue",
      "custom-cyan": "cyan",
      "custom-magenta": "magenta",
      "custom-yellow": "yellow",
    };

    const result = getNearestTailwindColors(inputColor, {
      colors: customPalette,
      n: 3,
      space: "rgb",
    });

    expect(result).toEqual([
      {
        color: "custom-red",
        distance: expect.closeTo(26.4),
        value: "red",
      },
      {
        color: "custom-magenta",
        distance: expect.closeTo(245.18),
        value: "magenta",
      },
      {
        color: "custom-yellow",
        distance: expect.closeTo(256.36),
        value: "yellow",
      },
    ]);
  });
});
