class Solution {
    public int[] twoSum(int[] nums, int target) {
        HashMap<Integer, Integer> numMap = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int remainder = target - nums[i];
            System.out.println(remainder);
            if(numMap.containsKey(remainder)){
                return new int[] {numMap.get(remainder), i};
            }
            numMap.put(nums[i], i);
        }
        return new int[] {-1, -1};
    }
}
