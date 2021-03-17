# fastify-doc

[![npm version](https://badge.fury.io/js/%40dnlup%2Ffastify-doc.svg)](https://badge.fury.io/js/%40dnlup%2Ffastify-doc)
![Tests](https://github.com/dnlup/fastify-traps/workflows/Tests/badge.svg)
[![codecov](https://codecov.io/gh/dnlup/fastify-doc/branch/next/graph/badge.svg?token=EX89KNVVSY)](https://codecov.io/gh/dnlup/fastify-doc)
[![Known Vulnerabilities](https://snyk.io/test/github/dnlup/fastify-doc/badge.svg?targetFile=package.json)](https://snyk.io/test/github/dnlup/fastify-doc?targetFile=package.json)

> A Fastify plugin for sampling process metrics.

It uses the module [`@dnlup/doc`](https://github.com/dnlup/doc) behind the scenes.

It decorates the `Fastify` instance with a [`Sampler`](https://github.com/dnlup/doc#class-docsampler)
instance that you can use to get process metrics.

A new sample of the metrics is available when the `Sampler` emits a `sample` event.

See [`@dnlup/doc`](https://github.com/dnlup/doc#class-docsampler)
documentation for more details.

<!-- toc -->

- [Install](#install)
- [Usage](#usage)
  * [Example 1](#example-1)
  * [Example 2](#example-2)
  * [Plugin options](#plugin-options)
- [Decorators](#decorators)
  * [`metrics`](#metrics)
  * [`eventLoopUtilizationSupported`](#eventlooputilizationsupported)
  * [`resourceUsageSupported`](#resourceusagesupported)
  * [`gcFlagsSupported`](#gcflagssupported)
- [Hooks](#hooks)
  * [`onClose`](#onclose)
- [License](#license)

<!-- tocstop -->

## Install

```bash
npm i @dnlup/fastify-doc
```

## Usage

### Example 1

```js
const fastify = require('fastify')()
const metrics = require('@dnlup/fastify-doc')

fastify.register(metrics)

fastify.register(function myReporter (instance, opts, next) {
  instance.metrics.on('sample', () => {
    // sendCpuUsage(instance.metrics.cpu.usage)
    // ...send other metrics as well
  })

  next()
})

fastify.get('/', (request, reply) => {
  reply.send({ ok: true })
})

fastify.listen(3000)
```

### Example 2

```js
const fastify = require('fastify')()
const metrics = require('@dnlup/fastify-doc')

fastify.register(async function myReporter (instance, opts) {
  await instance.register(metrics)

  instance.metrics.on('sample', () => {
    // sendCpuUsage(instance.metrics.cpu.usage)
    // ...send other metrics as well
  })
})

fastify.get('/', (request, reply) => {
  reply.send({ ok: true })
})

fastify.listen(3000)
```

### Plugin options

The options are the same of [`@dnlup/doc`](https://github.com/dnlup/doc#docoptions) (reported here for convenience):

* `options` `<Object>`
  * `sampleInterval` `<number>`: sample interval (ms) to get a sample. On each `sampleInterval` ms a [`sample`](#event-sample) event is emitted. **Default:** `500` on Node < 11.10.0, `1000` otherwise. Under the hood the package uses [`monitorEventLoopDelay`](https://nodejs.org/docs/latest-v12.x/api/perf_hooks.html#perf_hooks_perf_hooks_monitoreventloopdelay_options) when available to track the event loop delay and this allows to increase the default `sampleInterval`.
  * `autoStart` `<boolean>`: start automatically to collect metrics. **Default:** `true`.
  * `unref` `<boolean>`: [unref](https://nodejs.org/dist/latest-v12.x/docs/api/timers.html#timers_timeout_unref) the timer used to schedule the sampling interval. **Default:** `true`.
  * `gcOptions` `<Object>`: Garbage collection options
    * `aggregate` `<boolean>`: Track and aggregate statistics about each garbage collection operation (see https://nodejs.org/docs/latest-v12.x/api/perf_hooks.html#perf_hooks_performanceentry_kind). **Default:** `false`
    * `flags` `<boolean>`: , Track statistics about the flags of each (aggregated) garbage collection operation (see https://nodejs.org/docs/latest-v12.x/api/perf_hooks.html#perf_hooks_performanceentry_flags). `aggregate` has to be `true` to enable this option. **Default:** `true` on Node version `12.17.0` and newer.
  * `eventLoopDelayOptions` `<Object>`: Options to setup [`monitorEventLoopDelay`](https://nodejs.org/docs/latest-v12.x/api/perf_hooks.html#perf_hooks_perf_hooks_monitoreventloopdelay_options). **Default:** `{ resolution: 10 }`
  * `collect` `<Object>`: enable/disable the collection of specific metrics.
    * `cpu` `<boolean>`: enable cpu metric. **Default:** `true`.
    * `resourceUsage` `<boolean>`: enable [resourceUsage](https://nodejs.org/docs/latest-v12.x/api/process.html#process_process_resourceusage) metric. **Default:** `false`.
    * `eventLoopDelay` `<boolean>`: enable eventLoopDelay metric. **Default:** `true`.
    * `eventLoopUtilization` `<boolean>`: enable [eventLoopUtilization](https://nodejs.org/docs/latest-v12.x/api/perf_hooks.html#perf_hooks_performance_eventlooputilization_utilization1_utilization2) metric. **Default:** `true` on Node version `12.19.0` and newer.
    * `memory` `<boolean>`: enable memory metric. **Default:** `true`.
    * `gc` `<boolean>`: enable garbage collection metric. **Default:** `false`.
    * `activeHandles` `<boolean>`: enable active handles collection metric. **Default:** `false`.

If `options.collect.resourceUsage` is set to `true`, `options.collect.cpu` will be set to false because the cpu metric is already available in the [`resource usage metric`](#samplerresourceusage).

## Decorators

### `metrics`

* [`<Sampler>`](https://github.com/dnlup/doc#class-docsampler)

A `Sampler` instance.

### `eventLoopUtilizationSupported`

* `<boolean>`

Whether the Node.js version in use supports the [eventLoopUtilization metric](https://nodejs.org/dist/latest-v14.x/docs/api/perf_hooks.html#perf_hooks_performance_eventlooputilization_utilization1_utilization2).

### `resourceUsageSupported`

* `<boolean>`

Whether the Node.js version in use supports the [resourceUsage metric](https://nodejs.org/dist/latest-v14.x/docs/api/process.html#process_process_resourceusage).

### `gcFlagsSupported`

* `<boolean>`

Whether the Node.js version in use supports [GC flags](https://nodejs.org/dist/latest-v14.x/docs/api/perf_hooks.html#perf_hooks_performanceentry_flags).

## Hooks

### `onClose`

Stops the `Sampler` instance when closing the server.

## License

[ISC](./LICENSE)
