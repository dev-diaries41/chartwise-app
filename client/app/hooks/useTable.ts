import { useState, useMemo } from 'react';
import { TradeJournalEntry } from '../types';


const useTable = (entries: TradeJournalEntry[]) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    sentiment: '',
    symbol: ''
  });

  // Calculate filtered entries based on search and filters
  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      const matchesSearchTerm = entry.symbol.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilters = (
        (!filters.type || entry.type === filters.type) &&
        (!filters.sentiment || entry.sentiment === filters.sentiment) &&
        (!filters.symbol || entry.symbol === filters.symbol)
      );
      return matchesSearchTerm && matchesFilters;
    });
  }, [entries, searchTerm, filters]);

  const indexOfLastEntry = currentPage * itemsPerPage;
  const indexOfFirstEntry = indexOfLastEntry - itemsPerPage;
  const currentEntries = filteredEntries.slice(indexOfFirstEntry, indexOfLastEntry);

  const changePage = (page: number) => {
    setCurrentPage(page);
  };

  const updateFilter = (filterName: string, value: string) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterName]: value
    }));
  };

  const updateSearchTerm = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page on search
  };

  return {
    currentEntries,
    currentPage,
    itemsPerPage,
    changePage,
    filters,
    updateFilter,
    searchTerm,
    updateSearchTerm
  };
};

export default useTable;
