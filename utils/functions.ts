import type { GetNotesAPIResult, NoteSummary } from './types'

export function tagsToSet(tags: { name: string }[]): Set<string> {
  const tagsSet = new Set<string>()
  for (const tag of tags) {
    tagsSet.add(tag.name)
  }

  return tagsSet
}

export function tagsToArray(tags: { name: string }[]): string[] {
  const tagsArray: string[] = []
  for (const tag of tags) {
    tagsArray.push(tag.name)
  }

  return tagsArray
}

export function transformNotesSummaryData(
  data: GetNotesAPIResult
): NoteSummary[] {
  if (!data) return []
  return data.map((item) => {
    return {
      id: item.id,
      title: item.title,
      updated_at: item.updated_at,
      is_public: item.is_public,
      tags: item.tags
        ? Array.isArray(item.tags)
          ? item.tags.map((tag) => tag.name)
          : [item.tags.name]
        : [],
    }
  })
}

export function getValidUrlFromUsernameOrUrl(
  usernameOrUrl: string,
  websitePrefix: string
): string {
  if (!usernameOrUrl.startsWith('http') && !usernameOrUrl.startsWith('www')) {
    return websitePrefix + usernameOrUrl
  }
  return usernameOrUrl
}

export function formatTagString(str: string): string {
  return encodeURIComponent(str.trim().toLowerCase().replace(/\s+/g, '-'))
}

export function createUsername(name: string): string {
  name = name.trim()

  // Replace any spaces with underscores
  name = name.replace(/\s/g, '_')

  // Remove any non-alphanumeric characters
  name = name.replace(/[^a-zA-Z0-9_]/g, '')

  name = name.toLocaleLowerCase()

  return name
}
