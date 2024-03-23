import type { MantineTheme, Sx } from '@mantine/core';
import type { CSSProperties, ReactNode } from 'react';
import type { DataTableColumnTextAlignment } from './DataTableColumnTextAlignment';

export type DataTableColumn<T> = {
  /**
   * Column accessor; you can use dot-notation for nested objects property drilling
   * (i.e. `department.name` or `department.company.name`)
   */
  accessor: string;

  /**
   * Optional column header title; if not present, one will be generated by "humanizing"
   * the provided column accessor
   * (i.e. `firstName` -> `First name`; `user.firstName` -> `User first name`)
   */
  title?: ReactNode;

  /**
   * Custom cell data render function accepting the current record and its index in `records`
   */
  render?: (record: T, index: number) => ReactNode;

  /**
   * Column text alignment; defaults to `left`
   */
  textAlignment?: DataTableColumnTextAlignment;

  /**
   * If true, column will be sortable
   */
  sortable?: boolean;

  /**
   * If set to true, the column can be dragged.
   */
  draggable?: boolean;

  /**
   * If set to true, the column can be toggled.
   */
  toggleable?: boolean;

  /**
   * If set to true, the column can be resized.
   */
  resizable?: boolean;

  /**
   * If set to true, the column will be toggled by default.
   */
  defaultToggle?: boolean;

  /**
   * Optional node providing the user with filtering options.
   * If present, a filter button will be added to the column's header. Upon clicking that button,
   * a pop-over showing the provided node will be opened.
   *
   * Alternatively, a function returning a node can be provided. The function receives props with a `close`
   * method which allows programmatically closing the pop-over.
   *
   * ```tsx
   * // …
   * columns={[
   *   {
   *     accessor: 'name',
   *     filter: ({ close }) => {
   *       return <Stack>
   *         <Button onClick={() => { setFilter(undefined); close(); }}>Reset</Button>
   *       </Stack>
   *     },
   *   }
   * ]}
   * // …
   * ```
   *
   * Note: this property only takes care of rendering the node which provides the filtering options.
   * It is assumed that the actual filtering is performed somewhere in user code.
   */
  filter?: ReactNode | ((filterProps: { close: () => void }) => ReactNode);

  /**
   * If true, filter icon will be styled differently to indicate the filter is in effect.
   */
  filtering?: boolean;

  /**
   * Desired column width
   */
  width?: string | number;

  /**
   * If true, column will not be visible
   */
  hidden?: boolean;

  /**
   * If set, the column will only be visible according to the specified media query
   */
  visibleMediaQuery?: string | ((theme: MantineTheme) => string);

  /**
   * Optional class name passed to the column title
   */
  titleClassName?: string;

  /**
   * Optional style passed to the column title
   */
  titleStyle?: CSSProperties;

  /**
   * Optional style passed to the column title; see https://mantine.dev/styles/sx/
   */
  titleSx?: Sx;

  /**
   * Optional class name passed to each data cell in the column; can be a string or a function
   * receiving the current record and its index as arguments and returning a string
   */
  cellsClassName?: string | ((record: T, recordIndex: number) => string | undefined);

  /**
   * Optional style passed to each data cell in the column; can be a CSS properties object or
   * a function receiving the current record and its index as arguments and returning a CSS properties object
   */
  cellsStyle?: CSSProperties | ((record: T, recordIndex: number) => CSSProperties | undefined);

  /**
   * Optional style passed to each data cell in the column; see https://mantine.dev/styles/sx/
   */
  cellsSx?: Sx;

  /**
   * Optional function returning an object of custom attributes to be applied to each cell in the column.
   * Receives the current record and its index as arguments.
   * Useful for adding data attributes, handling middle-clicks, etc.
   */
  customCellAttributes?: (record: T, recordIndex: number) => Record<string, unknown>;

  /**
   * Optional column footer content; if at least one column has a footer, the table will display a footer row
   */
  footer?: ReactNode;

  /**
   * Optional class name passed to the column footer
   */
  footerClassName?: string;

  /**
   * Optional style passed to the column footer
   */
  footerStyle?: CSSProperties;

  /**
   * Optional style passed to the column footer; see https://mantine.dev/styles/sx/
   */
  footerSx?: Sx;
} & (
  | {
      /**
       * If true, cell content in this column will be truncated with ellipsis as needed and will not wrap
       * to multiple lines.
       * (i.e. `overflow: hidden; text-overflow: ellipsis`; `white-space: nowrap`)
       * On a column you can either set this property or `noWrap` but not both.
       */
      ellipsis?: boolean;

      noWrap?: never;
    }
  | {
      ellipsis?: never;

      /**
       * If true, cell content in this column will not wrap to multiple lines
       * (i.e. `white-space: nowrap`)
       * On a column you can either set this property or `ellipsis` but not both.
       */
      noWrap?: boolean;
    }
);
