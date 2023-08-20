import pino from 'pino'
// Create a logger

class Logger {
    private logger: pino.Logger
    constructor() {
        this.logger = pino({
            transport: {
                target: 'pino-pretty',
                options: {
                    colorize: true
                }
            }
        })
    }
    info(message: string) {
        this.logger.info(message)
    }
    error(message: string) {
        this.logger.error(message)
    }

    warn(message: string) {
        this.logger.warn(message)
    }
}

export const logger = new Logger()
