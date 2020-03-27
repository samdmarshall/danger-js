// This dangerfile is for running as an integration test on CI

import { DangerDSLType } from "../../../dsl/DangerDSL"
declare var danger: DangerDSLType
declare function markdown(params: string): void

const showArray = (array: any[], mapFunc?: (a: any) => any) => {
  const defaultMap = (a: any) => a
  const mapper = mapFunc || defaultMap
  return `\n - ${array.map(mapper).join("\n - ")}\n`
}

const hg = danger.hg

const goAsync = async () => {
  const firstFileDiff = await hg.diffForFile(hg.modified_files[0])
  const firstJSONFile = hg.modified_files.find(f => f.endsWith("json"))
  const jsonDiff = firstJSONFile && (await hg.JSONDiffForFile(firstJSONFile))
  const jsonDiffKeys = jsonDiff && showArray(Object.keys(jsonDiff))

  markdown(`
created: ${showArray(hg.created_files)}
modified: ${showArray(hg.modified_files)}
deleted: ${showArray(hg.deleted_files)}
commits: ${hg.commits.length}
messages: ${showArray(hg.commits, c => c.message)}
diffForFile keys:${firstFileDiff && showArray(Object.keys(firstFileDiff))}
jsonDiff keys:${jsonDiffKeys || "no JSON files in the diff"}
`)
}
goAsync()
