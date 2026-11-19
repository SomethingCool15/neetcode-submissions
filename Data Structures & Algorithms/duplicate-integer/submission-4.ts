class Solution {
    /**
     * @param {number[]} nums
     * @return {boolean}
     */
    hasDuplicate(nums: number[]): boolean {
        const a = new Set();
        for(const num of nums){
            if(!a.has(num)){
                a.add(num)
            } else{
                return true;
            }
        }
        return false;
    }
}
