class Solution {
    public int[] twoSum(int[] numbers, int target) {
        int l = 0;
        int r = numbers.length - 1;
        while(l < r){
            int result = numbers[l] + numbers[r];

            if(result == target){
                return new int[] {l+1, r+1};
            } else if (result < target){
                l++;
            } else {
                r--;
            }
        }
        return new int[] {-1, -1};
    }
}
