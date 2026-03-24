require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkQuotes() {
  const { data, error } = await supabase.from('quotes').select('*').order('created_at', { ascending: false }).limit(5);
  if (error) {
    console.error('Error:', error);
    return;
  }
  console.log('Last 5 Quotes:', JSON.stringify(data, null, 2));
}

checkQuotes();
