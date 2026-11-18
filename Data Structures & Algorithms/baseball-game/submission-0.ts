class Solution {
    calPoints(operations: string[]): number {
        const stack: number[] = [];

        for (const op of operations) {
            if (op === "+") {
                const last = stack[stack.length - 1];
                const secondLast = stack[stack.length - 2];

                stack.push(last + secondLast);
            } else if (op === "D") {
                const last = stack[stack.length - 1];

                stack.push(last * 2);
            } else if (op === "C") {
                stack.pop();
            } else {
                stack.push(Number(op));
            }
        }

        return stack.reduce((sum, currentIndex) => {
            return sum + currentIndex;
        }, 0)
    }
}