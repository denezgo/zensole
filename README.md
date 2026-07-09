# Zensole
![zensole npm version](https://img.shields.io/npm/v/zensole) ![zensole downloads](https://badgen.net/npm/dt/zensole)

**Zensole** - a utility to log anything like `console`.

> **WARNING!!** This package isn't developed for CommonJS, so you can't `require` this package. ;(

## Installing
```bash
npm install zensole
```

## Usage
As example:
```ts
import Zensole from "zensole"

const zensole = new Zensole()

// ...
zensole.log("Hello, World!")
```

## Features
- **Coloring for every logging type** (used [`chalk`](https://npmjs.com/package/chalk))
- **Support of scoping and masking**
- ***ONE DEPENDENCY!!!***
- **Support of logging to file**

## Documentation

### `new Zensole(options?)`

Creates `zensole` (instance of Zensole).

#### `options`
| Key | Description | Value |
|-----|-------------|-------|
|`Level` `?`|Minimum level to display|`info` \| `debug` \| `log` \| `warn` \| `error`|
|`Scope` `?`|Scope which will be displayed|string|
|`FileLogging` `?`|Allows or not logging and to file|`{ Enabled: false }` \| `{ Enabled: true, FilePath: <...> }`|

### `zensole.info(...args)` | `zensole.debug(...args)` | `zensole.log(...args)` | `zensole.warn(...args)` | `zensole.error(...args)`

Aliases to [`zensole.say(type, ...args)`](#zensolesaytype-args), where `type` is method name.

### `zensole.say(type, ...args)`

Says to console (and to file, if is enabled).

#### `type`
Type of saying. [See `Level` in `options` of `new Zensole`](#new-zensoleoptions).

#### `...args`
Chunks. Can be `any` or [`ZensoleChunkDescriptor`](#new-zensolechunkdescriptormessage-options).

### `new ZensoleChunkDescriptor(message, options?)`

Creates chunk with advanced options.

#### `message`
Chunk content. Can be `any`.

#### `options`
| Key | Description | Value |
|-----|-------------|-------|
|`LogToConsole` `?`|Display to console?|boolean|
|`LogToFile` `?`|Log to file?|boolean|
|`Mask` `?`|Mask data (replace with `*********`)?|boolean|