/* eslint-disable */
export type Token = `colors.${ColorToken}` | `spacing.${SpacingToken}` | `fontSizes.${FontSizeToken}`

export type ColorPalette = "primary" | "gray" | "success" | "warning" | "error"

export type ColorToken = "primary.50" | "primary.100" | "primary.200" | "primary.300" | "primary.400" | "primary.500" | "primary.600" | "primary.700" | "primary.800" | "primary.900" | "primary.950" | "gray.50" | "gray.100" | "gray.200" | "gray.300" | "gray.400" | "gray.500" | "gray.600" | "gray.700" | "gray.800" | "gray.900" | "gray.950" | "success.50" | "success.100" | "success.200" | "success.300" | "success.400" | "success.500" | "success.600" | "success.700" | "success.800" | "success.900" | "success.950" | "warning.50" | "warning.100" | "warning.200" | "warning.300" | "warning.400" | "warning.500" | "warning.600" | "warning.700" | "warning.800" | "warning.900" | "warning.950" | "error.50" | "error.100" | "error.200" | "error.300" | "error.400" | "error.500" | "error.600" | "error.700" | "error.800" | "error.900" | "error.950" | "colorPalette.50" | "colorPalette.100" | "colorPalette.200" | "colorPalette.300" | "colorPalette.400" | "colorPalette.500" | "colorPalette.600" | "colorPalette.700" | "colorPalette.800" | "colorPalette.900" | "colorPalette.950"

export type SpacingToken = "18" | "88" | "128" | "-18" | "-88" | "-128"

export type FontSizeToken = "2xs" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl" | "8xl" | "9xl"

export type Tokens = {
		colors: ColorToken
		spacing: SpacingToken
		fontSizes: FontSizeToken
} & { [token: string]: never }

export type TokenCategory = "aspectRatios" | "zIndex" | "opacity" | "colors" | "fonts" | "fontSizes" | "fontWeights" | "lineHeights" | "letterSpacings" | "sizes" | "cursor" | "shadows" | "spacing" | "radii" | "borders" | "borderWidths" | "durations" | "easings" | "animations" | "blurs" | "gradients" | "breakpoints" | "assets"