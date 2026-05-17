export interface CodingQuestion {
  id: number; title: string; desc: string; difficulty: 'Easy'|'Medium'|'Hard';
  starter: string; testCases: {input:string;expected:string}[];
}

export const CODING_STACKS = ['javascript','python','cpp','typescript','sql','react','nodejs','nextjs'] as const;

const JS: CodingQuestion[] = [
  {id:1,title:'Reverse a String',desc:'Write a function `reverseString(s)` that returns the reversed string.',difficulty:'Easy',starter:'function reverseString(s) {\n  // your code\n}',testCases:[{input:'reverseString("hello")',expected:'"olleh"'},{input:'reverseString("world")',expected:'"dlrow"'},{input:'reverseString("")',expected:'""'}]},
  {id:2,title:'Find Largest in Array',desc:'Write a function `findLargest(arr)` that returns the largest number.',difficulty:'Easy',starter:'function findLargest(arr) {\n  // your code\n}',testCases:[{input:'findLargest([1,5,3])',expected:'5'},{input:'findLargest([-1,-5,-3])',expected:'-1'},{input:'findLargest([42])',expected:'42'}]},
  {id:3,title:'Factorial',desc:'Write a function `factorial(n)` that returns n!.',difficulty:'Easy',starter:'function factorial(n) {\n  // your code\n}',testCases:[{input:'factorial(5)',expected:'120'},{input:'factorial(0)',expected:'1'},{input:'factorial(1)',expected:'1'}]},
  {id:4,title:'Palindrome Check',desc:'Write `isPalindrome(s)` returning true/false.',difficulty:'Easy',starter:'function isPalindrome(s) {\n  // your code\n}',testCases:[{input:'isPalindrome("racecar")',expected:'true'},{input:'isPalindrome("hello")',expected:'false'}]},
  {id:5,title:'Remove Duplicates',desc:'Write `removeDups(arr)` returning array with no duplicates.',difficulty:'Medium',starter:'function removeDups(arr) {\n  // your code\n}',testCases:[{input:'removeDups([1,2,2,3])',expected:'[1,2,3]'},{input:'removeDups([1,1,1])',expected:'[1]'}]},
  {id:6,title:'Count Vowels',desc:'Write `countVowels(s)` returning the vowel count.',difficulty:'Easy',starter:'function countVowels(s) {\n  // your code\n}',testCases:[{input:'countVowels("hello")',expected:'2'},{input:'countVowels("xyz")',expected:'0'}]},
  {id:7,title:'Fibonacci',desc:'Write `fib(n)` returning the nth Fibonacci number.',difficulty:'Medium',starter:'function fib(n) {\n  // your code\n}',testCases:[{input:'fib(6)',expected:'8'},{input:'fib(0)',expected:'0'},{input:'fib(1)',expected:'1'}]},
  {id:8,title:'Flatten Array',desc:'Write `flatten(arr)` to flatten nested arrays.',difficulty:'Medium',starter:'function flatten(arr) {\n  // your code\n}',testCases:[{input:'flatten([1,[2,[3]]])',expected:'[1,2,3]'},{input:'flatten([[1,2],[3]])',expected:'[1,2,3]'}]},
  {id:9,title:'Sum of Array',desc:'Write `sumArray(arr)` returning the sum.',difficulty:'Easy',starter:'function sumArray(arr) {\n  // your code\n}',testCases:[{input:'sumArray([1,2,3])',expected:'6'},{input:'sumArray([])',expected:'0'}]},
  {id:10,title:'Prime Check',desc:'Write `isPrime(n)` returning true if prime.',difficulty:'Medium',starter:'function isPrime(n) {\n  // your code\n}',testCases:[{input:'isPrime(7)',expected:'true'},{input:'isPrime(4)',expected:'false'},{input:'isPrime(1)',expected:'false'}]},
];

const PY: CodingQuestion[] = [
  {id:1,title:'Two Sum',desc:'Write `two_sum(nums, target)` returning indices of two numbers that add to target.',difficulty:'Medium',starter:'def two_sum(nums, target):\n    # your code\n    pass',testCases:[{input:'two_sum([2,7,11], 9)',expected:'[0, 1]'},{input:'two_sum([3,2,4], 6)',expected:'[1, 2]'}]},
  {id:2,title:'Matrix Transpose',desc:'Write `transpose(matrix)` to transpose a 2D list.',difficulty:'Medium',starter:'def transpose(matrix):\n    # your code\n    pass',testCases:[{input:'transpose([[1,2],[3,4]])',expected:'[[1, 3], [2, 4]]'}]},
  {id:3,title:'Binary Search',desc:'Write `binary_search(arr, target)` returning index or -1.',difficulty:'Medium',starter:'def binary_search(arr, target):\n    # your code\n    pass',testCases:[{input:'binary_search([1,3,5,7], 5)',expected:'2'},{input:'binary_search([1,3,5], 4)',expected:'-1'}]},
  {id:4,title:'Merge Sorted Lists',desc:'Write `merge_sorted(a, b)` merging two sorted lists.',difficulty:'Medium',starter:'def merge_sorted(a, b):\n    # your code\n    pass',testCases:[{input:'merge_sorted([1,3],[2,4])',expected:'[1, 2, 3, 4]'}]},
  {id:5,title:'Anagram Check',desc:'Write `is_anagram(s1, s2)` returning True/False.',difficulty:'Easy',starter:'def is_anagram(s1, s2):\n    # your code\n    pass',testCases:[{input:'is_anagram("listen","silent")',expected:'True'},{input:'is_anagram("hello","world")',expected:'False'}]},
];

