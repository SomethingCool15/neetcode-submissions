// 

class Solution {
    public boolean isAnagram(String s, String t) {
        HashMap<Character, Integer> charCount = new HashMap<>();
        if(s.length() != t.length()){
            return false;
        }
        
        for(char c : s.toCharArray()) {
            charCount.put(c, charCount.getOrDefault(c, 0) + 1);
        }

        for(char c : t.toCharArray()){
            if(!charCount.containsKey(c) || charCount.get(c) <= 0){
                return false;
            }
            charCount.put(c, charCount.get(c) - 1);
        }
        return true;
    }
}
