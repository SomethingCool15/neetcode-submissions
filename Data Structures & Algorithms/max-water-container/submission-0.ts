class Solution {
    /**
     * @param {number[]} heights
     * @return {number}
     */
    maxArea(heights: number[]): number {
        let l = 0;
        let r = heights.length - 1;
        let best = 0

        while(l < r){
            const area = (r - l) * Math.min(heights[l], heights[r]);
            if(area > best){
                best = area;
            }
            if (heights[l] < heights[r]) {
            l++;
        } else {
            r--;
        }
        }

        return best;
    }
}
