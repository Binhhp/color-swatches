/// <reference types="vite/client" />
declare interface String {
  format(...args: string[]): string;
}

declare interface Window {
  step: number;
  orichi_colorswatches: {
    option_setting: any[];
  };
}
