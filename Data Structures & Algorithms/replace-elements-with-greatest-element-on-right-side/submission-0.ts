class Solution {
    /**
     * @param {number[]} arr
     * @return {number[]}
     */
    replaceElements(arr: number[]): number[] {
        let maxRight = -1;

        for(let i = arr.length - 1; i >= 0; i--){
            let current = arr[i];

            arr[i] = maxRight;

            maxRight = Math.max(maxRight, current);
        }
        return arr;
    }
}
