import React from 'react';

interface ListProps {
  items: string[];
  listType?: 'bullet' | 'numbered';
}

const List: React.FC<ListProps> = ({ items, listType = 'bullet' }) => {
  return (
    listType === 'bullet' ? (
      <ul className="list-disc list-inside space-y-2 w-full text-start">
        {items.map((item, index) => (
          <li key={index} className="text-md opacity-90">
            {item}
          </li>
        ))}
      </ul>
    ) : (
      <ol className="list-decimal list-inside space-y-2 w-full text-start">
        {items.map((item, index) => (
          <li key={index} className="text-md opacity-90">
            {item}
          </li>
        ))}
      </ol>
    )
  );
};

export default List;
