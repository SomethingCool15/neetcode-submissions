class Solution {
    /**
     * @param {number[]} nums
     * @return {boolean}
     */
    hasDuplicate(nums) {
        const map = new Map();
        for(let i = 0; i < nums.length; i++){
            map.set(nums[i], map.get(nums[i]) == undefined ? 1 : map.get(nums[i]) + 1);
            console.log(map)
            if(map.get(nums[i]) > 1){
                return true
            }
        }
        return false
    }
}
