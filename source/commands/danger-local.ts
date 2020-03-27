#! /usr/bin/env node

import program from "commander"

import setSharedArgs, { SharedCLI } from "./utils/sharedDangerfileArgs"
import { runRunner } from "./ci/runner"
import { isGitRepo, LocalGit } from "../platforms/LocalGit"
import { isHgRepo, LocalHg } from "../platforms/LocalHg"
import { FakeCI } from "../ci_source/providers/Fake"

interface App extends SharedCLI {
  /** What should we compare against? */
  base?: string
  /** Should we run against current staged changes? */
  staging?: boolean
}

program
  .usage("[options]")
  .description("Runs danger without PR metadata, useful for SCM hooks.")
  .option("-s, --staging", "Just use staged changes.")
  .option("-b, --base [branch_name]", "Use a different base branch")
setSharedArgs(program).parse(process.argv)

const isUsingGitScm = isGitRepo()
const isUsingHgScm = isHgRepo()

const app = (program as any) as App

if (isUsingGitScm) {
  const base = app.base || "master"
  const head = "HEAD"

  const localPlatform = new LocalGit({ base, staging: app.staging })
  localPlatform.validateThereAreChanges().then(changes => {
    if (changes) {
      const fakeSource = new FakeCI(process.env)
      // By setting the custom env var we can be sure that the runner doesn't
      // try to find the CI danger is running on and use that.
      runRunner(app, { source: fakeSource, platform: localPlatform, additionalEnvVars: { DANGER_LOCAL_NO_CI: "yep" } })
    } else {
      console.log(`No git changes detected between ${head} and ${base}.`)
    }
  })
}

if (isUsingHgScm) {
  const base = app.base || "default"
  const tip = "tip"

  const localPlatform = new LocalHg({ base, staging: app.staging })
  localPlatform.validateThereAreChanges().then(changes => {
    if (changes) {
      const fakeSource = new FakeCI(process.env)
      runRunner(app, { source: fakeSource, platform: localPlatform, additionalEnvVars: { DANGER_LOCAL_NO_CI: "yep" } })
    } else {
      console.log(`No hg changes detected between ${base} and ${tip}`)
    }
  })
}

