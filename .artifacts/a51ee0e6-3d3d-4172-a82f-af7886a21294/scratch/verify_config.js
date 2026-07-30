const appConfig = require('../../../app.config.js');

const mockExpoConfig = {
  config: {
    name: 'Test',
    extra: {}
  }
};

const resolved = appConfig(mockExpoConfig);

console.log('--- Configuration Verification ---');
console.log('Android Package:', resolved.android?.package);
console.log('Android Maps API Key:', resolved.android?.config?.googleMaps?.apiKey ? 'EXISTS' : 'MISSING');
console.log('iOS Bundle ID:', resolved.ios?.bundleIdentifier);
console.log('iOS Maps API Key:', resolved.ios?.config?.googleMapsApiKey ? 'EXISTS' : 'MISSING');
console.log('Supabase URL:', resolved.extra?.supabaseUrl ? 'EXISTS' : 'MISSING');
console.log('Supabase Key:', resolved.extra?.supabaseAnonKey ? 'EXISTS' : 'MISSING');
console.log('---------------------------------');
