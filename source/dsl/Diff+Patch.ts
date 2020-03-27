/** Types related to Diffs and Patches, these are generics that can be used with both Git and Hg APIs */

/** All Text diff values will be this shape */
export interface TextDiff {
  /** The value before the PR's applied changes */
  before: string
  /** The value after the PR's applied changes */
  after: string
  /** A string containing the full set of changes */
  diff: string
  /** A string containing just the added lines */
  added: string
  /** A string containing just the removed lines */
  removed: string
}

/** Diff sliced into chunks */
export interface StructuredDiff {
  /** Diff chunks */
  chunks: any[]
}

/** The results of running a JSON patch */
export interface JSONPatch {
  /** The JSON in a file at the PR merge base */
  before: any
  /** The JSON in a file from the PR submitter */
  after: any
  /** The set of operations to go from one JSON to another JSON */
  diff: JSONPatchOperation[]
}

/** An individual operation inside an rfc6902 JSON Patch */
export interface JSONPatchOperation {
  /** An operation type */
  op: string
  /** The JSON keypath which the operation applies on */
  path: string
  /** The changes for applied */
  value: string
}

/** All JSON diff values will be this shape */
export interface JSONDiffValue {
  /** The value before the PR's applied changes */
  before: any
  /** The value after the PR's applied changes */
  after: any
  /** If both before & after are arrays, then you optionally get what is added. Empty if no additional objects. */
  added?: any[]
  /** If both before & after are arrays, then you optionally get what is removed. Empty if no removed objects. */
  removed?: any[]
}

/** A map of string keys to JSONDiffValue */
export interface JSONDiff {
  [name: string]: JSONDiffValue
}

/** The shape of the Chainsmoker response */
export interface MatchResult {
  /** Did any file paths match from the git modified list? */
  modified: any
  /** Did any file paths match from the git created list? */
  created: any
  /** Did any file paths match from the combination of the git modified and created list? */
  edited: any
  /** Did any file paths match from the git deleted list? */
  deleted: any
}