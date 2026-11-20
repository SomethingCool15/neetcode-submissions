class Solution {
    /**
     * @param nums {number[]}
     * @return {number[]}
     */
    productExceptSelf(nums: number[]): number[] {
        const output: number[] = [];

        let prefix = 1;

        // Store product of all elements to the left
        for (let i = 0; i < nums.length; i++) {
            output[i] = prefix;
            prefix *= nums[i];
        }

        let postfix = 1;

        // Multiply by product of all elements to the right
        for (let i = nums.length - 1; i >= 0; i--) {
            output[i] *= postfix;
            postfix *= nums[i];
        }

        return output;
    }
}