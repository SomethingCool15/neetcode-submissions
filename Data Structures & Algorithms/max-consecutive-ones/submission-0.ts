class Solution {
    /**
     * @param {number[]} nums
     * @return {number}
     */
    findMaxConsecutiveOnes(nums: number[]): number {
        let max = 0;
        let con = 0;

        for(let i = 0; i < nums.length; i++){
            if(nums[i] === 1){
                con++;
                if(con > max){
                    max = con;
                }
            } else {
                con = 0;
            }
        }
        return max;
    }
}
