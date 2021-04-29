perp-cli is a CLI for showing information

# Installation

```bash
$ npm install @perp/cli -g
```
# Usage

## Basic

```shell
# List position history
$ perp position [--trader=<trader_address>] [--pair=<pair>] [--block-limit=<block_limit>]

# show portfolio
$ perp portfolio <trader_address>

# show amm information
$ perp amm [<amm_address>] [--short]
```

## Advanced (Not available yet)

use `PERP_MNEMONIC=<mnemonic>` to set a private key for manipulation, then you can use `perp exec` to execute transactions with an execution file.

```shell
$ perp exec <filename>
```

for example, you want to open a long position for BTC, the execution file will be like this:

```
- action: openPosition
  args:
    amm: <amm_address>
    side: 0|1
    quoteAssetAmount: 1000
    leverage: 2
    baseAssetAmountLimit: 100
```

# Development

for developing, you can use `ts-node` to execute and test the command, e.g.:

```shell
# in production version
$ perp position

# in developing
$ npx ts-node src/index.ts position
```
