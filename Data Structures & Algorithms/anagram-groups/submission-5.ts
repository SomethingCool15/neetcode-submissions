class Solution {
    /**
     * @param {string[]} strs
     * @return {string[][]}
     */
    groupAnagrams(strs: string[]): string[][] {
        // Loop over strs
        // split('').sort().join('')
        // if(!map.get(sortedStr)) map.set(sortedstr, [])
        // else
        // mao.get(sortedStr).push(strs[i])
        const anaMap = new Map();
        if(!strs) return [[""]];
        if(strs.length < 2) return [[...strs]]
        for (let i = 0; i < strs.length; i++) {
            let sortedStr = strs[i].split("").sort().join();
            if (!anaMap.get(sortedStr)) anaMap.set(sortedStr, []);
            anaMap.get(sortedStr).push(strs[i]);
        }

        return [...anaMap.values()]
    }
}
