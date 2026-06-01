# Load Testing Strategy (k6)

To validate the `/[username]` profile endpoint, we use **k6** to simulate high concurrency traffic.

## 1. Installation
Install k6 on a separate machine from your VPS (to avoid network bottlenecking on the same interface).
```bash
sudo apt install k6
```

## 2. Test Scripts

### Standard Load Test (1,000 Users)
`load-1k.js`
```javascript
import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  vus: 1000,
  duration: '1m',
};

export default function () {
  const res = http.get('https://indlink.in/nived');
  check(res, { 'status was 200': (r) => r.status == 200 });
  sleep(1);
}
```

### Spike Test (10,000 Users)
Validates system behavior when a creator goes viral on TikTok/Instagram.
```javascript
export const options = {
  stages: [
    { duration: '10s', target: 10000 }, // fast ramp-up
    { duration: '1m', target: 10000 }, // hold
    { duration: '10s', target: 0 },    // scale down
  ],
};
// ... http.get() logic
```

## 3. Success Metrics
*   **Latency:** p(95) < 500ms
*   **Error Rate:** < 1% (HTTP 500s)
*   **Bottleneck Checks:** Monitor Node.js CPU usage and MySQL Max Connections during tests.
