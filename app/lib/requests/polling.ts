import { Counter } from "@/app/lib/counter";
import { Time } from "@/app/constants/app";
import { PollOptions } from "@/app/types";

const DefaultPollOptions: PollOptions = {
  interval: 10 * Time.sec,
  maxDuration: 2 * Time.min,
  maxErrors: 3
}

export class Polling {
  private intervalId: NodeJS.Timeout | null = null;
  private callback: () => void;
  private options: PollOptions;
  private startTime: number;
  private errorCounter: Counter;

  constructor(callback: () => void, options: Partial<PollOptions>) {
    this.callback = callback;
    this.options = {...DefaultPollOptions, ...options};
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
          this.errorCounter.increment();
          if (this.errorCounter.isMax()) {
            if(this.options.onMaxErrors){
              this.options.onMaxErrors();
            }
            this.stop();
          }
        }
        if (Date.now() - this.startTime >= this.options.maxDuration) {
          if(this.options.onMaxDuration){
            this.options.onMaxDuration();
          }
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