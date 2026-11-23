class Solution {
    /**
     * @param {number[]} nums
     * @return {number[][]}
     */
    threeSum(nums: number[]): number[][] {
        nums.sort((a, b) => a - b);
        let returnArray = [];
        for(let i = 0; i < nums.length; i++){
            if (nums[i] === nums[i-1]) continue;
            let j = i+1;
            let k = nums.length -1;
            while(j < k){
                if(nums[i] + nums[k] + nums[j] === 0) {
                    returnArray.push([nums[i], nums[k], nums[j]])
                    j++;
                    k--;
                    while(nums[j] === nums[j-1]){
                        j++
                    }
                } else if(nums[i] + nums[k] + nums[j] > 0) {
                    k--;
                } else {
                    j++;
                }
            }
        }
        return [...returnArray]
    }
}
