/* eslint-disable */
export type Token = "colors.primary" | "colors.secondary" | "colors.accent" | "colors.success" | "colors.warning" | "colors.error" | "colors.colorPalette"

export type ColorPalette = "primary" | "secondary" | "accent" | "success" | "warning" | "error"

export type ColorToken = "primary" | "secondary" | "accent" | "success" | "warning" | "error" | "colorPalette"

export type Tokens = {
		colors: ColorToken
} & { [token: string]: never }

export type TokenCategory = "aspectRatios" | "zIndex" | "opacity" | "colors" | "fonts" | "fontSizes" | "fontWeights" | "lineHeights" | "letterSpacings" | "sizes" | "shadows" | "spacing" | "radii" | "borders" | "borderWidths" | "durations" | "easings" | "animations" | "blurs" | "gradients" | "breakpoints" | "assets"