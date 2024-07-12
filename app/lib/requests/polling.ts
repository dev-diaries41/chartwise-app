import { Counter } from "@/app/lib/counter";
import { Time } from "@/app/constants/app";


export class Polling {
  private intervalId: NodeJS.Timeout | null = null;
  private callback: () => void;
  private options: {
    interval: number;
    maxDuration: number;
    maxErrors: number;
  };
  private startTime: number;
  private errorCounter: Counter;

  constructor(callback: () => void, options: {
    interval: number;
    maxDuration?: number;
    maxErrors?: number;
  }) {
    this.callback = callback;
    this.options = {
      interval: options.interval,
      maxDuration: options.maxDuration || 2 * Time.min,
      maxErrors: options.maxErrors || 5,
    };
    this.startTime = 0;
    this.errorCounter = new Counter(this.options.maxErrors);
  }

  start(): void {
    if (!this.intervalId) {
      this.startTime = Date.now();
      this.intervalId = setInterval(() => {
        try {
          this.callback();
        } catch (error: any) {
          console.error(`Error: ${error.message}`);
          this.errorCounter.increment();
          if (this.errorCounter.isMax()) {
            console.log("Maximum errors reached. Stopping polling.");
            this.stop();
          }
        }
        if (Date.now() - this.startTime >= this.options.maxDuration) {
          console.log("Maximum duration reached. Stopping polling.");
          this.stop();
        }
      }, this.options.interval);
    }
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}