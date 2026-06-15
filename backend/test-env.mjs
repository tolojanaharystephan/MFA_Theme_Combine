import 'dotenv/config';
import('./src/config/env.ts')
  .then(m => console.log('Env loaded successfully:', JSON.stringify(m.env, null, 2)))
  .catch(e => {
    console.error('Error loading env:', e.message);
    console.error('Full error:', e);
    process.exit(1);
  });
