import { HttpClient } from './http-client';
import { QueueDebouncer } from './queue-debouncer';
import { Config } from './config';
import { CommandType } from './command-type';

interface Data {
    value?: any
    shift?: number
    time?: number
    sampleRate?: number
}

export class StatsD {

    private readonly config: Config;
    private readonly debouncer: QueueDebouncer;
    private readonly httpClient: HttpClient;

    public constructor(config: Config) {
        const debounceTime = config.debounceTime || 1000;
        this.config = {
            scheme: config.scheme || 'http',
            address: config.address || '',
            host: config.host || '127.0.0.1',
            port: config.port || 9876,
            prefix: config.prefix || '',
            suffix: config.suffix || '',
            useDebounce: config.useDebounce || true,
            debounceTime: debounceTime
        };
        this.debouncer = new QueueDebouncer(debounceTime);
        this.httpClient = new HttpClient();
    }

    public increment(name: string, value: number = 1, sampleRate?: number) {
        const finalValue = toPositive(value);
        this.send(name, CommandType.Count, finalValue, sampleRate);
    }

    public decrement(name: string, value: number = -1, sampleRate?: number) {
        const finalValue = toNegative(value);
        this.send(name, CommandType.Count, finalValue, sampleRate);
    }

    public gauge(name: string, value: number = 1) {
        const finalValue = toPositive(value);
        this.send(name, CommandType.Gauge, finalValue);
    }

    public shift(name: string, value: number = -1) {
        const finalValue = toNegative(value);
        this.send(name, CommandType.Gauge, finalValue);
    }

    public timing(name: string, value: number, sampleRate?: number) {
        const finalValue = toPositive(value);
        this.send(name, CommandType.Timing, finalValue, sampleRate);
    }

    public set(name: string, value: number = 1) {
        this.send(name, CommandType.Set, value);
    }

    private send(name: string, command: string, value: number, sampleRate?: number) {
        const address = this.config.address ? this.config.address : `${this.config.host}:${this.config.port}`;
        const url = `${this.config.scheme}://${address}/${command}/${this.config.prefix}${name}${this.config.suffix}`;
        const data: Data = {
            sampleRate: sampleRate
        };
        switch (command) {
            case CommandType.Gauge:
                value === -1
                    ? data.shift = value
                    : data.value = value;
                break;
            case CommandType.Timing:
                data.time = value;
                break;
            default:
                data.value = value;
        }
        const request = () => this.httpClient.post(url, this.config.token, data);
        if (this.config.useDebounce) {
            this.debouncer.debounce(request);
        } else {
            request();
        }
    }
}

function toPositive(number: number): number {
    return Math.abs(number);
}

function toNegative(number: number): number {
    return -Math.abs(number);
}
