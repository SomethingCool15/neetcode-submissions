class Solution {
    /**
     * @param {number[]} nums
     * @param {number} k
     * @return {number[]}
     */
    topKFrequent(nums, k) {
        const map = new Map();
        nums.forEach((i) => {
            map.has(i) ? map.set(i, map.get(i) + 1) : map.set(i, 1);
        });
        const sortedArray = Array.from(map).sort((a, b) => b[1] - a[1]);
        return sortedArray.slice(0, k).map(([key]) => key)
    }
}