const CPP: CodingQuestion[] = [
  {id:1,title:'Reverse Array',desc:'Write a function to reverse an integer array in-place.',difficulty:'Easy',starter:'#include <vector>\nusing namespace std;\n\nvector<int> reverseArr(vector<int> arr) {\n  // your code\n  return arr;\n}',testCases:[{input:'reverseArr({1,2,3})',expected:'{3,2,1}'},{input:'reverseArr({5})',expected:'{5}'}]},
  {id:2,title:'Max Subarray Sum',desc:'Find the maximum sum of a contiguous subarray (Kadane\'s).',difficulty:'Hard',starter:'int maxSubarraySum(vector<int>& nums) {\n  // your code\n  return 0;\n}',testCases:[{input:'maxSubarraySum({-2,1,-3,4,-1,2,1,-5,4})',expected:'6'},{input:'maxSubarraySum({1})',expected:'1'}]},
  {id:3,title:'Sort Array',desc:'Implement bubble sort on an integer array.',difficulty:'Easy',starter:'vector<int> bubbleSort(vector<int> arr) {\n  // your code\n  return arr;\n}',testCases:[{input:'bubbleSort({3,1,2})',expected:'{1,2,3}'}]},
  {id:4,title:'GCD of Two Numbers',desc:'Write a function to find GCD using Euclidean algorithm.',difficulty:'Easy',starter:'int gcd(int a, int b) {\n  // your code\n  return 0;\n}',testCases:[{input:'gcd(12,8)',expected:'4'},{input:'gcd(7,3)',expected:'1'}]},
  {id:5,title:'Power Function',desc:'Write `power(base, exp)` without using pow().',difficulty:'Medium',starter:'long long power(int base, int exp) {\n  // your code\n  return 0;\n}',testCases:[{input:'power(2,10)',expected:'1024'},{input:'power(3,0)',expected:'1'}]},
];

const TS: CodingQuestion[] = [
  {id:1,title:'Generic Stack',desc:'Implement a generic Stack<T> class with push, pop, peek.',difficulty:'Medium',starter:'class Stack<T> {\n  private items: T[] = [];\n  push(item: T): void { /* code */ }\n  pop(): T | undefined { /* code */ return undefined; }\n  peek(): T | undefined { /* code */ return undefined; }\n}',testCases:[{input:'const s = new Stack<number>(); s.push(1); s.push(2); s.pop()',expected:'2'},{input:'s.peek()',expected:'1'}]},
  {id:2,title:'Type Guard',desc:'Write a type guard `isString(val)` for string type.',difficulty:'Easy',starter:'function isString(val: unknown): val is string {\n  // your code\n  return false;\n}',testCases:[{input:'isString("hello")',expected:'true'},{input:'isString(42)',expected:'false'}]},
  {id:3,title:'Merge Objects',desc:'Write `mergeObjects<T,U>(a:T, b:U)` merging two objects.',difficulty:'Easy',starter:'function mergeObjects<T extends object, U extends object>(a: T, b: U): T & U {\n  // your code\n  return {} as T & U;\n}',testCases:[{input:'mergeObjects({a:1},{b:2})',expected:'{"a":1,"b":2}'}]},
  {id:4,title:'Enum Days',desc:'Create a Days enum and a function returning if it is a weekend.',difficulty:'Easy',starter:'enum Days { Mon, Tue, Wed, Thu, Fri, Sat, Sun }\nfunction isWeekend(d: Days): boolean {\n  // your code\n  return false;\n}',testCases:[{input:'isWeekend(Days.Sat)',expected:'true'},{input:'isWeekend(Days.Mon)',expected:'false'}]},
  {id:5,title:'Readonly Deep',desc:'Write a function that deep freezes an object.',difficulty:'Hard',starter:'function deepFreeze<T extends object>(obj: T): Readonly<T> {\n  // your code\n  return obj;\n}',testCases:[{input:'const o = deepFreeze({a:{b:1}}); typeof o',expected:'"object"'}]},
];

