import stripAnsi from 'strip-ansi';
import table from 'text-table';

class TableGenerator {
  // #region Taken directly from table.Options

  /** Separator to use between columns, (default: ' '). */
  hsep?: string | undefined;

  /** An array of alignment types for each column, default ['l','l',...]. */
  align?: Array<'l' | 'r' | 'c' | '.' | null | undefined> | undefined;

  /** A callback function to use when calculating the string length. */
  stringLength?(str: string): number;

  // #endregion

  public generate(data: Record<string, string>[] | string[][]): string {
    const rows: string[][] = [];

    if (typeof data[0] === 'object') {
      const keys = new Set<string>();

      for (const row of data) {
        for (const key of Object.keys(row)) {
          keys.add(key);
        }
      }

      const header = Array.from(keys);

      rows.push(header);

      for (const inRow of data as Record<string, string>[]) {
        const outRow = header.map((key) => inRow[key] ?? '');

        rows.push(outRow);
      }
    }

    return table(rows, {
      hsep: this.hsep,
      align: this.align,
      stringLength: this.stringLength,
    });
  }
}

const generator = new TableGenerator();
generator.stringLength = (string) => stripAnsi(string).length;

export function createTable(data: Record<string, string>[] | string[][]) {
  return generator.generate(data);
}
