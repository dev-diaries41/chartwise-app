import { useJournal } from '@/app/providers/journal';
import { TradeJournalEntry } from '@/app/types';
import React, { ChangeEvent, useState } from 'react';

interface AddEntryPopupProps {
    onClose: () => void;
    onSubmit: (entry: TradeJournalEntry) => void;
    numberOfEntries: number;
  }
  
  const AddEntryPopup: React.FC<AddEntryPopupProps> = ({ onClose, onSubmit, numberOfEntries }) => {
    const {selectedEntry} = useJournal()
  const [entryData, setEntryData] = useState<Partial<TradeJournalEntry>>({
    tradeDate: selectedEntry?.tradeDate || new Date(),
    symbol: selectedEntry?.symbol || '',
    type: selectedEntry?.type || 'buy',
    quantity: selectedEntry?.quantity || '' as any,
    entryPrice: selectedEntry?.entryPrice || '' as any,
    stopLoss: selectedEntry?.stopLoss || '' as any,
    takeProfit: selectedEntry?.takeProfit || '' as any,
    comments: selectedEntry?.comments || '',
    sentiment: selectedEntry?.sentiment || 'neutral',
    createdAt: selectedEntry?.createdAt || new Date(),
    updatedAt: new Date(),
    entryId: selectedEntry ? selectedEntry.entryId : numberOfEntries + 1,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEntryData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = () => {
    const newEntry = {
      ...entryData,
      quantity: Number(entryData.quantity),
      entryPrice: Number(entryData.entryPrice),
      stopLoss: entryData.stopLoss ? Number(entryData.stopLoss) : undefined,
      takeProfit: entryData.takeProfit ? Number(entryData.takeProfit) : undefined,
      sentiment: entryData.sentiment,
      updatedAt: new Date(),
    } as TradeJournalEntry;

    onSubmit(newEntry);
    onClose();
  };


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-neutral-200 dark:bg-gray-800 bg-opacity-90 z-50">
      <div className="bg-neutral-300 dark:bg-gray-900 rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-2xl font-bold mb-4">{selectedEntry ? 'Edit Journal Entry' : 'Add New Journal Entry'}
        </h2>
        <div className="space-y-4">
          <input
            type="text"
            name="symbol"
            placeholder="Symbol"
            value={entryData.symbol}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg focus:outline-none bg-neutral-200 dark:bg-gray-800 focus:ring-2 focus:ring-blue-600"
          />
          <select
            name="type"
            value={entryData.type}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg focus:outline-none bg-neutral-200 dark:bg-gray-800 focus:ring-2 focus:ring-blue-600"
          >
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </select>
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={entryData.quantity}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg focus:outline-none bg-neutral-200 dark:bg-gray-800 focus:ring-2 focus:ring-blue-600"
          />
          <input
            type="number"
            name="entryPrice"
            placeholder="Entry Price"
            value={entryData.entryPrice}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg focus:outline-none bg-neutral-200 dark:bg-gray-800 focus:ring-2 focus:ring-blue-600"
          />
          <input
            type="number"
            name="stopLoss"
            placeholder="Stop Loss (optional)"
            value={entryData.stopLoss}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg focus:outline-none bg-neutral-200 dark:bg-gray-800 focus:ring-2 focus:ring-blue-600"
          />
          <input
            type="number"
            name="takeProfit"
            placeholder="Take Profit (optional)"
            value={entryData.takeProfit}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg focus:outline-none bg-neutral-200 dark:bg-gray-800 focus:ring-2 focus:ring-blue-600"
          />
          <textarea
            name="comments"
            placeholder="Comments (optional)"
            value={entryData.comments}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg focus:outline-none bg-neutral-200 dark:bg-gray-800 focus:ring-2 focus:ring-blue-600"
          ></textarea>
          <select
            name="sentiment"
            value={entryData.sentiment}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg focus:outline-none bg-neutral-200 dark:bg-gray-800 focus:ring-2 focus:ring-blue-600"
          >
            <option value="bullish">Bullish</option>
            <option value="bearish">Bearish</option>
            <option value="neutral">Neutral</option>
          </select>
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg  bg-neutral-400 hover:bg-neutral-200 dark:bg-gray-800 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg bg-emerald-700 text-white hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-blue-800"
          >
            {selectedEntry ? 'Update' : 'Add'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default AddEntryPopup;
