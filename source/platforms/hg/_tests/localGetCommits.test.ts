import { formatJSON } from "../localGetCommits"

it("generates a JSON-like commit message", () => {
  expect(formatJSON).toEqual(
    '\{ "sha": "{node}", "parents": "{parents}", "author": \{"name": "{author|person}", "email": "{author|email}", "date": "{date|isodate}" \}, "committer": \{"name": "{author|person}", "email": "{author|email}", "date": "{date|isodate}" \}, "message": "{desc}"\},'
  )

  const withoutComma = formatJSON.substring(0, formatJSON.length - 1)
  expect(() => JSON.parse(withoutComma)).not.toThrow()
})
