import { writeFileSync } from 'node:fs'
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#071018"/><path d="M14 42 L32 14 L50 42 Z" fill="none" stroke="#3ecfbf" stroke-width="3"/><circle cx="32" cy="34" r="6" fill="#d4b46a"/></svg>`
writeFileSync('public/favicon.svg', svg)
console.log('icons ready')
