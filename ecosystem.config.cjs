module.exports = {
    apps: [
        {
            name: 'ccvmmo1',
            exec_mode: 'cluster',
            instances: 'max',
            script: './.output/server/index.mjs',
            env: {
                PORT: 80,
                HOST: '0.0.0.0'
            }
        },
        {
            name: 'socket-server',
            script: 'socket-server.js',
            env: {
                SOCKET_PORT: 3001
            }
        }
    ]
};
