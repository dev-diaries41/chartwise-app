
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
