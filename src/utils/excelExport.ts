/**
 * Excel & CSV Export Utility for Mannat Enterprise Pvt Ltd
 * Outputs professional formatted CSV with UTF-8 BOM so Microsoft Excel
 * automatically opens it in structured columns with proper numbers and text formatting.
 */

export interface ExportColumn<T> {
  header: string;
  key: keyof T | string;
  format?: (value: any, item: T) => string | number;
}

export function exportToExcel<T extends Record<string, any>>(
  filename: string,
  columns: ExportColumn<T>[],
  data: T[],
  sheetTitle: string = 'Report'
) {
  if (!data || data.length === 0) {
    alert('No records available to export.');
    return;
  }

  // Header line
  const headers = columns.map((col) => escapeCsvCell(col.header)).join(',');

  // Data rows
  const rows = data.map((item) => {
    return columns
      .map((col) => {
        let val: any;
        if (typeof col.key === 'string' && col.key.includes('.')) {
          const keys = col.key.split('.');
          val = keys.reduce((acc, k) => (acc ? acc[k] : undefined), item);
        } else {
          val = item[col.key as keyof T];
        }

        if (col.format) {
          val = col.format(val, item);
        }

        return escapeCsvCell(val);
      })
      .join(',');
  });

  // Include Company Header + Metadata + Data
  const timestamp = new Date().toLocaleString('en-IN');
  const csvContent =
    '\uFEFF' + // UTF-8 Byte Order Mark for Microsoft Excel
    `"MANNAT ENTERPRISE PVT LTD - OFFICIAL FINANCIAL EXPORT"\n` +
    `"Report: ${sheetTitle}","Generated: ${timestamp}","Total Records: ${data.length}"\n\n` +
    headers +
    '\n' +
    rows.join('\n');

  // Trigger browser download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename.replace(/\.csv$/, '')}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function escapeCsvCell(val: any): string {
  if (val === null || val === undefined) {
    return '""';
  }
  const str = String(val).trim();
  // Escape internal double quotes by doubling them
  const escaped = str.replace(/"/g, '""');
  // If the cell contains comma, newline, or quotes, or looks like a card number, wrap in quotes
  return `"${escaped}"`;
}
