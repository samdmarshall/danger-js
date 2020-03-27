
import { Commit } from "./Commit"

/**
 *
 * Related Metadata which is available inside the Danger DSL JSON
 *
 * @namespace JSONDSL
 */

export interface JSONDSL {
    /**
     * Filepaths with changes relative to the scm root
     */
    readonly modified_files: string[]

    /**
     * Newly created filepaths relative to the scm root
     */
    readonly created_files: string[]

    /**
     * Removed filepaths relative to the scm root
     */
    readonly deleted_files: string[]

    /** The commit metadata */
    readonly commits: Commit[]
}