export function tagsToSet(tags: { name: string }[]): Set<string> {
  const tagsSet = new Set<string>()
  for (const tag of tags) {
    tagsSet.add(tag.name)
  }

  return tagsSet
}

// export function setToTags(tagsSet: Set<string>): { name: string }[] {
//   const tags: { name: string }[] = []
//   for (const tag of tagsSet) {
//     tags.push({
//       name: tag,
//     })
//   }

//   return tags
// }
