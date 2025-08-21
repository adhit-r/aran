const tokens = {
  "colors.primary": {
    "value": "#ff6b35",
    "variable": "var(--colors-primary)"
  },
  "colors.secondary": {
    "value": "#f7931e",
    "variable": "var(--colors-secondary)"
  },
  "colors.accent": {
    "value": "#ff8a65",
    "variable": "var(--colors-accent)"
  },
  "colors.success": {
    "value": "#4caf50",
    "variable": "var(--colors-success)"
  },
  "colors.warning": {
    "value": "#ff9800",
    "variable": "var(--colors-warning)"
  },
  "colors.error": {
    "value": "#f44336",
    "variable": "var(--colors-error)"
  },
  "colors.colorPalette": {
    "value": "var(--colors-color-palette)",
    "variable": "var(--colors-color-palette)"
  }
}

export function token(path, fallback) {
  return tokens[path]?.value || fallback
}

function tokenVar(path, fallback) {
  return tokens[path]?.variable || fallback
}

token.var = tokenVar