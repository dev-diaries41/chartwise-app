import { OnboardingQuestions } from "@/app/types";

export const onboardingQuestions: OnboardingQuestions[] = [
    {
      question: "What type of assets do you primarily trade?",
      options: ["Stocks", "Cryptocurrency", "Forex", "Commodities", "Bonds", "ETFs", "None/Unsure"],
      questionCategory: 'tradingAssets',
      allowMultipleAnswers: true,
    },
    {
      question: "What is your trading experience level?",
      options: [
        "Beginner (less than 6 months)",
        "Intermediate (6 months to 1 year)",
        "Experienced (1 to 3 years)",
        "Expert (more than 3 years)",
      ],
      questionCategory: 'tradingExperience',
      allowMultipleAnswers: false,
    },
    {
      question: "Which tools or analysis methods do you use most?",
      options: [
        "Technical Analysis",
        "Fundamental Analysis",
        "Quantitative Analysis",
        "Sentiment Analysis",
        "None/Unsure",
      ],
      questionCategory: 'analysisMethods',
      allowMultipleAnswers: true,
    },
    {
      question: "What are your goals with trading?",
      options: [
        "Build long-term wealth",
        "Generate short-term profits",
        "Supplement income",
        "None/Unsure",
      ],
      questionCategory: 'tradingGoals',
      allowMultipleAnswers: false,
    },
  ];

  
  export const CHARTWISE_WELCOME_TITLE = 'Welcome to ChartWise!';
  export const CHARTWISE_WELCOME_MESSAGE = 'To help us tailor your experience and provide personalized recommendations, please complete these four simple questions. It will only take a minute!';
  