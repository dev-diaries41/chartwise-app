
'use server'
import yahooFinance from 'yahoo-finance2';
import { Time } from '@/app/constants/global';
import { dataToMarkdownTable } from 'devtilities';

type Interval =  "1d" | "1m" | "2m" | "5m" | "15m" | "30m" | "60m" | "90m" | "1h" | "5d" | "1wk" | "1mo" | "3mo" | undefined

type PriceData = {
    adjclose?: number | null | undefined;
    date: Date;
    high: number | null;
    low: number | null;
    open: number | null;
    close: number | null;
    volume: number | null;
}[]
export async function getPriceData(tickerSymbol: string, days: number = 30, interval: Interval = '1d' ): Promise<string|null> {
    try {
        const data = await yahooFinance.chart(tickerSymbol, { period1: new Date(Date.now() - days * Time.day), interval });
        if (!data || data.quotes.length === 0) {
            console.log(`No data found for ticker symbol '${tickerSymbol}'.`);
            return null;
        }
        return dataToMarkdownTable(data.quotes);
    } catch (error: any) {
        console.error(`An error occurred while fetching data for '${tickerSymbol}':`, error.message);
        return null;
    }
}