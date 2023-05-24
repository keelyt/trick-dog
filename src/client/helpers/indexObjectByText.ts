/**
 * Finds the index of an object within a sorted array of objects by performing a binary search based on
 * the sort key and the value at that key. Assumes the objects are sorted by a string value.
 * @template T The type of objects in the array.
 * @template K The key of the property used for comparison and sorting.
 * @param objects The array of objects to search within.
 * @param target The target string to find within the array objects.
 * @param sortKey The key of the property used for comparison and sorting.
 * @returns The index of the found object or the insertion point for the object.
 */
export default function indexObjectByText<
  T extends Record<K, string>,
  K extends keyof {
    [Key in keyof T]-?: T[Key] extends string ? Key : never;
  }
>(objects: T[], target: string, sortKey: K): number {
  let low = 0;
  let high = objects.length - 1;

  const targetValue = target.toLowerCase();

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const compareValue = objects[mid][sortKey].toLowerCase();
    if (compareValue === targetValue) return mid;
    if (compareValue > targetValue) {
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }
  return low;
}
