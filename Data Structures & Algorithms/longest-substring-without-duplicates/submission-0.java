class Solution {
    public int lengthOfLongestSubstring(String s) {
        Set<Character> seen = new HashSet<>();
        int longestSeen = seen.size();
        int l = 0;
        int r = 0;

        while(r < s.length()){
            if(seen.add(s.charAt(r))){
                seen.add(s.charAt(r));
                longestSeen = Math.max(longestSeen, seen.size());
                r++;
            } else {
                seen.remove(s.charAt(l));
                l++;
            }
        }
        return longestSeen;
    }
}
