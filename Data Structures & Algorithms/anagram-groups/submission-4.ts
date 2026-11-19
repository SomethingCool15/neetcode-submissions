class Solution {
    /**
     * @param {string[]} strs
     * @return {string[][]}
     */
    groupAnagrams(strs: string[]): string[][] {
        const myMap = new Map();
        for(const str of strs){
            const sortedString = str.split("").sort().join("")
            if(!myMap.has(sortedString)) myMap.set(sortedString, []);
            myMap.get(sortedString).push(str);
        }
        return [...myMap.values()];
    }
}
