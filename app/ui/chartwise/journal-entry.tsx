import { TradeJournalEntrySchema } from '@/app/constants/schemas';
import { addJournalEntry, updateJournalEntry } from '@/app/lib/data/journal';
import { useJournal } from '@/app/providers/journal';
import { TradeJournalEntry } from '@/app/types';
import React, { ChangeEvent, useState } from 'react';

interface AddEntryPopupProps {
    email: string
    onClose: () => void;
    onSubmit: (entry: TradeJournalEntry) => void;
    numberOfEntries: number;
  }
  
  const AddEntryPopup: React.FC<AddEntryPopupProps> = ({ onClose, onSubmit, numberOfEntries, email }) => {
    const {selectedEntry} = useJournal()
    const [entryData, setEntryData] = useState<Partial<TradeJournalEntry>>({
      tradeDate: selectedEntry?.tradeDate ?? new Date(),
      symbol: selectedEntry?.symbol ?? '',
      type: selectedEntry?.type ?? 'buy',
      quantity: selectedEntry?.quantity,
      entryPrice: selectedEntry?.entryPrice,
      stopLoss: selectedEntry?.stopLoss,
      takeProfit: selectedEntry?.takeProfit,
      comments: selectedEntry?.comments,
      sentiment: selectedEntry?.sentiment ?? 'neutral',
      createdAt: selectedEntry?.createdAt ?? new Date(),
      updatedAt: new Date(),
      entryId: selectedEntry?.entryId ?? numberOfEntries + 1,
    });
    

    const disabled = !entryData.symbol || !entryData.quantity || !entryData.entryPrice;

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEntryData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async() => {
    const newEntry = {
      ...entryData,
      quantity: Number(entryData.quantity),
      entryPrice: Number(entryData.entryPrice),
      stopLoss: entryData.stopLoss ? Number(entryData.stopLoss) : undefined,
      takeProfit: entryData.takeProfit ? Number(entryData.takeProfit) : undefined,
      sentiment: entryData.sentiment,
      updatedAt: new Date(),
      userId: email
    } as TradeJournalEntry;

    const result = TradeJournalEntrySchema.safeParse(newEntry);
    if(!result.success){
      return alert(JSON.stringify(result.error.flatten().fieldErrors));
    }

    if(selectedEntry){
      await updateJournalEntry(email, result.data)
    }else{
      await addJournalEntry(result.data);
    }
    onSubmit(result.data);
    onClose();
  };


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-800 bg-opacity-90 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-xl font-semibold mb-4">{selectedEntry ? 'Edit Journal Entry' : 'Add New Journal Entry'}
        </h2>
        <div className="space-y-4">
          <div className='gap-1'>
          <label htmlFor="symbol" className='block text-sm font-medium text-left'>Symbol</label>
          <input
            type="text"
            id="symbol"
            name="symbol"
            placeholder="Symbol"
            value={entryData.symbol}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-700  rounded-lg focus:outline-none bg-gray-100 dark:bg-gray-800 focus:ring-2 focus:ring-blue-600"
            required
          />
          </div>

          <div className='gap-1'>
          <label htmlFor="type" className='block text-sm font-medium text-left'>Type</label>
          <select
            id="type"
            name="type"
            value={entryData.type}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-700  rounded-lg focus:outline-none bg-gray-100 dark:bg-gray-800 focus:ring-2 focus:ring-blue-600"
            required
          >
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </select>
          </div>

          <div className='gap-1'>
          <label htmlFor="sentiment" className='block text-sm font-medium text-left'>Sentiment</label>
          <select
            id="sentiment"
            name="sentiment"
            value={entryData.sentiment}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-700  rounded-lg focus:outline-none bg-gray-100 dark:bg-gray-800 focus:ring-2 focus:ring-blue-600"
            required
          >
            <option value="bullish">Bullish</option>
            <option value="bearish">Bearish</option>
            <option value="neutral">Neutral</option>
          </select>
          </div>
          
          <div className='gap-1'>
          <label htmlFor="quantity" className='block text-sm font-medium text-left'>Quantity</label>
          <input
            id="quantity"
            name="quantity"
            type="number"
            min={0}
            placeholder="Quantity"
            value={entryData.quantity}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-700  rounded-lg focus:outline-none bg-gray-100 dark:bg-gray-800 focus:ring-2 focus:ring-blue-600"
            required
          />
          </div>

          <div className='gap-1'>
          <label htmlFor="entryPrice" className='block text-sm font-medium text-left'>Entry price</label>
          <input
            type="number"
            id="entryPrice"
            name="entryPrice"
            min={0}
            placeholder="Enter entry price"
            value={entryData.entryPrice}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-700  rounded-lg focus:outline-none bg-gray-100 dark:bg-gray-800 focus:ring-2 focus:ring-blue-600"
            required
          />
          </div>
        
          <div className='gap-1'>
          <label htmlFor="stopLoss" className='block text-sm font-medium text-left'>Stop loss (optional)</label>
          <input
            type="number"
            id="stopLoss"
            name="stopLoss"
            min={0}
            placeholder="Enter stop Loss"
            value={entryData.stopLoss}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-700  rounded-lg focus:outline-none bg-gray-100 dark:bg-gray-800 focus:ring-2 focus:ring-blue-600"
          />
          </div>
         
          <div className='gap-1'>
          <label htmlFor="takeProfit" className='block text-sm font-medium text-left'>Take profit (optional)</label>
          <input
            type="number"
            id="takeProfit"
            name="takeProfit"
            min={0}
            placeholder="Enter take profit"
            value={entryData.takeProfit}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-700  rounded-lg focus:outline-none bg-gray-100 dark:bg-gray-800 focus:ring-2 focus:ring-blue-600"
          />
          </div>

          <div className='gap-1'>
          <label htmlFor="comments" className='block text-sm font-medium text-left'>Comments (optional)</label>
          <textarea
            id="comments"
            name="comments"
            placeholder="Include details such as why you entered the trade, thoughts on the outcome, or any relevant fundamental news or events."
            value={entryData.comments}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-700  rounded-lg focus:outline-none bg-gray-100 dark:bg-gray-800 focus:ring-2 focus:ring-blue-600 min-h-[120px]"
          ></textarea>
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-transparent hover:bg-gray-300 hover:dark:bg-gray-700 border border-gray-300 dark:border-gray-700 font-medium rounded-full shadow-sm"
          >
            Cancel
          </button>
          <form action={handleSubmit}>
            <button
            disabled={disabled}
            type='submit'
            className={`px-4 py-2 rounded-full ${disabled? 'opacity-50':'hover:bg-emerald-500 '} bg-emerald-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-800`}
            >
            {selectedEntry ? 'Update' : 'Add'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEntryPopup;
