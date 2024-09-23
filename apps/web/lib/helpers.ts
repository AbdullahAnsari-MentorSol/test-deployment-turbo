export function convertIntervalToSeconds(interval: string): number {
    const parts = interval.split(':').map(Number);
    const hours = parts[0] || 0;
    const minutes = parts[1] || 0;
    const seconds = parts[2] || 0;
    return hours * 3600 + minutes * 60 + seconds;
  }
// export function convertSecondsToInterval(seconds: number): string {
//     if (seconds >= 3600) {
//       const hours = Math.floor(seconds / 3600);
//       return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
//     } else if (seconds >= 60) {
//       const minutes = Math.floor(seconds / 60);
//       return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
//     } else {
//       return `${seconds} ${seconds === 1 ? 'second' : 'seconds'}`;
//     }
//   }
export function convertSecondsToInterval(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  let result = '';

  if (hours > 0) {
    result += `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
  }

  if (minutes > 0) {
    if (result) result += ' '; // Add a space if hours were added
    result += `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
  }

  if (remainingSeconds > 0 || result === '') {
    if (result) result += ' '; // Add a space if minutes or hours were added
    result += `${remainingSeconds} ${remainingSeconds === 1 ? 'second' : 'seconds'}`;
  }

  return result;
}
