/* eslint-disable @typescript-eslint/no-explicit-any */

import type { RequestModel } from "@/models/api/request.model";
import { ResponseModel } from "@/models/api/response.model";
import rootStore from "@/stores/root";

const BaseURL = "api";

export async function ApiHandler<TypeResult>(
  req: RequestModel
): Promise<ResponseModel<TypeResult>> {
  const authAxios = rootStore.getState().authAxios;

  try {
    const response = await authAxios({
      method: req.method,
      data: req.body,
      url: `${BaseURL}${req.url}`
    });
    const res = response.data;
    const result = new ResponseModel<TypeResult>(res?.status, res?.statusCode);
    if (res?.result) {
      result.AddResult(res?.result);
    }
    if (res?.message) {
      result.AddMessage(res?.message);
    }
    if (!res.status) {
      return Promise.reject(res.message as string);
    }
    return Promise.resolve(res);
  } catch (err: any) {
    return Promise.reject(err.response?.data as ResponseModel<TypeResult>);
  }
}
