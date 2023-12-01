import { Tabulator } from "tabulator-tables";

declare global {
  interface HTMLDivElement {
    tabulator: Tabulator;
  }
}
