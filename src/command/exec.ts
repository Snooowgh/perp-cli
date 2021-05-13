import { Wallet } from "ethers"
import { CommandModule } from "yargs"
import { formatProperty, formatTitle } from "../util/format"
import { fetchConfiguration, fetchMetadata, Contracts } from "../util/metadata"

import { getProvider } from "../util/provider"
import { getStageName } from "../util/stage"

import { Actions, layerOfFunction, actionOfFunction, actionMaps } from "../util/functionsMap"
import { PERP_MNEMONIC } from "../util/constant"
import yaml from "js-yaml"
import fs from "fs"
import path from "path"

const execCommand: CommandModule = {
    command: "exec <file_name>",
    describe: "interact with contracts",
    builder: yargs =>
        yargs.positional("file_name", {
            describe: "a file which contains specific format for `perp` to execute",
            type: "string",
        }),

    handler: async argv => {
        const stageName = getStageName(argv.stage)
        const metadata = await fetchMetadata(stageName)
        const config = await fetchConfiguration(stageName)
        const file = argv.file_name as string
        console.log(`send tx on ${stageName} with following ops`)

        const fullExecFilePath = path.join(__dirname, file)
        const ops = yaml.load(fs.readFileSync(fullExecFilePath, "utf-8")) as Actions[]
        for (const op of ops) {
            console.log(formatTitle(op.action))
            console.log(op.args)

            const functionName = op.action as keyof actionOfFunction
            const wallet = Wallet.fromMnemonic(PERP_MNEMONIC).connect(
                getProvider(layerOfFunction(functionName), config),
            )

            const receipt = await actionMaps[functionName](metadata, wallet, op.args)
            console.log(formatProperty("tx hash", receipt.transactionHash))
        }
        return
    },
}

export default execCommand
