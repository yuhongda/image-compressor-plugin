image-compressor-plugin
====
A webpack plugin for webpack users to compress images automatically by using TinyPNG.com

Install
-----

```javascript

npm install -D image-compressor-plugin

```


Usage
-----

in webpack config file:

```javascript

new ImageCompressorPlugin({
    key: 'YOUR TinyPNG KEY',
    ext: ['png', 'jpeg', 'jpg']
}),

```
