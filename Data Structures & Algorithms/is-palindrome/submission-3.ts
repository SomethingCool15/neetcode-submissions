class Solution {
    /**
     * @param {string} s
     * @return {boolean}
     */
    isPalindrome(s: string): boolean {
        const cleanString = s.replace(/[^a-zA-Z0-9]/g, '').toLocaleLowerCase();
        let l = 0;
        let r = cleanString.length - 1;
        while(l < r){
            if(cleanString[l] === cleanString[r]){
                l++
                r--
            } else {
                return false;
            }
        }
        return true;
    }
}
