class Solution {
    /**
     * @param {string} s
     * @param {string} t
     * @return {boolean}
     */
    isAnagram(s: string, t: string): boolean {
        const a = s.split('').sort().join('');
        const b = t.split('').sort().join('');

        if(a === b){
            return true;
        }

        return false;
    }
}
