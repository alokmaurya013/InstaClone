const webpack=require('webpack');
module.exports=function override(config){
    const fallback=config.resolve.fallback||{};
    Object.assign(fallback,{
      url:require.resolve('url'),
      fs:false,
      net:false,
      async_hooks:false,
      assert:require.resolve('assert'),
      crypto:require.resolve('crypto-browserify'),
      http:require.resolve('stream-http'),
      https:require.resolve('https-browserify'),
      buffer:require.resolve('buffer'),
      stream:require.resolve('stream-browserify'),
      path:require.resolve('path-browserify'),
     zlib:require.resolve("browserify-zlib"),
       querystring:require.resolve("querystring-es3")  
    });
    config.resolve.fallback=fallback;
    config.plugins=(config.plugins||[]).concat([
        new webpack.ProvidePlugin({
            process:"process/browser",
            Buffer:['buffer','Buffer'],
        }),
    ]);
    config.ignoreWarnings=[/Failed to parse source map/];
    return config;
}
