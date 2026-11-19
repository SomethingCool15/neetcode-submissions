class Solution {
    isValid(s: string): boolean {
        const stack: string[] = [];

        for (const b of s) {
            if (b === '(' || b === '[' || b === '{') {
                stack.push(b);
            } else {
                const topElement = stack[stack.length - 1];

                if (b === ')' && topElement === '(') {
                    stack.pop();
                } else if (b === ']' && topElement === '[') {
                    stack.pop();
                } else if (b === '}' && topElement === '{') {
                    stack.pop();
                } else {
                    return false;
                }
            }
        }

        return stack.length === 0;
    }
}
