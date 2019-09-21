export function BinanceOptionsToSubscribtionName(type: string, symbol: string, time?: string): string {
    console.log(`${symbol}@${type}${time ? "_"+time : ''}`);
    return `${symbol}@${type}${time ? "_"+time : ''}`;
}