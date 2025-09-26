import { getNearestTailwindColors } from "../get-nearest-tailwind-colors";
import { Command } from "commander";
import chalk from "chalk";
import chroma from "chroma-js";
import { z } from "zod";

const program = new Command();

const optionsSchema = z.object({
  number: z.number().int().positive(),
  exclude: z.array(z.string()),
  space: z.union([
    z.literal("cmyk"),
    z.literal("gl"),
    z.literal("hcg"),
    z.literal("hcl"),
    z.literal("hsi"),
    z.literal("hsl"),
    z.literal("hsv"),
    z.literal("lab"),
    z.literal("lch"),
    z.literal("oklab"),
    z.literal("oklch"),
    z.literal("rgb"),
  ]),
});

program
  .version("1.0.0")
  .description("Find the nearest Tailwind CSS colors to a given input color.")
  .argument(
    "<color>",
    "Input color in any valid CSS format (e.g., hex, rgb, hsl)",
  )
  .option(
    "-n, --number <number>",
    "Number of nearest colors to return",
    (val) => {
      return parseInt(val, 10);
    },
    1,
  )
  .option(
    "-e, --exclude <colors>",
    "Comma-separated list of colors to exclude",
    (val) => val.split(","),
    [],
  )
  .option("-s, --space <space>", "Color space to use", "lab")
  .action((color, options) => {
    try {
      const parsedOptions = optionsSchema.parse(options);

      const results = getNearestTailwindColors(color, {
        n: parsedOptions.number,
        excludeColors: parsedOptions.exclude,
        space: parsedOptions.space,
      });

      console.log(chalk.green("Nearest Tailwind colors:"));
      results.forEach(({ color, distance, value }) => {
        const hexColor = chroma(value).hex();
        console.log(
          `- ${color} - ${chalk.hex(hexColor)(value)} (distance: ${distance.toFixed(2)})`,
        );
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error(
          chalk.red("Error:"),
          error.issues.map((e) => e.message),
        );
      } else if (error instanceof TypeError) {
        console.error(chalk.red("Error:"), error.message);
      } else {
        console.error(chalk.red("An unexpected error occurred:"), error);
      }
      process.exit(1);
    }
  });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
