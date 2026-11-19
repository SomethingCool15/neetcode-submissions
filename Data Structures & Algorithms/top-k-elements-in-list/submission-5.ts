class Solution {
    /**
     * @param {number[]} nums
     * @param {number} k
     * @return {number[]}
     */
    topKFrequent(nums: number[], k: number): number[] {
        const map = new Map();
        for (const num of nums) {
            map.set(num, (map.get(num) ?? 0) + 1);
        }
        const entries = [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, k).map(([num, count]) => num);
        return entries;
    }
}
