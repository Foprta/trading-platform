module.exports = class CandlesticksOptions {
    constructor(symbol, time, limit, endTime, startTime) {
        this.symbol = symbol;
        this.time = time;
        this.limit = limit || undefined;
        this.endTime = endTime || undefined;
        this.startTime = startTime || undefined;
    }
}