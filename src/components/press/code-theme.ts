import type { ThemeRegistration } from "shiki";

/** "Lamp Black": a warm, low-contrast theme that reads like ink on newsprint. */
export const lampBlack: ThemeRegistration = {
  name: "lamp-black",
  type: "dark",
  colors: {
    "editor.background": "#1a1612",
    "editor.foreground": "#e8dcc4",
  },
  tokenColors: [
    { scope: ["comment", "punctuation.definition.comment"], settings: { foreground: "#8f8572", fontStyle: "italic" } },
    { scope: ["string", "constant.character.escape"], settings: { foreground: "#d9a868" } },
    { scope: ["keyword", "storage.type", "storage.modifier", "keyword.control"], settings: { foreground: "#c27a5a" } },
    { scope: ["entity.name.function", "support.function", "meta.function-call"], settings: { foreground: "#a8b38a" } },
    { scope: ["variable", "meta.definition.variable"], settings: { foreground: "#e8dcc4" } },
    { scope: ["variable.parameter"], settings: { foreground: "#d8c9ac", fontStyle: "italic" } },
    { scope: ["constant.numeric", "constant.language"], settings: { foreground: "#e0905c" } },
    { scope: ["entity.name.type", "support.type", "storage.type.class", "support.class", "entity.name.class"], settings: { foreground: "#8fa6c4" } },
    { scope: ["property", "support.type.property-name", "variable.other.property", "meta.object-literal.key"], settings: { foreground: "#c9b48c" } },
    { scope: ["punctuation", "delimiter", "meta.brace"], settings: { foreground: "#9a917f" } },
    { scope: ["entity.name.tag"], settings: { foreground: "#c27a5a" } },
    { scope: ["entity.other.attribute-name"], settings: { foreground: "#c9b48c", fontStyle: "italic" } },
    { scope: ["markup.inserted"], settings: { foreground: "#7fbf8f" } },
    { scope: ["markup.deleted"], settings: { foreground: "#e07a6a" } },
    { scope: ["markup.changed"], settings: { foreground: "#d9b45a" } },
    { scope: ["meta.diff.header", "meta.diff.range"], settings: { foreground: "#8fa6c4", fontStyle: "bold" } },
  ],
};
