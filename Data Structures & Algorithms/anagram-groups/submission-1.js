class Solution {
    /**
     * @param {string[]} strs
     * @return {string[][]}
     */
    groupAnagrams(strs) {
        const map = new Map();
        strs.forEach((i, j) => {
            const sortedString = i.split("").sort().join("");
            if (!map.has(sortedString)) {
                map.set(sortedString, []);
            }
            map.get(sortedString).push(strs[j]);
        });
        return Array.from(map.values());
    }
}
