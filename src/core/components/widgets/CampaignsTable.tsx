import React from 'react';
import { Ban, LucideIcon } from 'lucide-react';

export interface TableColumn<T> {
  header: string;
  key: string;
  align?: 'left' | 'center' | 'right';
  render: (row: T) => React.ReactNode;
}

interface CampaignsTableProps<T> {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  iconColorClass?: string;
  columns: TableColumn<T>[];
  data: T[];
  emptyMessage?: string;
  className?: string;
}

export const CampaignsTable = <T extends { id: string | number }>({
  title,
  subtitle,
  icon: Icon,
  iconColorClass = 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  columns,
  data,
  emptyMessage = 'No hay datos disponibles en este periodo',
  className = '',
}: CampaignsTableProps<T>) => {
  const hasData = data && data.length > 0;

  if (!hasData) {
    return (
      <div className={`main-container-color border-primary flex flex-col items-center justify-center rounded-xl border py-16 shadow-sm ${className}`}>
        <div className="mb-4 rounded-full bg-gray-50 p-4 dark:bg-gray-800">
          <Ban className="h-8 w-8 text-gray-300 dark:text-gray-600" />
        </div>
        <p className="text-strong text-sm font-medium">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`main-container-color border-primary flex flex-col rounded-xl border shadow-sm ${className}`}>
      <div className="border-primary flex items-center gap-3 border-b p-6">
        <div className={`rounded-md p-2 ${iconColorClass}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-strong text-lg font-bold">{title}</h3>
          <p className="text-low text-xs font-medium">{subtitle}</p>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-primary border-b bg-gray-50/50 text-xs uppercase tracking-wider dark:bg-gray-900/20">
            <tr>
              {columns.map(col => (
                <th key={col.key} scope="col" className={`text-low px-6 py-4 font-semibold ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-primary">
            {data.map(row => (
              <tr key={row.id} className="transition-colors hover:bg-gray-50/80 dark:hover:bg-gray-800/40">
                {columns.map(col => (
                  <td key={`${row.id}-${col.key}`} className={`whitespace-nowrap px-6 py-4 ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}`}>
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CampaignsTable;
