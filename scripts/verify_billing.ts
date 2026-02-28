import { recordBillingEvent, getBillingHistory } from '@/lib/services/subscriptions';

async function verifyBillingHistory() {
  const testUserId = 'f8cc3f37-6799-4c27-99e5-9f5e933f6785'; // Replace with a valid test user ID
  
  console.log('--- Testing recordBillingEvent ---');
  await recordBillingEvent({
    user_id: testUserId,
    paddle_subscription_id: 'sub_test_123',
    event_type: 'subscription_payment',
    amount_cents: 2900,
    currency: 'USD',
    status: 'paid',
    invoice_id: 'inv_test_001',
    invoice_url: 'https://example.com/invoice/001',
    occurred_at: new Date().toISOString()
  });
  console.log('✓ Recorded payment event');

  await recordBillingEvent({
    user_id: testUserId,
    paddle_subscription_id: 'sub_test_123',
    event_type: 'subscription.canceled',
    amount_cents: 0,
    currency: 'USD',
    status: 'canceled',
    occurred_at: new Date().toISOString()
  });
  console.log('✓ Recorded cancellation event');

  console.log('\n--- Testing getBillingHistory ---');
  const history = await getBillingHistory(testUserId);
  console.log('History count:', history.length);
  console.log('Latest event:', JSON.stringify(history[0], null, 2));

  if (history.length >= 2) {
    console.log('\n✓ Success: Billing history recorded and retrieved correctly.');
  } else {
    console.log('\n✖ Failure: Billing history not retrieved correctly.');
  }
}

// verifyBillingHistory();
