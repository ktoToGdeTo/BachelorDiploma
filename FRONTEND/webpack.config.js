const { ModuleFederationPlugin } = require('@module-federation/enhanced/webpack');

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'frontend_host',
      filename: 'remoteEntry.js',
      remotes: {
        sidebar_app: 'sidebar_app@http://localhost:3001/remoteEntry.js',
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: '^18.2.0',
          eager: true,
        },
        'react-dom': {
          singleton: true,
          requiredVersion: '^18.2.0',
          eager: true,
        },
      },
    }),
  ],
};
