class Solution {
    /**
     * @param {string} s
     * @return {number}
     */
    lengthOfLongestSubstring(s: string): number {
        const mySet = new Set();
        let longest = 0;
        let left = 0;

        for(let right = 0; right < s.length; right++){
            while(mySet.has(s[right])){
                mySet.delete(s[left]);
                left++;
            }
            mySet.add(s[right]);
            longest = Math.max(longest, mySet.size);
        }
        return longest;
    }
}
