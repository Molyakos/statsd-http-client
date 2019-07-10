export class QueueDebouncer {

    private timer?: NodeJS.Timeout = undefined;
    private queue: Function[] = [];

    constructor(private time: number) {

    }

    debounce(callback: Function) {
        const onComplete = () => {
            this.queue.forEach(c => c());
            this.queue = [];
            this.timer = undefined;
        };

        if (this.timer) {
            clearTimeout(this.timer);
        }

        this.queue.push(callback);
        this.timer = setTimeout(onComplete, this.time);
    };
}
