import { HgDSL } from "../dsl/HgDSL"
import { Platform, Comment } from "./platform"
import { hgJSONToHgDSL, HgJSONToHgDSLConfig } from "./hg/hgJSONToHgDSL"
import { diffToHgJSONDSL } from "./hg/diffToHgJSONDSL"
import { HgCommit } from "../dsl/Commit"
import { localGetDiff } from "./hg/localGetDiff"
import { localGetFileAtSHA } from "./hg/localGetFileAtSHA"
import { localGetCommits } from "./hg/localGetCommits"
import { readFileSync, existsSync } from "fs"

export interface LocalHgOptions {
  base?: string
  staging?: boolean
}

export function isHgRepo(): boolean {
  return existsSync(".hg/")
}

export class LocalHg implements Platform {
  public readonly name: string
  private hgDiff: string | undefined

  constructor(public readonly options: LocalHgOptions) {
    this.name = "local hg"
  }

  async getHgDiff(): Promise<string> {
    if (this.hgDiff) {
      return this.hgDiff
    }
    const base = this.options.base || "default"
    const tip = "tip"

    this.hgDiff = await localGetDiff(base, tip, this.options.staging)
    return this.hgDiff
  }

  async validateThereAreChanges(): Promise<boolean> {
    const diff = await this.getHgDiff()
    return diff.trim().length > 0
  }

  async getPlatformReviewDSLRepresentation(): Promise<any> {
    return null
  }

  async getPlatformSCMRepresentation(): Promise<HgDSL> {
    const base = this.options.base || "default"
    const tip = "tip"
    const diff = await this.getHgDiff()
    const commits: HgCommit[] = await localGetCommits(base, tip)
    const hgJSON = diffToHgJSONDSL(diff, commits)

    const config: HgJSONToHgDSLConfig = {
      repo: process.cwd(),
      baseSHA: this.options.base || "",
      headSHA: "",
      getFileContents: localGetFileAtSHA,
      getFullDiff: localGetDiff,
    }

    return hgJSONToHgDSL(hgJSON, config)
  }

  async getInlineComments(_: string): Promise<Comment[]> {
    return []
  }

  supportsCommenting() {
    return false
  }

  supportsInlineComments() {
    return true
  }

  async updateOrCreateComment(_dangerID: string, _newComment: string): Promise<string | undefined> {
    return undefined
  }

  async createComment(_comment: string): Promise<any> {
    return true
  }

  async createInlineComment(_git: HgDSL, _comment: string, _path: string, _line: number): Promise<any> {
    return true
  }

  async updateInlineComment(_comment: string, _commentId: string): Promise<any> {
    return true
  }

  async deleteInlineComment(_id: string): Promise<boolean> {
    return true
  }

  async deleteMainComment(): Promise<boolean> {
    return true
  }

  async editMainComment(_comment: string): Promise<boolean> {
    return true
  }

  async updateStatus(): Promise<boolean> {
    return true
  }

  getFileContents = (path: string) => new Promise<string>(res => res(readFileSync(path, "utf8")))

  async getReviewInfo(): Promise<any> {
    return {}
  }
}

