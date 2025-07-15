/// <reference types="vite/client" />
declare interface String {
  format(...args: string[]): string;
}

declare interface Window {
  step: number;
}
