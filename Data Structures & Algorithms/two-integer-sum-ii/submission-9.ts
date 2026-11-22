class Solution {
    /**
     * @param {number[]} numbers
     * @param {number} target
     * @return {number[]}
     */
    twoSum(numbers: number[], target: number): number[] {
        let l = 0;
        let r = numbers.length - 1;
        while(l < r){
            if(numbers[l] + numbers[r] === target) return [l+1, r+1]
            if(numbers[r] + numbers[l] > target){
                r--;
            } else {
                l++;
            }
        }

        return [];
    }
}
