
import { JSONDSL } from "./JSONDSL"
import { HgCommit } from "./Commit"
import { Chainsmoker } from "../commands/utils/chainsmoker"
import { TextDiff, StructuredDiff, JSONPatch, JSONDiff, MatchResult } from "./Diff+Patch"

// This is `danger.hg`

/**
 *
 * The Mercurial Related Metadata which is available inside the Danger DSL JSON
 *
 * @namespace JSONDSL
 */
export interface HgJSONDSL extends JSONDSL {
  /** The Mercurial commit metadata */
  readonly commits: HgCommit[]
}

export interface HgDSL extends HgJSONDSL {
  /**
   * A Chainsmoker object to help match paths as an elegant DSL. It
   * lets you write a globbed string and then get booleans on whether
   * there are matches within a certain part of the hg DSL.
   *
   * Use this to create an object which has booleans set on 4 keys
   * `modified`, `created`, `edited` (created + modified) and `deleted`.
   *
   * @example
   * const packageJSON = danger.hg.fileMatch("package.json")
   * const lockfile = danger.hg.fileMatch("yarn.lock")
   *
   * if (packageJSON.modified && !lockfile.modified) {
   *    warn("You might have forgotten to run `yarn`.")
   * }
   *
   * @example
   * const needsSchemaChange = danger.hg.fileMatch("src/app/analytics/*.ts")
   * const schema = danger.hg.fileMatch("src/app/analytics/schema.ts")
   *
   * if (needsSchemaChange.edited && !schema.modified) {
   *    fail("Changes to the analytics files need to edit update the schema.")
   * }
   */
  fileMatch: Chainsmoker<MatchResult>

  /**
   * Offers the diff for a specific file
   *
   * @param {string} filename the path to the json file
   */
  diffForFile(filename: string): Promise<TextDiff | null>

  /**
   * Offers the structured diff for a specific file
   *
   * @param {string} filename the path to the json file
   */
  structuredDiffForFile(filename: string): Promise<StructuredDiff | null>

  /**
   * Provides a JSON patch (rfc6902) between the two versions of a JSON file,
   * returns null if you don't have any changes for the file in the diff.
   *
   * Note that if you are looking to just see changes like: before, after, added or removed - you
   * should use `JSONDiffForFile` instead, as this can be a bit unwieldy for a Dangerfile.
   *
   * @param {string} filename the path to the json file
   */
  JSONPatchForFile(filename: string): Promise<JSONPatch | null>

  /**
   * Provides a simplified JSON diff between the two versions of a JSON file. This will always
   * be an object whose keys represent what has changed inside a JSON file.
   *
   * Any changed values will be represented with the same path, but with a different object instead.
   * This object will always show a `before` and `after` for the changes. If both values are arrays or
   * objects the `before` and `after`, then there will also be `added` and `removed` inside the object.
   *
   * In the case of two objects, the `added` and `removed` will be an array of keys rather than the values.
   *
   * This object is represented as `JSONDiffValue` but I don't know how to make TypeScript force
   * declare that kind of type structure.
   *
   * This should make it really easy to do work when specific keypaths have changed inside a JSON file.
   *
   * @param {string} filename the path to the json file
   */
  JSONDiffForFile(filename: string): Promise<JSONDiff>

  /**
   * Offers the overall lines of code added/removed in the diff
   */
  linesOfCode(): Promise<number | null>
}