class Solution {
    /**
     * @param {string[]} strs
     * @return {string[][]}
     */
    groupAnagrams(strs: string[]): string[][] {
        const myMap = new Map();
        for(let i = 0; i < strs.length; i++){
            const sortedString = strs[i].split("").sort().join("")
            if(!myMap.has(sortedString)) myMap.set(sortedString, []);
            myMap.get(sortedString).push(strs[i]);
        }
        return [...myMap.values()];
    }
}
