
export function copyTextToClipboard(text: string) {
    if (!navigator.clipboard) {
      console.error('Clipboard API not supported');
      return;
    }
  
    navigator.clipboard.writeText(text).then(() => {
      console.log('Text copied to clipboard');
    }).catch((error) => {
      console.error('Error copying text to clipboard:', error);
    });
  }

  export class RetryHandler {
    private maxRetries: number;
    private currentRetry: number;
  
    constructor(maxRetries: number = 3) {
      this.maxRetries = maxRetries;
      this.currentRetry = 0;
    }
  
    async retry<T>(func: () => Promise<T>, errorHandler: (error: any) => Promise<boolean>): Promise<T> {
      try {
        return await func();
      } catch (error) {
        if (this.currentRetry < this.maxRetries) {
          this.currentRetry++;
          const shouldRetry = await errorHandler(error);
          if (shouldRetry) {
            return await this.retry(func, errorHandler);
          } else {
            throw error; // Propagate error if retry conditions are not met
          }
        } else {
          throw error; // Max retries exceeded
        }
      } finally {
        this.reset();
      }
    }
  
    reset() {
      this.currentRetry = 0;
    }
  }