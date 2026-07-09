import test from "node:test"
import assert from "node:assert"
import Zensole, { ZensoleChunkDescriptor } from "./zen.js"

test("Zensole core test", async t => {
    await t.test("creates zensole without errors", () => {
        assert.doesNotThrow(() => {
            new Zensole()
        })
    })

    await t.test("throws error on zensole instancing when options type is string", () => {
        assert.throws(() => {
            // @ts-ignore
            new Zensole("я строка, а не объект")
        }, TypeError)
    })

    await t.test("throws error on zensole instancing when file logging is enabled but no file", () => {
        assert.throws(() => {
            new Zensole({
                FileLogging: {
                    Enabled: true,
                } as any
            })
        }, TypeError)
    })

    await t.test("successly runs log", () => {
        const logger = new Zensole()
        assert.doesNotThrow(() => {
            logger.log("hi", 3, 0x85, Buffer.from("zensole"))
        })
    })

    await t.test("correctly unpacks descriptor", () => {
        const logger = new Zensole()
        const descriptor = new ZensoleChunkDescriptor("test")
        
        assert.doesNotThrow(() => {
            logger.log(descriptor)
        })
    })

    await t.test("correctly unpacks descriptor with message not string", () => {
        const logger = new Zensole()
        const descriptor = new ZensoleChunkDescriptor(Buffer.from("zensole 4ever"))
        
        assert.doesNotThrow(() => {
            logger.log(descriptor)
        })
    })

    await t.test("doesn't display messages with level less than selected", tt => {
        const logMock = t.mock.method(console, 'log', () => {})

        const logger = new Zensole({
            Level: "error",
        })
        
        logger.log("testing the level match")
        
        assert.strictEqual(logMock.mock.callCount(), 0, "must don't send")
    })
    await t.test("displays scope in messages", tt => {
        const logMock = t.mock.method(console, 'log', () => {})

        const logger = new Zensole({
            Scope: "GIRL",
        })
        
        logger.log("hello")
        
        assert.strictEqual(logMock.mock.callCount(), 1)
        
        const firstCallArgs = logMock.mock.calls[0].arguments
        const fullOutput = firstCallArgs.join(" ")
        
        assert.match(fullOutput, /GIRL/i, "must be scope")
        assert.match(fullOutput, /hello/i, "must be message")
    })
    await t.test("replaces chunk with ********", tt => {
        const logMock = t.mock.method(console, 'log', () => {})

        const logger = new Zensole({})
        
        logger.log("My password is", new ZensoleChunkDescriptor("abcd", { Mask: true }))
        
        assert.strictEqual(logMock.mock.callCount(), 1)
        
        const firstCallArgs = logMock.mock.calls[0].arguments
        const fullOutput = firstCallArgs.join(" ")
        
        assert.match(fullOutput, /\*{9,}/i, "must be masked")
    })
})