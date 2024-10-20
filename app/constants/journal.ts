export const JournalFilterOptions = [
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