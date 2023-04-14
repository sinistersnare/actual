import fs from 'fs';
import * as path from 'path';

import * as esbuild from 'esbuild';
import { polyfillNode } from 'esbuild-plugin-polyfill-node';
import peg from 'peggy';

/// TODO: this is super hacky.
// import { createRequire } from 'node:module';
// const require = createRequire(import.meta.url);

const IS_DEV = process.env.NODE_ENV === 'development';

const pegPlugin = {
  name: 'peg',
  setup: build => {
    build.onResolve({ filter: /\.pegjs$/ }, args => ({
      path: path.isAbsolute(args.path)
        ? args.path
        : path.join(args.resolveDir, args.path),
      namespace: 'peg',
    }));

    build.onLoad({ filter: /.*/, namespace: 'peg' }, async args => {
      let text = await fs.promises.readFile(args.path, 'utf8');
      const output = IS_DEV ? 'source-with-inline-map' : 'source';
      const grammarSource = IS_DEV ? args.path : '';
      return {
        loader: 'js',
        contents: peg.generate(text, { output, grammarSource, format: 'umd' }),
      };
    });
  },
};

const extensions = process.env.EXTENSIONS?.split(',') ?? [
  '.web.js',
  '.web.ts',
  '.web.tsx',
  '.js',
  '.ts',
  '.tsx',
  '.json',
];

const config = {
  entryPoints: [{ out: 'kcab.worker', in: 'src/server/main.js' }],
  bundle: true,
  outdir: process.env.OUTPATH ?? 'lib-dist/browser',
  globalName: 'backend',
  publicPath: '/kcab/',
  minify: !IS_DEV,
  sourcemap: IS_DEV,
  entryNames: process.env.OUTFMT ?? '[dir]/[name]',
  loader: {
    '.ts': 'ts',
    '.web.ts': 'ts',
    '.api.ts': 'ts',
    '.js': 'js',
    '.web.js': 'js',
    '.api.js': 'js',
  },
  resolveExtensions: extensions,
  define: {
    'process.env.IS_DEV': JSON.stringify(IS_DEV),
    'process.env.IS_BETA': JSON.stringify(
      process.env.ACTUAL_RELEASE_TYPE === 'beta',
    ),
    'process.env.PUBLIC_URL': JSON.stringify(process.env.PUBLIC_URL || '/'),
    'process.env.ACTUAL_DATA_DIR': JSON.stringify('/'),
    'process.env.ACTUAL_DOCUMENT_DIR': JSON.stringify('/documents'),
  },
  alias: {
    // fs: require.resolve('memfs'),
  },
  plugins: [pegPlugin, polyfillNode()],
  // target: ['es2020'], // TODO: should we set this?
};

if (process.env.BUILD_ENV === 'development') {
  esbuild.context(config).then(ctx => ctx.watch());
} else {
  esbuild.build(config).then(_ => console.log('Build success!'));
}
