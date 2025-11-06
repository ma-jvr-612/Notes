// Development server that runs Angular dev server and Wrangler together
const { spawn } = require('child_process');

console.log('Starting development servers...\n');

// Start Angular dev server on port 4200
const angular = spawn('npm', ['start'], {
  shell: true,
  stdio: 'inherit'
});

// Wait a bit for Angular to start, then start Wrangler on port 8788
setTimeout(() => {
  console.log('\nStarting Wrangler for API functions...\n');

  const wrangler = spawn('npx', [
    'wrangler',
    'pages',
    'dev',
    'www',
    '--port=8788',
    '--proxy=4200'
  ], {
    shell: true,
    stdio: 'inherit'
  });

  wrangler.on('error', (error) => {
    console.error('Wrangler error:', error);
  });
}, 5000);

angular.on('error', (error) => {
  console.error('Angular error:', error);
});

// Handle cleanup
process.on('SIGINT', () => {
  console.log('\nShutting down servers...');
  angular.kill();
  process.exit();
});
