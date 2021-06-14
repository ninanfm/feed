# @ninanfm/feed

> This package is still working in progress, take your own risk to use it.

`@ninanfm/feed` is a feed generator with flexible APIs, it's designed to use with [TypeORM](https://typeorm.io).

## Table of Contents
- [@ninanfm/feed](#ninanfmfeed)
  - [Table of Contents](#table-of-contents)
  - [Supported Specifications](#supported-specifications)
  - [Quick Start](#quick-start)
  - [Predefined Models](#predefined-models)
  - [License](#license)

## Supported Specifications

- [x] [JSONFeed 1.1](https://jsonfeed.org/version/1.1)
- [x] [RSS 2.0](https://validator.w3.org/feed/docs/rss2.html)
- [x] [iTunes 1.0](https://help.apple.com/itc/podcasts_connect/#/itcb54353390)

## Quick Start

This package must to use with [reflect-metadata](https://www.npmjs.com/package/reflect-metadata), so you have to make sure that you have installed it.

First step is to install all required packages:

```bash
yarn add reflect-metadata @ninanfm/feed
# or
npm i reflect-metadata @ninanfm/feed
```

Then add this line of code on the top of your entry file.

```
import 'reflect-metadata';
```

The next step is to define models to tell `@ninanfm/feed` how to generate your feed.
Here, we assume that your are using this package with TypeORM and want to generate a RSS feed for your blog.

```typescript
import { RSS2_0 as RSS, xml } from '@ninanfm/feed';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@RSS.support
@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    slug: string;

    @Column('text')
    @RSS.item.description
    content: string;

    @RSS.item.author
    authorName: string;

    @RSS.item.pubDate
    publishedAt: Date;

    @RSS.item.link
    @RSS.item.guid({isPermaLink: true})
    get url(): string {
        return 'https://domain/posts/' + this.slug; 
    }

    @ManyToOne(() => Blog, blog => blog.posts)
    blog: Blog;
}

@RSS.support
@Entity()
export class Blog {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @RSS.channel.title
    title: string;

    @Column('text')
    @RSS.channel.description
    description: string;

    @Column()
    slug: string;

    @RSS.channel.link
    readonly homePageUrl = 'https://domain';

    @OneToMany(() => Post, post => post.blog)
    posts: Post[];

    toRSS(): string {
        return xml.toString(this);
    }
}
```

That's it, now you can call `#toRSS` method on `Blog` instance to generate RSS feed.

## Predefined Models

Currently, we only defined a `Podcast` model, you can see the codes for `Podcast` model to find out how to use the advanced features of this package.

* [src/feed/podcast.ts](src/feed/podcast.ts)
* [src/example/podcast.ts](src/example/podcast.ts)

 ## License

[MIT](./LICENSE)
