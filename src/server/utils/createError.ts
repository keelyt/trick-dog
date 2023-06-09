import type { ExpressError } from '../../types';

export interface CreateErrorParams {
  method: string;
  status: number;
  errDetail: string;
  errMessage: string;
}

export default function createError({
  method,
  status,
  errDetail,
  errMessage,
}: CreateErrorParams): ExpressError {
  return {
    log: `${method} ERROR: ${
      typeof errDetail === 'object' ? JSON.stringify(errDetail) : errDetail
    }`,
    status,
    message: {
      error: errMessage,
    },
  };
}
