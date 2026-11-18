class Solution {
    /**
     * @param {number[]} nums
     * @param {number} val
     * @return {number}
     */
    removeElement(nums: number[], val: number): number {
        let j = nums.length;
        let i = 0;
        while(i < j){
            if(nums[i] === val){
                j--;
                nums[i] = nums[j]
            } else {
                i++
            }
        }
        return j;
    }
}
