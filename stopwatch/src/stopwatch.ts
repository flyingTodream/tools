enum Status {
    Stop = 'stopped',
    Running = 'running',
    Pause = 'paused',
}

class Stopwatch {
    startAt: number
    duration: number
    status: Status
    constructor() {
        this.startAt = 0
        this.duration = 0
        this.status = Status.Stop
    }

    start() {
        if (this.status === Status.Stop) {
            this.startAt = Date.now()
            this.status = Status.Running
        }
    }

    pause() {
        if (this.status === Status.Running) {
            this.duration += Date.now() - this.startAt
            this.status = Status.Pause
        }
    }

    resume() {
        if (this.status === Status.Pause) {
            this.startAt = Date.now()
            this.status = Status.Running
        }
    }

    stop() {
        this.status = Status.Stop
    }

    reset() {
        this.startAt = 0
        this.duration = 0
        this.status = Status.Stop
    }

    read() {
        if (this.status === Status.Running) {
            return this.duration + Date.now() - this.startAt
        }
        return this.duration
    }
}

export default Stopwatch
