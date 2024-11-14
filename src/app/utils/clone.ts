export function deepClone<T>(obj: T) {
    return JSON.parse(JSON.stringify(obj));
}
  
export function ensure<T extends object>(
    obj: T,
    // keys 的类型设置为 `Array<[keyof T][number]>`，表示 keys 是一个数组，数组中的每个元素都是一个元组，元组中的唯一元素是 T 类型的键。
    // 这种类型设置确保了 keys 数组中的每个元素都是一个有效的 T 类型的键。
    keys: Array<[keyof T][number]>,
) {
    return keys.every(
      (k) => obj[k] !== undefined && obj[k] !== null && obj[k] !== "",
    );
}
  