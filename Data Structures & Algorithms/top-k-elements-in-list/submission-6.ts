class Solution {
    /**
     * @param {number[]} nums
     * @param {number} k
     * @return {number[]}
     */
    topKFrequent(nums: number[], k: number): number[] {
        const myMap = new Map();
        for(const num of nums){
            myMap.set(num, (myMap.get(num) ?? 0) +1);
        } 
        const sortedArr = [...myMap.entries()].sort((a, b) => b[1] - a[1]);
        return sortedArr.slice(0, k).map((num) => num[0]);
    }
}
