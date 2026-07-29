class Solution {
    /**
     * @param {string} s
     * @return {boolean}
     */
    isPalindrome(s) {
        let validated = s.toLowerCase().replace(/\W/g, '');
        for(let i = 0, j = validated.length - 1; i < validated.length; i++, j--){
            if(validated[i] !== validated[j]){
                return false
            }
        }
        return true
    }
}
