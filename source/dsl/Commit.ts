/** A platform agnostic reference to a Git commit */
export interface GitCommit extends Commit { }

/** A platform agnostic reference to a Hg commit */
export interface HgCommit extends Commit { }

/** A platform agnostic reference to a commit */
export interface Commit {
  /** The SHA for the commit */
  sha: string
  /** Who wrote the commit */
  author: CommitAuthor
  /** Who deployed the commit */
  committer: CommitAuthor
  /** The commit message */
  message: string
  /** Potential parent commits, and other assorted metadata */
  tree: any
  /** SHAs for the commit's parents */
  parents?: string[]
  /** Link to the commit */
  url: string
}

/** An author of a commit */
export interface CommitAuthor {
  /** The display name for the author */
  name: string
  /** The authors email */
  email: string
  /** ISO6801 date string */
  date: string
}