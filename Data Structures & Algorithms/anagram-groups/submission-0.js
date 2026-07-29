class Solution {
    /**
     * @param {string[]} strs
     * @return {string[][]}
     */
    groupAnagrams(strs) {
        const sortedArray = strs.map((str => str.split("").sort().join("")));
        let map = {};
        for(let i = 0; i < sortedArray.length; i++){
            if(!map[sortedArray[i]]){
                map[sortedArray[i]] = [strs[i]]
            } else {
                map[sortedArray[i]].push(strs[i])
            }
        }

        return Object.values(map);
    }
}
