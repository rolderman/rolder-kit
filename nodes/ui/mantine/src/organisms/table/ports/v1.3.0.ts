import { defaultUnits, getPort, getPorts, getType } from "@packages/port";

const inputs130 = [
  ...getPorts("input", [
    "customProps",
    "propsFunction",
    // Enablers
    "table2SingleSelection",
    "table2MultiSelection",
    "table2Sort",
    "table2FilterEnabled",
    "table2Expansion",
    "table2Layout",
    "table2TableStyles",
    "table2RowStyles",
    // Params
    "table2Columns",
    "table2OnRowClick",
    "table2TextSelection",
    // Data
    "table2Items",
    // Single selection
    "table2SingleSelectedItem",
    "table2Unselectable",
    "table2ResetSingleSelection",
    // Multi selection
    "table2MultiSelectedItems",
    "table2ResetMultiSelection",
    // Sort
    "table2SortType",
    "table2SortedIcon",
    "table2UnsortedIcon",
    "table2ResetSort",
    // Filter
    "table2FilterType",
    "table2ResetFilters",
    // Expansion
    "table2ExpandedItems",
    "table2AllowMultiple",
    "table2ExpandAll",
    "table2UnexpandAll",
    // Layout
    "table2NoHeader",
    // Dimensions
    "table2HorizontalSpacing",
    "table2VerticalSpacing",
    "table2FontSize",
    // Table styles
    "table2Shadow",
    "table2WithBorder",
    "table2BorderRadius",
    "table2ColumnBorders",
    "table2Animation",
    "table2LoaderColor",
    // Row styles
    "table2RowBorders",
    "table2Striped",
    "table2OddBgColor",
    "table2EvenBgColor",
    "table2RowBgColor",
    "table2HighlightOnHover",
    "table2OnHoverBgColor",
    "table2SingleSelectedRowBgColor",
    "table2MutliSelectedRowBgColor",
    // States
    "table2Fetching",
  ]),
  // Expansion
  getPort({
    plug: "input",
    name: "expansionTemplate",
    displayName: "Expansion template",
    group: "Expansion",
    type: "component",
    customs: {
      required: "both",
      dependsOn(p) {
        return p.table2Expansion ? true : false;
      },
    },
  }),
  // Dimensions
  getPort({
    plug: "input",
    name: "dimensions",
    group: "Enablers",
    type: getType("boolean", "editor"),
    displayName: "Dimensions",
    default: false,
  }),
  getPort({
    plug: "input",
    name: "minHeight",
    group: "Dimensions",
    type: { name: "number", units: ["rem", "px"], defaultUnit: "px" },
    default: 84,
    displayName: "Min height",
    customs: {
      dependsOn(p) {
        return p.dimensions ? true : false;
      },
    },
  }),
  getPort({
    plug: "input",
    name: "dynamicHeight",
    group: "Dimensions",
    type: "boolean",
    displayName: "Dynamic height",
    default: true,
    customs: {
      dependsOn(p) {
        return p.dimensions ? true : false;
      },
    },
  }),
  getPort({
    plug: "input",
    name: "height",
    group: "Dimensions",
    type: { name: "number", units: ["rem", "px"], defaultUnit: "rem" },
    displayName: "Height",
    customs: {
      dependsOn(p) {
        return !p.dynamicHeight && p.dimensions;
      },
    },
  }),
  getPort({
    plug: "input",
    name: "maxHeight",
    group: "Dimensions",
    type: { name: "number", units: defaultUnits, defaultUnit: "%" },
    displayName: "Max height",
    default: 100,
    customs: {
      dependsOn(p) {
        return p.dynamicHeight && p.dimensions;
      },
    },
  }),
];

const outputs130 = getPorts("output", [
  // Single selection
  "table2SingleSelectedItem",
  "table2SingleSelected",
  "table2SingleUnselected",
  // Multi selection
  "table2MultiSelectedItems",
  "table2MultiSelectionChanged",
  // Sort
  "table2SortValue",
  // Expansion
  "table2ExpandedItems",
  "table2ExpansionChanged",
  // Table Id and parentTableId
  "tableId",
  "parentTableId",
]);

export { inputs130, outputs130 };
