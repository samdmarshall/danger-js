import { debug } from "../../debug"
import JSON5 from "json5"

import { spawn } from "child_process"
import { HgCommit } from "../../dsl/Commit"

const d = debug("localGetDiff")

const sha = "{node}"
const parents = "{parents}"
const authorName = "{author|person}"
const authorEmail = "{author|email}"
const authorDate = "{date|isodate}"
const committerName = "{author|person}"
const committerEmail = "{author|email}"
const committerDate = "{date|isodate}"
const message = "{desc}" // this is subject, not message, so it'll only be one line

const author = `"author": \{"name": "${authorName}", "email": "${authorEmail}", "date": "${authorDate}" \}`
const committer = `"committer": \{"name": "${committerName}", "email": "${committerEmail}", "date": "${committerDate}" \}`
export const formatJSON = `\{ "sha": "${sha}", "parents": "${parents}", ${author}, ${committer}, "message": "${message}"\},`

export const localGetCommits = (base: string, tip: string) =>
  new Promise<HgCommit[]>(done => {
    const args = ["log", `${base}...${tip}`, `--template ${formatJSON}`]
    const child = spawn("hg", args, { env: process.env })
    d("> hg", args.join(" "))
    child.stdout.on("data", async data => {
      data = data.toString()

      // remove trailing comma, and wrap into an array
      const asJSONString = `[${data.substring(0, data.length - 1)}]`
      const commits = JSON5.parse(asJSONString)
      const realCommits = commits.map((c: any) => ({
        ...c,
        parents: c.parents.split(" "),
      }))

      done(realCommits)
    })

    child.stderr.on("data", data => {
      console.error(`Could not get commits from hg between ${base} and ${tip}`)
      throw new Error(data.toString())
    })
  })
