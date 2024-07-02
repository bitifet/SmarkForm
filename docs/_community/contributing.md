---
title: Contributing
layout: chapter
permalink: /community/contributing
nav_order: 2

---

# {{ page.title }}

<details>
<summary>
<strong>📖 Table of Contents</strong>
</summary>

  {{ "
<!-- vim-markdown-toc GitLab -->

* [Scripts](#scripts)
    * [npm run build](#npm-run-build)
    * [npm run dev](#npm-run-dev)
    * [npm run test](#npm-run-test)
    * [npm run doc](#npm-run-doc)
* [Code of Conduct](#code-of-conduct)
* [Help](#help)

<!-- vim-markdown-toc -->
       " | markdownify }}

</details>


I appreciate your interest in contributing. Before you get started, please
read this guide to understand how you can participate in the development of the
project.


> **🚧  ＷＯＲＫ  ＩＮ  ＰＲＯＧＲＥＳＳ...  🚧**
> 
> This guide is still in early stage. Please, contact me if you have any
> questions or suggestions.




## Scripts

In order to facilitate the development process, the *scripts* section of
*package.json* file define the following commands:


### npm run build

Runs the building process of *SmarkForm* library.

It creates the follwing files:

  * *SmarkForm.esm.js* - SmarkForm ESM module.

  * *SmarkForm.umd.js* - SmarkForm UMD package.

  * *SmarkForm.esm.js.map* and *SmarkForm.umd.js.map* - Sourcemap files for
    that modules.


**Example:**

```sh
$ npm run build

> smarkform@0.4.0 build
> rollup -c --environment BUILD:production


src/main.js → dist/SmarkForm.esm.js, dist/SmarkForm.umd.js...
Browserslist: caniuse-lite is outdated. Please run:
  npx update-browserslist-db@latest
  Why you should do it regularly: https://github.com/browserslist/update-db#readme
created dist/SmarkForm.esm.js, dist/SmarkForm.umd.js in 2s

src/examples/index.js → tmp/index.js...
(!) Generated an empty chunk
index
created tmp/index.js in 220ms
```

### npm run dev


Runs the building process in *watch* mode so output files are regenerated every
time single source file is modified and starts a simple http server to ease
checking that generated *examples* work propperly with them.

That is:

  * Builds both ESM and UMD modules into */dist*.
  * Builds *sourcemap* files for them.
  * Watches files and rebuilds at every change.
  * Runs http server to ease inspection.
  * Shows the urls to access http server.


**Example:**

```sh
$ npm run dev

> smarkform@0.4.0 dev
> concurrently -n server,rollup "http-server --no-dotfiles -c-1" "rollup -c -w"

[server] Starting up http-server, serving ./
[server]
[server] http-server version: 14.1.1
[server]
[server] http-server settings:
[server] CORS: disabled
[server] Cache: -1 seconds
[server] Connection Timeout: 120 seconds
[server] Directory Listings: visible
[server] AutoIndex: visible
[server] Serve GZIP Files: false
[server] Serve Brotli Files: false
[server] Default File Extension: none
[server]
[server] Available on:
[server]   http://127.0.0.1:8080
[server]   http://192.168.1.10:8080
[server] Hit CTRL-C to stop the server
[server]
[rollup] rollup v4.18.0
[rollup] bundles src/main.js → dist/SmarkForm.esm.js, dist/SmarkForm.umd.js...
[rollup] created dist/SmarkForm.esm.js, dist/SmarkForm.umd.js in 1.7s
[rollup] bundles src/examples/index.js → tmp/index.js...
[rollup] (!) Generated an empty chunk
[rollup] "index"
[rollup] created tmp/index.js in 248ms
```

> 📌 Don't mind about the *Generated an empty chunk* warning: It's by purpose
> because I didn't found a way to produce html files with rollup without a js
> entry file.
> 
> Let me know if you have a better approach.


### npm run test


Runs existing tests.


**Example:**

```sh
joanmi@constructor:~/.../lib/SmarkForm$ npm run test

> smarkform@0.4.0 pretest
> npm run build


> smarkform@0.4.0 build
> rollup -c --environment BUILD:production


src/main.js → dist/SmarkForm.esm.js, dist/SmarkForm.umd.js...
created dist/SmarkForm.esm.js, dist/SmarkForm.umd.js in 1.8s

src/examples/index.js → tmp/index.js...
(!) Generated an empty chunk
"index"
created tmp/index.js in 245ms

> smarkform@0.4.0 test
> mocha



  General Functionality Tests
    ✔ Document loaded
    ✔ Basic introspection works

  List Component Type Test
    ✔ addItem action works
    ✔ removeItem action works
    ✔ min_items limit applies
    ✔ max_items limit applies
    ✔ Imports correctly
    ✔ Exports correctly


  8 passing (2s)
```

### npm run doc

SmarkForm documentation is published at:
[https://smarkform.bitifet.net](https://smarkform.bitifet.net).

It is build with [Jekyll](https://jekyllrb.com) and the [Just the
Docs](https://just-the-docs.github.io/just-the-docs/) theme and hosted in
[GitHub Pages](https://docs.github.com/en/pages).

Source files can be found in the */docs* directory of this repository.


To compile / see the results, you can run the following command:

```npm run doc```


**Example:**

```sh
$ npm run doc

> smarkform@0.4.0 doc
> cd docs && bundle install && bundle exec jekyll serve --livereload

Using rake 13.0.6
Using public_suffix 5.0.3
Using addressable 2.8.5
Using bundler 2.3.26
Using colorator 1.1.0
Using concurrent-ruby 1.2.2
Using eventmachine 1.2.7
Using http_parser.rb 0.8.0
Using em-websocket 0.5.3
Using ffi 1.15.5
Using forwardable-extended 2.6.0
Using google-protobuf 3.24.3 (x86_64-linux)
Using i18n 1.14.1
Using sass-embedded 1.68.0
Using jekyll-sass-converter 3.0.0
Using rb-fsevent 0.11.2
Using rb-inotify 0.10.1
Using listen 3.8.0
Using jekyll-watch 2.2.1
Using rexml 3.2.6
Using kramdown 2.4.0
Using kramdown-parser-gfm 1.1.0
Using liquid 4.0.4
Using mercenary 0.4.0
Using pathutil 0.16.2
Using rouge 4.1.3
Using safe_yaml 1.0.5
Using unicode-display_width 2.4.2
Using terminal-table 3.0.2
Using webrick 1.8.1
Using jekyll 4.3.2
Using jekyll-include-cache 0.2.1
Using jekyll-seo-tag 2.8.0
Using just-the-docs 0.6.2
Bundle complete! 2 Gemfile dependencies, 34 gems now installed.
Use `bundle info [gemname]` to see where a bundled gem is installed.
Configuration file: /home/joanmi/Nextcloud/prj/lib/SmarkForm/docs/_config.yml
            Source: /home/joanmi/Nextcloud/prj/lib/SmarkForm/docs
       Destination: /home/joanmi/Nextcloud/prj/lib/SmarkForm/docs/_site
 Incremental build: disabled. Enable with --incremental
      Generating...
                    done in 2.055 seconds.
 Auto-regeneration: enabled for '/home/joanmi/Nextcloud/prj/lib/SmarkForm/docs'
        ** ERROR: directory is already being watched! **

        Directory: /home/joanmi/Nextcloud/prj/lib/SmarkForm/docs/_resources/examples

        is already being watched through: /home/joanmi/Nextcloud/prj/lib/SmarkForm/examples

        MORE INFO: https://github.com/guard/listen/blob/master/README.md
LiveReload address: http://0.0.0.0:35729
    Server address: http://0.0.0.0:4000
  Server running... press ctrl-c to stop.
```


## Code of Conduct

Please be respectful towards other contributors and maintain a positive collaborative environment. The following behaviors will not be tolerated:

  * Offensive or disrespectful comments.
  * SPAM or unauthorized advertising.
  * Non-constructive or destabilizing behavior.


## Help

If you have any questions or need assistance, please feel free to reach out to
us through the Issues or by emailing joanmi@gmail.com.

**Thank you for contributing!**





