import { ColumnDefinition } from "react-tabulator";

export const CONSUMER_PROPERTY_LIST: ColumnDefinition[] = [
  {
    title: "Key",
    headerTooltip: true,
    width: 150,
    field: "key",
    hozAlign: "left",
  },
  {
    title: "Value",
    headerTooltip: true,
    width: 150,
    field: "value",
    hozAlign: "left",
  },
];
