export function BinanceOptionsToSubscribtionName(type: string, symbol: string, time?: string): string {
    return `${symbol}@${type}${time ? "_"+time : ''}`;
}