import {FeedGenerator} from '../types';
import {create} from 'xmlbuilder2';
import {Category, Item, RSSFeed} from './feed';
import {XMLBuilder} from 'xmlbuilder2/lib/interfaces';
import rfc822Date from 'rfc822-date';

export class RSSFeedGenerator implements FeedGenerator<RSSFeed> {
  generate(feed: RSSFeed): string {
    const {root, rss} = this.createRootElement(feed);
    this.createChannelElement(rss, feed);
    return root.toString();
  }

  protected createRootElement(feed: RSSFeed): {
    root: XMLBuilder;
    rss: XMLBuilder;
  } {
    const root = create();
    const rss = root.ele('rss');

    rss.att('version', '2.0');

    for (const namespace of feed.namespaces) {
      rss.att(`xmlns:${namespace.name}`, namespace.url);
    }

    return {root, rss};
  }

  protected createChannelElement(rss: XMLBuilder, feed: RSSFeed): void {
    const channel = rss.ele('channel');

    channel.dat('title').txt(feed.channel.title);
    channel.ele('link').txt(feed.channel.link);
    channel.dat('description').txt(feed.channel.description);

    if (feed.channel.language) {
      channel.ele('language').txt(feed.channel.language);
    }

    if (feed.channel.copyright) {
      channel.ele('copyright').dat(feed.channel.copyright);
    }

    if (feed.channel.managingEditor) {
      channel.ele('managingEditor').txt(feed.channel.managingEditor);
    }

    if (feed.channel.webMaster) {
      channel.ele('webMaster').txt(feed.channel.webMaster);
    }

    if (feed.channel.pubDate) {
      channel.ele('pubDate').txt(rfc822Date(feed.channel.pubDate));
    }

    if (feed.channel.lastBuildDate) {
      channel.ele('lastBuildDate').txt(rfc822Date(feed.channel.lastBuildDate));
    }

    if (feed.channel.categories) {
      this.createCategoryElements(channel, feed.channel.categories);
    }

    if (feed.channel.generator) {
      channel.ele('generator').txt(feed.channel.generator);
    }

    if (feed.channel.docs) {
      channel.ele('docs').txt(feed.channel.docs);
    }

    if (feed.channel.ttl) {
      channel.ele('ttl').txt(String(feed.channel.ttl));
    }

    if (feed.channel.items) {
      for (const item of feed.channel.items) {
        this.createItemElement(channel, item);
      }
    }
  }

  protected createItemElement(channel: XMLBuilder, item: Item): void {
    const itemElement = channel.ele('item');

    if (item.title) {
      itemElement.ele('title').dat(item.title);
    }

    if (item.link) {
      itemElement.ele('link').txt(item.link);
    }

    if (item.description) {
      itemElement.ele('link').dat(item.description);
    }

    if (item.author) {
      itemElement.ele('author').txt(item.author);
    }

    if (item.categories) {
      this.createCategoryElements(channel, item.categories);
    }

    if (item.comments) {
      itemElement.ele('comments').txt(item.comments);
    }

    if (item.enclosure) {
      const enclosure = itemElement.ele('enclosure');

      enclosure.att('url', item.enclosure.url);

      if (item.enclosure.length) {
        enclosure.att('length', String(item.enclosure.length));
      }

      if (item.enclosure.type) {
        enclosure.att('type', String(item.enclosure.type));
      }
    }

    if (item.guid) {
      const guid = itemElement.ele('guid');

      guid.txt(item.guid.value);

      if (item.guid.isPermaLink) {
        guid.att('isPermaLink', 'true');
      }
    }

    if (item.pubDate) {
      itemElement.ele('pubDate').txt(rfc822Date(item.pubDate));
    }

    if (item.source) {
      itemElement
        .ele('source')
        .att('url', item.source.url)
        .txt(item.source.name);
    }
  }

  protected createCategoryElements(
    parent: XMLBuilder,
    categories: Category[]
  ): void {
    for (const category of categories) {
      const ele = parent.ele('category');
      if (category.domain) {
        ele.att('domain', category.domain);
      }
      ele.txt(category.name);
    }
  }
}
