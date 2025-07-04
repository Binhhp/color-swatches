/* eslint-disable @typescript-eslint/no-explicit-any */
export interface RequestModel {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: any;
  nonTimezone?: boolean;
}
