'use client'
import { faCheck, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DropDownMenu from '../common/dropdown-menu';
import { IAnalysis } from '@/app/types';

const Strategies: {
    name: string;
    description: string;
  }[] = [
    {
      name: "Breakout",
      description: "A strategy that involves entering trades when the price breaks through a support or resistance level with increased volume."
    },
    {
      name: "Swing Trading",
      description: "A medium-term strategy aimed at capturing price swings within a time frame of a few days to weeks."
    },
    {
      name: "Trend Following",
      description: "A strategy that involves trading in the direction of the prevailing trend, using indicators like moving averages or momentum."
    },
    {
      name: "Scalping",
      description: "A high-frequency strategy where traders aim to make small profits from rapid trades, often holding positions for minutes or seconds."
    },
    {
      name: "Mean Reversion",
      description: "A strategy based on the assumption that prices will revert to the average price over time, leading to buy low and sell high opportunities."
    },
    {
      name: "Range Trading",
      description: "A strategy that involves identifying a price range in which the asset is oscillating and making trades at the support and resistance levels within the range."
    },
    {
      name: "Momentum Trading",
      description: "A strategy that capitalizes on the continuation of an asset's price movement, entering trades in the direction of strong momentum."
    },
    {
      name: "Position Trading",
      description: "A long-term strategy where traders hold positions for weeks, months, or even years, aiming to profit from major market trends."
    },
    {
      name: "Pullback Trading",
      description: "A strategy that involves entering a trade during a temporary price dip in an otherwise established trend, anticipating the continuation of the trend."
    },
  ];


  const MAX_CHARS = 150

  export default function StrategyDropdown({
    onStrategyChange, 
    analysis
  }: {
    onStrategyChange: (strategy: string) => void
    analysis: Omit<IAnalysis, 'userId'>
  }) {
      return (
        <DropDownMenu title="Trading Strategy (optional)" titleClassName={"text-sm font-semibold text-left opacity-80"}>
          <ul className="relative w-full flex flex-col gap-2 pl-6 px-2">
            {
              Strategies.map((strategy, index) => (
                <li key={index} className="flex flex-row items-center justify-between gap-4">
                  <div className="w-full flex flex-row justify-between items-center ">
                    <div className='flex flex-row gap-1 items-center'>
                    {analysis?.metadata.strategyAndCriteria === strategy.name && <FontAwesomeIcon icon={faCheck} className="text-emerald-500 w-4 h-4" />}
                    <button onClick={() =>onStrategyChange(strategy.name)}>
                      <span className='flex justify-start mr-auto hover:text-emerald-500 opacity-80'>{strategy.name}</span>
                    </button>
                    </div>
                    <div className="relative flex justify-end items-center group">
                      {/* Info Icon */}
                      <button className="flex justify-end items-center relative">
                        <FontAwesomeIcon icon={faInfoCircle} className="opacity-80 cursor-pointer w-4 h-4" />
                      </button>

                      {/* Show StrategyInfo on hover */}
                      <div className="hidden group-hover:block text-left">
                        <div className="absolute right-0 top-full mt-2 w-64 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg p-4 z-50">
                          <h2 className="text-lg font-semibold mb-2">{strategy.name}</h2>
                          <p className="text-left opacity-80">{strategy.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))
            }
          </ul>
          <div className='my-8 p-2'>
          <label htmlFor={'strategy'} className="flex flex-row block text-left font-medium mb-1 opacity-80">
              {`Custom strategy (optional):`}
            </label>   
            <div className="flex flex-col items-center  w-full rounded-md border border-gray-200 dark:border-gray-600 text-sm md:text-md ">
              <textarea
                id={"strategy"}
                name={"strategy"}
                placeholder={
                  "For advanced users: Add custom strategy details (e.g., entry/exit rules, specific patterns). Note that this may affect analysis accuracy."
                }              
                className={`flex w-full  flex-grow min-h-[180px] lg:min-h-[80px] p-2 bg-transparent rounded-md focus:outline-none resize-none `}
                value={analysis.metadata.strategyAndCriteria}
                onChange={(e) => {
                  onStrategyChange(e.target.value);
                }}
                aria-describedby={"strategy-criteria-error"}
                maxLength={MAX_CHARS} />
              <span className="p-2 w-full text-right opacity-50">{`${analysis.metadata?.strategyAndCriteria?.length}/${MAX_CHARS}`}</span> 
            </div>
          </div>
        </DropDownMenu>
      );
  }
  