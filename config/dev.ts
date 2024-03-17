module.exports = {
  env: {
    NODE_ENV: '"development"'
  },
  defineConstants: {
    'process.env' : JSON.stringify(process.env)
  },
  mini: {
    optimizeMainPackage: {
      enable: true
    }
  },
  h5: {
    esnextModules: ['taro-ui']
  }
}
