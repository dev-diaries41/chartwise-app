import { FAQ } from "../types";

export const Faqs: FAQ[] = [
    {
        question: 'How does multi-timeframe analysis work?',
        answer: ["Multi-timeframe analysis is only available on the Pro plan. Users can upload up to 3 charts for different timeframes e.g 1H, 4H and 1D. The analysis will consider all 3 timeframes."],
    },
    {
      question: 'How long does the analysis take?',
      answer: [ "The analysis usually takes between 5 - 15 seconds, but it can take longer during peak times or for multi-timeframe analyses."]
    },
    {
        question: 'What markets or assets can I analyse with ChartWise?',
        answer: [ "ChartWise can analyse any asset that can be charted, including stocks, forex, cryptocurrencies, and commodities."]
    },
    {
        question: 'Is the analysis always accurate?',
        answer: [
        'The analysis is AI generated and may not always be 100% accurate and should be used as guidance or to build confluence, not as financial advice.',
        'Make sure to follow the upload guidelines to ensure optimal results.'
        ],
    },
    {
        question: 'What happens if I encounter a bug or issue?',
        answer: [
            'If you encounter any bugs or issues, please report them via our support email or join the Discord community to report bugs directly. '
        ],
    },
    {
        question: 'Is there a free trial?',
        answer: ['Users who are not subscribed can run 3 analyses a day, with a total of 10 a month.'],
    },
  ];
  