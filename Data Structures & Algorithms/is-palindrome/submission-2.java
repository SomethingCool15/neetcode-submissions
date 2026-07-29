class Solution {
    public boolean isPalindrome(String s) {
        String formattedString = s.toLowerCase().replaceAll("[^a-zA-Z0-9]", "");
        int j = formattedString.length() - 1;
        for(int i = 0; i < formattedString.length() / 2; i++){
            if(formattedString.charAt(i) != formattedString.charAt(j)){
                return false;
            }
            j--;
        }
        return true;
    }
}
