import React from 'react';

interface ListProps {
  items: string[];
  listType?: 'bullet' | 'numbered';
  className?: string;
}

const List: React.FC<ListProps> = ({ items, listType = 'bullet', className }) => {
  return (
    listType === 'bullet' ? (
      <ul className={className || "list-disc list-inside space-y-2 w-full text-start text-lg"}>
        {items.map((item, index) => (
          <li key={index} className="text-md opacity-90">
            {item}
          </li>
        ))}
      </ul>
    ) : (
      <ol className={className||"list-decimal list-inside space-y-2 w-full text-start text-lg"}>
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
