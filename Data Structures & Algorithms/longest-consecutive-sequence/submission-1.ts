class Solution {
    /**
     * @param {number[]} nums
     * @return {number}
     */
    longestConsecutive(nums: number[]): number {
        const mySet = new Set(nums);
        let longestSeen = 0;
        mySet.forEach((value) => {
            let currentStreak = 0;
            if (!mySet.has(value - 1)) {
                currentStreak++;
                while (mySet.has(value + currentStreak)) {
                    currentStreak++;
                }
            }
            longestSeen = Math.max(longestSeen, currentStreak);
        });
        return longestSeen;
    }
}
