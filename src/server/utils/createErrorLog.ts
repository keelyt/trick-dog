export default function createErrorLog(method: string, errDetail: string | object) {
  return `${method} ERROR: ${
    typeof errDetail === 'object' ? JSON.stringify(errDetail) : errDetail
  }`;
}
