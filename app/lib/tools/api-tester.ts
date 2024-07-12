import { APITestResults } from "@/app/types";


export function formatAutocannonResults(results: APITestResults): string {
  const { url, connections, duration, errors, timeouts, non2xx, resets, statusCodeStats, latency, requests, throughput } = results;

  return `
Autocannon Results:
-------------------
URL: ${url}
Connections: ${connections}
Duration: ${duration.toFixed(2)} seconds

Errors: ${errors}
Timeouts: ${timeouts}
Non-2xx Responses: ${non2xx}
Connection Resets: ${resets}

Status Codes:
-------------
${Object.keys(statusCodeStats||{}).map(code => `  ${code}: ${(statusCodeStats||{})[code as any].count}`).join('\n')}

Latency (ms):
-------------
  Average: ${latency.average.toFixed(2)}
  Min: ${latency.min}
  Max: ${latency.max}
  Stddev: ${latency.stddev.toFixed(2)}
  Percentiles:
    50th: ${latency.p50}
    90th: ${latency.p90}
    99th: ${latency.p99}

Requests:
---------
  Average: ${requests.average.toFixed(2)}/s
  Total: ${requests.total}
  Min: ${requests.min}
  Max: ${requests.max}
  Stddev: ${requests.stddev.toFixed(2)}
  Sent: ${requests.sent}
  Percentiles:
    50th: ${requests.p50}
    90th: ${requests.p90}
    99th: ${requests.p99}

Throughput (bytes/sec):
-----------------------
  Average: ${(throughput.average / 1e6).toFixed(2)} MB/s
  Total: ${(throughput.total / 1e6).toFixed(2)} MB
  Min: ${(throughput.min / 1e6).toFixed(2)} MB/s
  Max: ${(throughput.max / 1e6).toFixed(2)} MB/s
  Stddev: ${(throughput.stddev / 1e6).toFixed(2)} MB/s
  Percentiles:
    50th: ${(throughput.p50 / 1e6).toFixed(2)} MB/s
    90th: ${(throughput.p90 / 1e6).toFixed(2)} MB/s
    99th: ${(throughput.p99 / 1e6).toFixed(2)} MB/s
  `;
}

