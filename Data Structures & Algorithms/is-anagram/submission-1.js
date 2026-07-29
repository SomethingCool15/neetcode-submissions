class Solution {
    /**
     * @param {string} s
     * @param {string} t
     * @return {boolean}
     */
    isAnagram(s, t) {
        let sortedS = s.split("").sort().join();
        let sortedT = t.split("").sort().join();
        if(sortedS === sortedT){
            return true
        }
        return false
    }
}