const SQL_Q: CodingQuestion[] = [
  {id:1,title:'Second Highest Salary',desc:'Write a query to find the second highest salary from Employee table.',difficulty:'Medium',starter:'-- Table: Employee(id, name, salary)\nSELECT -- your query',testCases:[{input:'Employee: [(1,"A",100),(2,"B",200),(3,"C",150)]',expected:'150'}]},
  {id:2,title:'Duplicate Records',desc:'Write a query to find duplicate emails in a Users table.',difficulty:'Easy',starter:'-- Table: Users(id, email)\nSELECT -- your query',testCases:[{input:'Users: [(1,"a@b.com"),(2,"c@d.com"),(3,"a@b.com")]',expected:'"a@b.com"'}]},
  {id:3,title:'Department Avg Salary',desc:'Find employees earning above their department average.',difficulty:'Hard',starter:'-- Tables: Employee(id, name, salary, dept_id), Department(id, name)\nSELECT -- your query',testCases:[{input:'Employees with above-avg salary in their dept',expected:'Filtered rows'}]},
];

const REACT_Q: CodingQuestion[] = [
  {id:1,title:'Counter Component',desc:'Build a counter with increment, decrement, reset buttons using useState.',difficulty:'Easy',starter:'import { useState } from "react";\n\nexport default function Counter() {\n  // your code\n  return <div>Counter</div>;\n}',testCases:[{input:'Click increment 3 times',expected:'Count: 3'},{input:'Click reset',expected:'Count: 0'}]},
  {id:2,title:'Todo List',desc:'Build a todo app with add, delete, and toggle complete.',difficulty:'Medium',starter:'import { useState } from "react";\n\nexport default function TodoApp() {\n  // your code\n  return <div>Todo</div>;\n}',testCases:[{input:'Add "Buy milk"',expected:'List shows "Buy milk"'},{input:'Toggle complete',expected:'Item crossed out'}]},
  {id:3,title:'Search Filter',desc:'Build a component that filters a list based on search input.',difficulty:'Easy',starter:'import { useState } from "react";\nconst items = ["Apple","Banana","Cherry","Date"];\n\nexport default function SearchFilter() {\n  // your code\n  return <div>Search</div>;\n}',testCases:[{input:'Type "an"',expected:'Shows "Banana"'}]},
];

const NODE_Q: CodingQuestion[] = [
  {id:1,title:'HTTP Server',desc:'Create a simple HTTP server that responds with JSON.',difficulty:'Easy',starter:'const http = require("http");\n\n// Create server on port 3001\n// GET / => {"message": "Hello"}\n',testCases:[{input:'GET /',expected:'{"message":"Hello"}'},{input:'Status code',expected:'200'}]},
  {id:2,title:'File Reader',desc:'Write a function to read a file and count words.',difficulty:'Easy',starter:'const fs = require("fs");\n\nfunction countWords(filePath) {\n  // your code\n  return 0;\n}',testCases:[{input:'countWords("hello world test")',expected:'3'}]},
  {id:3,title:'Express Middleware',desc:'Create a logging middleware that logs method + URL.',difficulty:'Medium',starter:'// Express middleware\nfunction logger(req, res, next) {\n  // your code\n  next();\n}',testCases:[{input:'GET /api/users',expected:'Log: GET /api/users'}]},
];

const NEXT_Q: CodingQuestion[] = [
  {id:1,title:'API Route',desc:'Create a Next.js API route that returns user data.',difficulty:'Easy',starter:'// pages/api/users.ts\nexport default function handler(req, res) {\n  // your code\n}',testCases:[{input:'GET /api/users',expected:'[{id:1,name:"User"}]'}]},
  {id:2,title:'Dynamic Route',desc:'Create a dynamic [id] page that displays product info.',difficulty:'Medium',starter:'// app/product/[id]/page.tsx\nexport default function Product({ params }) {\n  // your code\n  return <div>Product</div>;\n}',testCases:[{input:'/product/1',expected:'Shows product 1 details'}]},
  {id:3,title:'SSR Page',desc:'Create a page with server-side data fetching.',difficulty:'Medium',starter:'// Fetch data server-side\nexport default async function Page() {\n  // your code\n  return <div>SSR</div>;\n}',testCases:[{input:'Load page',expected:'Shows fetched data'}]},
];

export const codingQuestionBanks: Record<string, CodingQuestion[]> = {
  javascript: JS, python: PY, cpp: CPP, typescript: TS,
  sql: SQL_Q, react: REACT_Q, nodejs: NODE_Q, nextjs: NEXT_Q,
};

export function getRandomCodingQuestions(stack: string, count = 2): CodingQuestion[] {
  const bank = codingQuestionBanks[stack] || codingQuestionBanks.javascript;
  const shuffled = [...bank].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
