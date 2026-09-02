// Pretends to be the courier's server for local testing of the shipment
// tracking feature. Calls the app's own inbound endpoints in sequence:
//
//   1. POST /api/vendors/courier/shipments        (API key auth)
//        -> creates a shipment_jobs row, assigns a tracking number,
//           moves the order from binding to shipping
//   2. POST /api/webhooks/vendor { status: 'in_transit' }   (HMAC signed)
//   3. POST /api/webhooks/vendor { status: 'delivered' }    (HMAC signed)
//        -> moves the order from shipping to completed
//
// There is no UI button for this - it is a terminal command.
//
// Usage:
//   node --env-file=.env.local scripts/simulate-courier.mjs <orderId>
//   node --env-file=.env.local scripts/simulate-courier.mjs <orderId> --delay 3 --stop-at in_transit
//   node --env-file=.env.local scripts/simulate-courier.mjs <orderId> --base-url http://localhost:3001
import { createClient } from '@supabase/supabase-js';
import { createHash, createHmac, randomUUID } from 'node:crypto';

const VENDOR_WEBHOOK_SECRET = 'mock-vendor-webhook-secret';
const SIM_API_KEY = 'dev-courier-sim-key';
const SIM_CLIENT_NAME = 'courier-simulator (local dev)';
const STATUS_SEQUENCE = ['in_transit', 'delivered'];

function parseArgs(argv) {
  const args = {
    orderId: undefined,
    delay: 5,
    stopAt: 'delivered',
    baseUrl: 'http://localhost:3000',
  };
  const rest = argv.slice(2);

  for (let i = 0; i < rest.length; i += 1) {
    const token = rest[i];
    if (token === '--delay') {
      args.delay = Number(rest[(i += 1)]);
    } else if (token === '--stop-at') {
      args.stopAt = rest[(i += 1)];
    } else if (token === '--base-url') {
      args.baseUrl = rest[(i += 1)];
    } else if (!token.startsWith('--') && args.orderId === undefined) {
      args.orderId = token;
    }
  }

  return args;
}

const args = parseArgs(process.argv);

if (!args.orderId) {
  console.error(
    '사용법: node --env-file=.env.local scripts/simulate-courier.mjs <orderId> [--delay 5] [--stop-at in_transit|delivered] [--base-url http://localhost:3000]',
  );
  process.exit(1);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    'NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY 환경변수가 필요합니다. --env-file=.env.local로 실행하세요.',
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

function sleep(seconds) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

// Make sure an unrevoked vendor-role API key exists for SIM_API_KEY so the
// create-shipment endpoint accepts the simulator. Idempotent across runs.
async function ensureVendorApiKey() {
  const keyHash = createHash('sha256').update(SIM_API_KEY).digest('hex');
  const { data } = await supabase
    .from('api_keys')
    .select('id')
    .eq('key_hash', keyHash)
    .is('revoked_at', null)
    .maybeSingle();

  if (data) {
    return;
  }

  const { error } = await supabase
    .from('api_keys')
    .insert({ client_name: SIM_CLIENT_NAME, key_hash: keyHash, role: 'vendor' });

  if (error) {
    throw new Error(`API 키 프로비저닝 실패: ${error.message}`);
  }

  console.log(`vendor API 키 생성: ${SIM_API_KEY}`);
}

async function createShipment() {
  const response = await fetch(`${args.baseUrl}/api/vendors/courier/shipments`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${SIM_API_KEY}`,
    },
    body: JSON.stringify({ orderId: args.orderId }),
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(`배송 접수 실패 (${response.status}): ${JSON.stringify(payload)}`);
  }

  const shipment = payload?.data;
  if (!shipment?.id) {
    throw new Error(`예상치 못한 응답: ${JSON.stringify(payload)}`);
  }

  console.log(
    `배송 접수됨  운송장 ${shipment.trackingNumber}  jobId ${shipment.id}  status ${shipment.status}`,
  );
  return shipment.id;
}

async function pushStatus(jobId, status) {
  const body = JSON.stringify({ vendor: 'courier', jobId, status });
  const signature = createHmac('sha256', VENDOR_WEBHOOK_SECRET).update(body).digest('hex');

  const response = await fetch(`${args.baseUrl}/api/webhooks/vendor`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-vendor-webhook-signature': signature,
      'x-vendor-webhook-event-id': randomUUID(),
    },
    body,
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(`상태 전송 실패 ${status} (${response.status}): ${JSON.stringify(payload)}`);
  }

  console.log(`상태 전송됨  ${status}`);
}

async function main() {
  await ensureVendorApiKey();

  const jobId = await createShipment();

  const stopIndex = args.stopAt === 'in_transit' ? 1 : STATUS_SEQUENCE.length;
  const targets = STATUS_SEQUENCE.slice(0, stopIndex);

  for (const status of targets) {
    await sleep(args.delay);
    await pushStatus(jobId, status);
  }

  console.log('완료. 마이페이지 > 진행 이력에서 배송 추적을 확인하세요.');
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
