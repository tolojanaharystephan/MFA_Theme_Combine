import 'dotenv/config';

(async () => {
  try {
    console.log("Step 1: dotenv loaded");
    
    const { env } = await import('./config/env.js');
    console.log("Step 2: env module loaded, PORT:", env.PORT);
    
    const { logger } = await import('./config/logger.js');
    console.log("Step 3: logger module loaded");
    
    const { app } = await import('./app.js');
    console.log("Step 4: app module loaded");
    
    app.listen(env.PORT, () => {
      logger.info(`MFA backend listening on port ${env.PORT}`);
    });
  } catch (error) {
    console.error("Fatal error:", error);
    process.exit(1);
  }
})();

