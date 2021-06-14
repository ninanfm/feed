# @ninan/podcast-feed

`@ninan/podcast-feed` is a set of tools to deal with podcast RSS feed.

> This project is still working in progress, take your own risk to use it in production.

## Features

- [X] Generator
    - [X] Support `itunes` namespace
    - [X] Support `google` namespace
    - [X] Support `podcast` namespace
- [ ] Parser
- [ ] Validator

## How To Use

We only publish the package to the GitHub registry, you have to tell npm/yarn to install the package from GitHub. It's pretty simple, in the root folder of your project, add file .npmrc with the following content:

```
 @ninanfm:registry=https://npm.pkg.github.com
```

After that, you can install the package as normal:

```bash
$ npm i @ninanfm/podcast-feed
# or
$ yarn add @ninanfm/podcast-feed
```
