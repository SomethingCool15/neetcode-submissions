class Solution {
    /**
     * @param {number[]} nums
     * @param {number} target
     * @return {number}
     */
    search(nums: number[], target: number): number {
        let low = 0;
        let hi = nums.length - 1;

        while(low <= hi){
            const mid = Math.floor((low + hi) / 2);

            if(nums[mid] === target){
                return mid;
            } else if (nums[mid] < target) {
                low = mid + 1;
            } else {
                hi = mid - 1
            }
        }
        return -1;
    }
}
