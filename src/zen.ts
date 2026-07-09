import FS from "node:fs/promises"
import Util from "node:util"
import Chalk from "chalk"

/**
 * Zensole log chunk descriptor options
 */
export interface ZensoleChunkDescriptorOptions {
    LogToConsole?: boolean,
    LogToFile?: boolean,
    Mask?: boolean,
}

/**
 * Zensole log chunk descriptor
 */
export class ZensoleChunkDescriptor {
    readonly Message: any
    readonly Options: ZensoleChunkDescriptorOptions = {
        LogToConsole: true,
        LogToFile: true,
        Mask: false,
    }

    /**
     * Creates Zensole log chunk descriptor
     * 
     * @param {any} message Message to log. Message can be `any`.
     * @param {ZensoleChunkDescriptorOptions?} options Options.
     */
    constructor (message: any, options: ZensoleChunkDescriptorOptions = {}) {
        this.Message = message

        if (typeof(options) !== "object") throw new TypeError("Got unexpected type of `options`. Use object instead.")

        if (options)
            this.Options = { ...(this.Options), ...options }
    }
}

/**
 * Zensole log types
 */
export type ZensoleType = "info" | "debug" | "log" | "warn" | "error"
/**
 * Zensole log types
 */
export const ZensoleLevels = [
    "info",
    "debug",
    "log",
    "warn",
    "error",
]

/**
 * Zensole options interface
 */
export interface ZensoleOptions {
    Level?: ZensoleType,
    Scope?: string,
    FileLogging?: {
        Enabled: false,
    } | {
        Enabled: true,
        FilePath: string,
    },
}

/**
 * Main Zensole class
 */
export default class Zensole {
    /**
     * Zensole options
     * 
     * @type {ZensoleOptions}
     */
    #options: ZensoleOptions = {
        Level: "log",
    }

    /**
     * Creates Zensole instance (zensole).
     * 
     * @param {ZensoleOptions} options - Zensole options
     * 
     * @example
     * const zensole = new Zensole({
     *    FileLogging: {
     *         Enabled: true,
     *         FilePath: "/path/to/log.log",
     *    },
     * })
     */
    constructor (options: ZensoleOptions = {}) {
        if (typeof options !== 'object') throw new TypeError("Got unexpected type of `options`. Use object instead.")
        
        if (options?.FileLogging && options?.FileLogging?.Enabled == true && !options?.FileLogging?.FilePath) throw new TypeError("`FileLogging.FilePath` is required when `FileLogging` is `Enabled`.")
        
        if (options?.Level && !ZensoleLevels.includes(options.Level)) throw new TypeError(`Got unexpected value of \`level\`. Use one of this: ${ZensoleLevels.join(", ")}`)
        
        this.#options = { ...(this.#options), ...options }
    }

    /**
     * Logs message to the console
     * 
     * @param {...(any | ZensoleChunkDescriptor)} args Message to log. Message can be `any` or (for advanced settings) `ZensoleChunkDescriptor`.
     * 
     * @alias zensole.say Alias to `zensole.say` function with `type` = `log`
     * 
     * @example
     * zensole.log("Hello, world!")
     */
    log = (...args: (any | ZensoleChunkDescriptor)[]): void => this.say("log", ...args)
    /**
     * Logs error to the console
     * 
     * @param  {...(any | ZensoleChunkDescriptor)} args Message to log. Message can be `any` or (for advanced settings) `ZensoleChunkDescriptor`.
     * 
     * @alias zensole.say Alias to `zensole.say` function with `type` = `error`
     * 
     * @example
     * zensole.error("Unexpected error: I don't use Zensole, but I want to use it!")
     */
    error = (...args: (any | ZensoleChunkDescriptor)[]): void => this.say("error", ...args)
    /**
     * Logs warn to the console
     * 
     * @param  {...(any | ZensoleChunkDescriptor)} args Message to log. Message can be `any` or (for advanced settings) `ZensoleChunkDescriptor`.
     * 
     * @alias zensole.say Alias to `zensole.say` function with `type` = `warn`
     * 
     * @example
     * zensole.warn("Unexpected warning")
     */
    warn = (...args: (any | ZensoleChunkDescriptor)[]): void => this.say("warn", ...args)
    /**
     * Logs debug message to the console
     * 
     * @param  {...(any | ZensoleChunkDescriptor)} args Message to log. Message can be `any` or (for advanced settings) `ZensoleChunkDescriptor`.
     * 
     * @alias zensole.say Alias to `zensole.say` function with `type` = `debug`
     * 
     * @example
     * zensole.debug("Loading...")
     */
    debug = (...args: (any | ZensoleChunkDescriptor)[]): void => this.say("debug", ...args)
    /**
     * Logs info message to the console
     * 
     * @param  {...(any | ZensoleChunkDescriptor)} args Message to log. Message can be `any` or (for advanced settings) `ZensoleChunkDescriptor`.
     * 
     * @alias zensole.say Alias to `zensole.say` function with `type` = `info`
     * 
     * @example
     * zensole.info("Version is ...")
     */
    info = (...args: (any | ZensoleChunkDescriptor)[]): void => this.say("info", ...args)

    /**
     * Logs message to the console with selected log type
     * 
     * @param {ZensoleType} type Log type. Can be `log`, `info`, `warn`, `error`, `debug`.
     * @param {...(any | ZensoleChunkDescriptor)} args Message to log. Message can be `any` or (for advanced settings) `ZensoleChunkDescriptor`.
     * 
     * @example
     * zensole.say("info", "Hello, world!")
     */
    say (type: ZensoleType, ...args: (any | ZensoleChunkDescriptor)[]): void {
        if (args.length === 0) throw new TypeError("`say` method requires at least one argument.")
        
        const logType = type.toLowerCase() as ZensoleType

        if (!ZensoleLevels.includes(logType)) throw new TypeError(`\`say\` method requires valid log type. Can be ${ZensoleLevels.join(", ")}`)

        if (ZensoleLevels.indexOf(logType) < ZensoleLevels.indexOf(this.#options.Level!)) return
        
        const message = Util.format((this.#options?.Scope ? `[${this.#options.Scope}]` : ``), ...(args.filter(a => (
            a instanceof ZensoleChunkDescriptor
                ? a.Options.LogToConsole === true
                : true
        )).map(arg => arg instanceof ZensoleChunkDescriptor ? (arg.Options.Mask ? `*********` : arg.Message) : arg)))

        switch (logType) {
            case "log":
                console.log(Chalk.bgGray(logType.toUpperCase()), message)
                break
            case "info":
                console.info(Chalk.bgCyan(logType.toUpperCase()), message)
                break
            case "warn":
                console.warn(Chalk.bgYellow(logType.toUpperCase()), message)
                break
            case "error":
                console.error(Chalk.bgRed(logType.toUpperCase()), message)
                break
            case "debug":
                console.debug(Chalk.bgWhite(logType.toUpperCase()), message)
                break
        }

        if (this.#options.FileLogging?.Enabled) {
            const fileMessage = Util.format((this.#options?.Scope ? `[${this.#options.Scope}]` : ``), ...(args.filter(a => (
                a instanceof ZensoleChunkDescriptor
                    ? a.Options.LogToFile === true
                    : true
            )).map(arg => arg instanceof ZensoleChunkDescriptor ? (arg.Options.Mask ? `*********` : arg.Message) : arg)))

            FS
                .appendFile(this.#options.FileLogging.FilePath, `[${new Date().toISOString()}] [${logType.toUpperCase()}] ${fileMessage}\n`)
                .catch(e => console.error(Chalk.bgRed("ERROR"), "Zensole failed to say to file:", e))
        }
    }
}