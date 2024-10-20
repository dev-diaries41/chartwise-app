import { Filters, FiltersProps } from "@/app/types";

export default function TableFilters({ filters, filterOptions, updateFilter }: FiltersProps) {
    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      updateFilter(event.target.name, event.target.value);
    };
  
    return (
      <div className="flex space-x-2 rounded-full text-sm ">
        {filterOptions.map((filter) => (
          <select
            key={filter.name}
            name={filter.name}
            value={filters[filter.name as keyof Filters]}
            onChange={handleSelectChange}
            className="flex items-center cursor-pointer px-2 py-1 rounded-full shadow-sm shadow-black bg-gray-200 dark:bg-gray-800"
          >
            {filter.options.map((option, index) => (
              <option key={option.value} value={option.value} className={`${index === 0? 'font-medium':'opacity-80'}`}>
                {option.label}
              </option>
            ))}
          </select>
        ))}
      </div>
    );
  };