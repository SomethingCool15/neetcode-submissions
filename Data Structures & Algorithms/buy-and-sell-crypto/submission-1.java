class Solution {
    public int maxProfit(int[] prices) {
        int profit = 0;
        int l = 0;
        int r = 1;
        while(r < prices.length){
            System.out.println("l: "+prices[l]);
            System.out.println("r: "+prices[r]);
            if(prices[l] < prices[r]){
                profit = Math.max(profit, prices[r] - prices[l]);
            } else {
                l = r;
            }
            r++;
        }
        return profit;
    }
}
