class Solution {
    /**
     * @param {number[][]} matrix
     * @param {number} target
     * @return {boolean}
     */
    searchMatrix(matrix: number[][], target: number): boolean {
        const rows = matrix.length;
        const cols = matrix[0].length;

        let lo = 0;
        let hi = rows * cols - 1;

        while (lo <= hi) {
            const mid = Math.floor((lo + hi) / 2);
            const row = Math.floor(mid / cols);
            const col = mid % cols;
            const value = matrix[row][col];

            if (value === target) {
                return true;
            } else if (value < target) {
                lo = mid + 1;
            } else {
                hi = mid - 1;
            }
        }
        return false;
    }
}
