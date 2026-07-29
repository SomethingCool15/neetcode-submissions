class Solution {
    public int[] topKFrequent(int[] nums, int k) {
        HashMap<Integer, Integer> kMap = new HashMap<>();
        for(int i = 0; i < nums.length; i++){
            kMap.put(nums[i], kMap.getOrDefault(nums[i], 0) + 1);
        }
         
        ArrayList<Map.Entry<Integer, Integer>> kList = new ArrayList<>(kMap.entrySet());
        Collections.sort(kList, (a, b) -> b.getValue().compareTo(a.getValue()));
        
        int[] result = new int[k];
        for(int i = 0; i < k; i++) {
            result[i] = kList.get(i).getKey();
        }
        return result;
    }
}
