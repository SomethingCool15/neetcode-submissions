class Solution {
    /**
     * @param {number[]} prices
     * @return {number}
     */
    maxProfit(prices: number[]): number {
        let maxProfit = 0;
        let left = 0;

        for(let right = 1; right < prices.length; right++){
            if(prices[right] < prices[left]){
                left = right;
            } else {
               maxProfit = Math.max(prices[right] - prices[left], maxProfit);
            }
        }
        return maxProfit;
    }
}
