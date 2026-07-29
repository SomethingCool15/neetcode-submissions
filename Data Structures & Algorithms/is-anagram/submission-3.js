class Solution {
    /**
     * @param {string} s
     * @param {string} t
     * @return {boolean}
     */
    isAnagram(s, t) {
        const sorted1 = s.split("").sort().join("");
        const sorted2 = t.split("").sort().join("");
        if(sorted1 === sorted2){
            return true;
        }
        return false;
    }
}
