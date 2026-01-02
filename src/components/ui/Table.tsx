/**
 * Table Component
 * Reusable table with glassmorphism design
 */

import type { ReactNode } from 'react';
import { IconSortAscending, IconSortDescending } from '@tabler/icons-react';

export interface TableColumn<T> {
  key: string;
  header: string;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  render?: (row: T) => ReactNode;
  width?: string;
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
  onSort?: (field: string) => void;
  emptyMessage?: string;
  className?: string;
}

export function Table<T extends { id: string }>({
  columns,
  data,
  onRowClick,
  sortField,
  sortOrder,
  onSort,
  emptyMessage = 'No data available',
  className = '',
}: TableProps<T>) {
  const handleSort = (column: TableColumn<T>) => {
    if (column.sortable && onSort) {
      onSort(column.key);
    }
  };

  const getAlignClass = (align?: 'left' | 'center' | 'right') => {
    switch (align) {
      case 'center':
        return 'text-center';
      case 'right':
        return 'text-right';
      default:
        return 'text-left';
    }
  };

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full">
        <thead className="bg-white/50 backdrop-blur-xl border-b border-white/40">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-6 py-3 ${getAlignClass(column.align)} text-xs font-semibold text-gray-700 uppercase tracking-wider ${
                  column.sortable ? 'cursor-pointer hover:bg-white/80 transition-colors' : ''
                }`}
                onClick={() => column.sortable && handleSort(column)}
                style={column.width ? { width: column.width } : undefined}
              >
                <div className={`flex items-center gap-2 ${column.align === 'center' ? 'justify-center' : column.align === 'right' ? 'justify-end' : ''}`}>
                  <span>{column.header}</span>
                  {column.sortable && sortField === column.key && (
                    sortOrder === 'asc' ? (
                      <IconSortAscending size={14} />
                    ) : (
                      <IconSortDescending size={14} />
                    )
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/30">
          {data.map((row) => (
            <tr
              key={row.id}
              className={`hover:bg-white/50 transition-all duration-200 backdrop-blur-sm ${
                onRowClick ? 'cursor-pointer' : ''
              }`}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={`px-6 py-4 ${getAlignClass(column.align)}`}
                >
                  {column.render
                    ? column.render(row)
                    : (row as any)[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {data.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">{emptyMessage}</p>
        </div>
      )}
    </div>
  );
}
