import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { TradeJournalEntry } from '@/app/types';
import useTable from '@/app/hooks/useTable';
import Spacer from '../common/spacer';


interface TradeJournalTableProps {
  entries: TradeJournalEntry[];
  onAddEntry: () => void, 
  onDeleteEntry: (entryId: number) => void;
  onOpenEntry: (entry: TradeJournalEntry) => void;

}

interface Filters {
  type: string;
  sentiment: string;
  symbol: string;
}

interface FiltersProps {
  filters: Filters;
  updateFilter: (filterName: string, value: string) => void;
}

const filterOptions = [
  {
    name: 'type',
    value: 'Type',
    options: [
      { value: '', label: 'Type' },
      { value: 'buy', label: 'Buy' },
      { value: 'sell', label: 'Sell' },
    ],
  },
  {
    name: 'sentiment',
    value: 'Sentiment',
    options: [
      { value: '', label: 'Sentiment' },
      { value: 'bullish', label: 'Bullish' },
      { value: 'bearish', label: 'Bearish' },
      { value: 'neutral', label: 'Neutral' },
    ],
  },
];

const TableFilters = ({ filters, updateFilter }: FiltersProps) => {
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    updateFilter(event.target.name, event.target.value);
  };

  return (
    <div className="flex space-x-2 rounded-full text-sm">
      {filterOptions.map((filter) => (
        <select
          key={filter.name}
          name={filter.name}
          value={filters[filter.name as keyof Filters]}
          onChange={handleSelectChange}
          className="flex items-center px-2 py-1 rounded-full shadow bg-gray-200 dark:bg-gray-800"
        >
          {filter.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ))}
    </div>
  );
};

export default function TradeJournalTable({ entries,  onAddEntry, onDeleteEntry, onOpenEntry }: TradeJournalTableProps) {
  const {
    currentEntries,
    currentPage,
    itemsPerPage,
    filters,
    searchTerm,
    updateSearchTerm,
    updateFilter,
    changePage,
  } = useTable(entries);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateSearchTerm(event.target.value);
  };

  return (
    <div className="w-full relative container mx-auto p-4 min-h-screen">
      <div className="w-full flex flex-col md:flex-row justify-between items-start mb-4 gap-4">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search entries"
          className="w-full max-w-xs bg-transparent border border-neutral-400 dark:border-gray-700 text-sm p-1 rounded"
        />
        <div className='flex flex-row items-center gap-2'>
        <button
          onClick={onAddEntry}
          className="flex items-center px-2 py-1 rounded-full shadow bg-emerald-500 text-sm "
        >Add entry</button>
          <TableFilters filters={filters} updateFilter={updateFilter} />
        </div>
      </div>
      <Spacer/>
      <table className="min-w-full border border-neutral-400 dark:border-gray-700 text-sm">
        <thead>
          <tr className='bg-gray-200 dark:bg-gray-800'>
            <th className="p-2 border-b border-r border-neutral-400 dark:border-gray-700"></th>
            <th className="p-2 border-b border-r border-neutral-400 dark:border-gray-700">Trade Date</th>
            <th className="p-2 border-b border-r border-neutral-400 dark:border-gray-700">Symbol</th>
            <th className="p-2 border-b border-r border-neutral-400 dark:border-gray-700">Type</th>
            <th className="p-2 border-b border-r border-neutral-400 dark:border-gray-700">Quantity</th>
            <th className="p-2 border-b border-r border-neutral-400 dark:border-gray-700">Entry Price</th>
            <th className="p-2 border-b border-r border-neutral-400 dark:border-gray-700">Stop Loss</th>
            <th className="p-2 border-b border-r border-neutral-400 dark:border-gray-700">Take Profit</th>
            <th className="p-2 border-b border-r border-neutral-400 dark:border-gray-700">Sentiment</th>
            <th className="p-2 border-b border-r border-neutral-400 dark:border-gray-700">Comments</th>
          </tr>
        </thead>
        <tbody>
          {currentEntries.map((entry) => (
            <tr
              key={entry.entryId}
              className={`hover:bg-gray-700`}
              onClick={() => onOpenEntry(entry)}
            >
              <td className="p-2 border-b border-r border-neutral-400 dark:border-gray-700">{entry.entryId}</td>
              <td className="p-2 border-b border-r border-neutral-400 dark:border-gray-700">{new Date(entry.tradeDate).toDateString()}</td>
              <td className="p-2 border-b border-r border-neutral-400 dark:border-gray-700">{entry.symbol}</td>
              <td className="p-2 border-b border-r border-neutral-400 dark:border-gray-700">{entry.type}</td>
              <td className="p-2 border-b border-r border-neutral-400 dark:border-gray-700">{entry.quantity}</td>
              <td className="p-2 border-b border-r border-neutral-400 dark:border-gray-700">{entry.entryPrice}</td>
              <td className="p-2 border-b border-r border-neutral-400 dark:border-gray-700">{entry.stopLoss ?? '-'}</td>
              <td className="p-2 border-b border-r border-neutral-400 dark:border-gray-700">{entry.takeProfit ?? '-'}</td>
              <td className="p-2 border-b border-r border-neutral-400 dark:border-gray-700">{entry.sentiment ?? '-'}</td>
              <td className="p-2 border-b border-r border-neutral-400 dark:border-gray-700">{entry.comments ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination Controls */}
      <div className="absolute bottom-4 right-0 left-0 flex justify-center items-center mt-4">
        {/* Previous Button */}
        {currentPage > 1 && (
          <button
            className="p-2 bg-gray-200 dark:bg-gray-800 bg-gray-800 rounded"
            onClick={() => changePage(currentPage - 1)}
          >
            <FontAwesomeIcon icon={faChevronLeft} className='w-4 h-4' />
          </button>
        )}
        
        <span className="mx-2">Page {currentPage}</span>
        {currentEntries.length === itemsPerPage && (
          <button
            className="p-2 bg-gray-200 dark:bg-gray-800 rounded"
            onClick={() => changePage(currentPage + 1)}
          >
            <FontAwesomeIcon icon={faChevronRight} className='w-4 h-4' />
          </button>
        )}
      </div>
    </div>
  );
}
