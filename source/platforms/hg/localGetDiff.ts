import { debug } from "../../debug"
import { spawn } from "child_process"

const d = debug("localGetDiff")
const useCommittedDiffArgs = (base: string, tip: string) => ["diff", `-r ${base}:${tip}`]
const useStagingChanges = (base: string) => ["diff", `-r ${base}`]
export const localGetDiff = (base: string, tip: string, staging: boolean = false) =>
  new Promise<string>(done => {
    const args = staging ? useStagingChanges(base) : useCommittedDiffArgs(base, tip)
    let stdout = ""

    const child = spawn("hg", args, { env: process.env })
    d("> hg", args.join(" "))

    child.stdout.on("data", chunk => {
      stdout += chunk
    })

    child.stderr.on("data", data => {
      console.error(`Could not get diff from hg between ${base} and ${tip}`)
      throw new Error(data.toString())
    })

    child.on("close", function (code) {
      if (code === 0) {
        done(stdout)
      }
    })
  })
