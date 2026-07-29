class Solution {
    /**
     * @param {number[]} nums
     * @param {number} target
     * @return {number[]}
     */
    twoSum(nums, target) {
        const twoMap = new Map();
        for(let i = 0; i < nums.length; i++){
            const difference = target - nums[i];
                        if(twoMap.has(difference)){
                return [twoMap.get(difference), i]
            }
            twoMap.set(nums[i], i);
        }
    }
}
