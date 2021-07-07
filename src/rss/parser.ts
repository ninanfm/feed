import {assert} from '../utils';
import iso3166 from 'iso-3166-1';
import iso639 from 'iso-639-1';
import {create} from 'xmlbuilder2';
import {FeedParser} from '../types';
import {Item, RSSFeed} from './feed';

export class RSSFeedParser implements FeedParser<RSSFeed> {
  parse(rawData: string): RSSFeed {
    const data = create(rawData).toObject();
    const feed: DeepPartial<RSSFeed> = {};
    this.parseRoot(data, feed);
    return feed as RSSFeed;
  }

  private parseRoot(data: any, feed: DeepPartial<RSSFeed>): void {
    assert(
      !Array.isArray(data.rss) && typeof data.rss === 'object',
      'rss',
      data
    );

    feed.namespaces = Object.keys(data.rss)
      .filter(key => /^@xmlns:/.test(key))
      .map(key => ({
        name: key.replace(/^@xmlns:/, ''),
        url: data.rss[key],
      }));

    this.parseChannel(normalizeElement(data.rss.channel), data, feed);
  }

  private parseChannel(
    channel: any,
    root: any,
    feed: DeepPartial<RSSFeed>
  ): void {
    assert(
      !Array.isArray(channel) && typeof channel === 'object',
      'root.rss',
      root.rss
    );

    feed.channel = {};

    for (const entry of Object.entries(channel)) {
      const elementName = entry[0];
      const elementValue = normalizeElement(entry[1]);

      switch (elementName) {
        case 'title':
          this.parseChannelTitle(elementValue, root, feed);
          break;
        case 'description':
          this.parseChannelDescription(elementValue, root, feed);
          break;
        case 'link':
          this.parseChannelLink(elementValue, root, feed);
          break;
        case 'image':
          this.parseChannelImage(elementValue, root, feed);
          break;
        case 'generator':
          this.parseGeneratorLink(elementValue, root, feed);
          break;
        case 'lastBuildDate':
          this.parseChannelLastBuildDate(elementValue, root, feed);
          break;
        case 'copyright':
          this.parseChannelCopyright(elementValue, root, feed);
          break;
        case 'language':
          this.parseChannelLanguage(elementValue, root, feed);
          break;
        case 'managingEditor':
          this.parseChannelManagingEditor(elementValue, root, feed);
          break;
        case 'webMaster':
          this.parseChannelWebMaster(elementValue, root, feed);
          break;
        case 'docs':
          this.parseChannelDocs(elementValue, root, feed);
          break;
        case 'ttl':
          this.parseChannelTTL(elementValue, root, feed);
          break;
        case 'textInput':
          this.parseChannelTextInput(elementValue, root, feed);
          break;
        case 'skipHours':
          this.parseChannelSkipHours(elementValue, root, feed);
          break;
        case 'skipDays':
          this.parseChannelSkipDays(elementValue, root, feed);
          break;
        case 'category':
          this.parseChannelCategories(elementValue, root, feed);
          break;
        case 'item':
          this.parseChannelItems(elementValue, root, feed);
          break;
        default:
      }
    }
  }

  private parseChannelTitle(
    element: any,
    root: any,
    feed: DeepPartial<RSSFeed>
  ) {
    const value = getValue(element);
    assert(value, 'rss.channel.title', element);
    feed.channel!.title = value;
  }

  private parseChannelDescription(
    element: any,
    root: any,
    feed: DeepPartial<RSSFeed>
  ) {
    const value = getValue(element);
    assert(value, 'rss.channel.description', element);
    feed.channel!.description = value;
  }

  private parseChannelLink(
    element: any,
    root: any,
    feed: DeepPartial<RSSFeed>
  ) {
    const value = getValue(element);
    if (value) {
      feed.channel!.link = value;
    }
  }

  private parseChannelImage(
    element: any,
    root: any,
    feed: DeepPartial<RSSFeed>
  ) {
    assert(
      !Array.isArray(element) && typeof element === 'object',
      'rss.channel.image',
      element
    );

    const url = getValue(element.url);
    const title = getValue(element.title);
    const link = getValue(element.link);
    const width = getValue(element.width);
    const height = getValue(element.height);
    const description = getValue(element.description);

    assert(url, 'rss.channel.image.url', element);
    assert(title, 'rss.channel.image.title', element);
    assert(link, 'rss.channel.image.link', element);

    feed.channel!.image = {
      url,
      title,
      link,
      description,
    };

    if (width) {
      feed.channel!.image!.width = Number(width);
    }

    if (height) {
      feed.channel!.image!.height = Number(height);
    }
  }

  private parseGeneratorLink(
    element: any,
    root: any,
    feed: DeepPartial<RSSFeed>
  ) {
    const value = getValue(element);
    if (value) {
      feed.channel!.generator = value;
    }
  }

  private parseChannelLastBuildDate(
    element: any,
    root: any,
    feed: DeepPartial<RSSFeed>
  ) {
    const value = getDate(element, 'rss.channel.lastBuildDate');
    if (value) {
      feed.channel!.lastBuildDate = value;
    }
  }

  private parseChannelCopyright(
    element: any,
    root: any,
    feed: DeepPartial<RSSFeed>
  ) {
    const value = getValue(element);
    if (value) {
      feed.channel!.copyright = value;
    }
  }

  private parseChannelLanguage(
    element: any,
    root: any,
    feed: DeepPartial<RSSFeed>
  ) {
    let value = getValue(element);

    if (value) {
      const [lang, region] = value.split('-');

      assert(iso639.getName(lang), 'rss.channel.language', element);

      if (region && !iso3166.whereAlpha2(region)) {
        value = lang;
      }

      feed.channel!.language = value;
    }
  }

  private parseChannelCategories(
    element: any,
    root: any,
    feed: DeepPartial<RSSFeed>
  ) {
    const categories = Array.isArray(element) ? element : [element];

    feed.channel!.categories = categories.map(category => {
      const name = getValue(category);
      let domain = undefined;

      if (typeof category === 'object' && category.domain) {
        domain = category.domain;
      }

      return {name, domain};
    });
  }

  private parseChannelManagingEditor(
    element: any,
    root: any,
    feed: DeepPartial<RSSFeed>
  ) {
    const value = getValue(element);
    if (value) {
      feed.channel!.managingEditor = value;
    }
  }

  private parseChannelWebMaster(
    element: any,
    root: any,
    feed: DeepPartial<RSSFeed>
  ) {
    const value = getValue(element);
    if (value) {
      feed.channel!.webMaster = value;
    }
  }

  private parseChannelDocs(
    element: any,
    root: any,
    feed: DeepPartial<RSSFeed>
  ) {
    const value = getValue(element);
    if (value) {
      feed.channel!.docs = value;
    }
  }

  private parseChannelTTL(element: any, root: any, feed: DeepPartial<RSSFeed>) {
    const value = getValue(element);
    if (value) {
      const ttl = Number(value);
      assert(!isNaN(ttl), 'rss.channel.ttl', element);
      feed.channel!.ttl = Number(value);
    }
  }

  private parseChannelTextInput(
    element: any,
    root: any,
    feed: DeepPartial<RSSFeed>
  ) {
    assert(
      !Array.isArray(element) && typeof element === 'object',
      'rss.channel.textInput',
      element
    );

    const title = getValue(element.title);
    const description = getValue(element.description);
    const name = getValue(element.name);
    const link = getValue(element.link);

    assert(title, 'rss.channel.textInput.title', element);
    assert(description, 'rss.channel.textInput.description', element);
    assert(name, 'rss.channel.textInput.name', element);
    assert(link, 'rss.channel.textInput.link', element);

    feed.channel!.textInput = {
      title,
      description,
      name,
      link,
    };
  }

  private parseChannelSkipHours(
    element: any,
    root: any,
    feed: DeepPartial<RSSFeed>
  ) {
    const hours = Array.isArray(element.hour)
      ? element.hour.map(Number)
      : [element.hour];
    feed.channel!.skipHours = hours;
  }

  private parseChannelSkipDays(
    element: any,
    root: any,
    feed: DeepPartial<RSSFeed>
  ) {
    const days = Array.isArray(element.day)
      ? element.day.map(Number)
      : [element.day];
    feed.channel!.skipDays = days;
  }

  private parseChannelItems(
    element: any,
    root: any,
    feed: DeepPartial<RSSFeed>
  ) {
    const items = Array.isArray(element) ? element : [element];
    feed.channel!.items = items.map(element => {
      const item: DeepPartial<Item> = {};
      this.parseItem(normalizeElement(element), root, item);
      return item;
    });
  }

  private parseItem(element: any, root: any, item: DeepPartial<Item>) {
    for (const entry of Object.entries(element)) {
      const elementName = entry[0];
      const elementValue = normalizeElement(entry[1]);

      switch (elementName) {
        case 'title':
          this.parseItemTitle(elementValue, root, item);
          break;
        case 'link':
          this.parseItemLink(elementValue, root, item);
          break;
        case 'description':
          this.parseItemDescription(elementValue, root, item);
          break;
        case 'author':
          this.parseItemAuthor(elementValue, root, item);
          break;
        case 'categories':
          this.parseItemCategories(elementValue, root, item);
          break;
        case 'comments':
          this.parseItemComments(elementValue, root, item);
          break;
        case 'enclosure':
          this.parseItemEnclosure(elementValue, root, item);
          break;
        case 'guid':
          this.parseItemGuid(elementValue, root, item);
          break;
        case 'pubDate':
          this.parseItemPubDate(elementValue, root, item);
          break;
        case 'source':
          this.parseItemSource(elementValue, root, item);
          break;
        default:
          break;
      }
    }
  }

  private parseItemTitle(element: any, root: any, item: DeepPartial<Item>) {
    const value = getValue(element);
    if (value) {
      item.title = value;
    }
  }

  private parseItemLink(element: any, root: any, item: DeepPartial<Item>) {
    const value = getValue(element);
    if (value) {
      item.link = value;
    }
  }

  private parseItemDescription(
    element: any,
    root: any,
    item: DeepPartial<Item>
  ) {
    const value = getValue(element);
    if (value) {
      item.description = value;
    }
  }

  private parseItemAuthor(element: any, root: any, item: DeepPartial<Item>) {
    const value = getValue(element);
    if (value) {
      item.author = value;
    }
  }

  private parseItemCategories(
    element: any,
    root: any,
    item: DeepPartial<Item>
  ) {
    const categories = Array.isArray(element) ? element : [element];

    item.categories = categories.map(category => {
      const name = getValue(category);
      let domain = undefined;

      if (typeof category === 'object' && category.domain) {
        domain = category.domain;
      }

      return {name, domain};
    });
  }

  private parseItemComments(element: any, root: any, item: DeepPartial<Item>) {
    const value = getValue(element);
    if (value) {
      item.comments = value;
    }
  }

  private parseItemEnclosure(element: any, root: any, item: DeepPartial<Item>) {
    assert(
      !Array.isArray(element) && typeof element === 'object',
      'rss.channel.items[@].enclosure',
      element
    );

    const url = element['@url'];
    const length = Number(element['@length']);
    const type = element['@type'];

    assert(url, 'rss.channel.items[@].enclosure[@url]', element);
    assert(length, 'rss.channel.items[@].enclosure[@length]', element);
    assert(type, 'rss.channel.items[@].enclosure[@type]', element);

    item.enclosure = {
      url,
      length,
      type,
    };
  }

  private parseItemGuid(element: any, root: any, item: DeepPartial<Item>) {
    if (typeof element === 'object') {
      item.guid = {
        value: getValue(element),

        isPermaLink: Boolean(element['@isPermaLink']),
      };
    } else {
      item.guid = {
        value: getValue(element),
      };
    }
  }

  private parseItemPubDate(element: any, root: any, item: DeepPartial<Item>) {
    const value = getValue(element);
    if (value) {
      const date = new Date(value);
      assert(!isNaN(date.getTime()), 'rss.channel.items[@].pubDate', element);
      item.pubDate = date;
    }
  }

  private parseItemSource(element: any, root: any, item: DeepPartial<Item>) {
    if (typeof element === 'object') {
      item.source = {
        name: getValue(element),
        url: element['@url'],
      };
    } else {
      item.source = {
        name: getValue(element),
      };
    }
  }
}

function getDate(element: any, path: string): Date | undefined {
  const dateStr = getValue(element);
  if (!dateStr) {
    return;
  }
  const date = new Date(dateStr);
  assert(!isNaN(date.getTime()), path, element);
  return date;
}

function getValue(element: any): string | undefined {
  if (typeof element === 'string') {
    return element;
  }
  if (Array.isArray(element)) {
    return;
  }
  if (typeof element === 'object') {
    return element['$'];
  }
  return;
}

function normalizeElement(element: any): any {
  if (!element['#']) {
    return element;
  }

  const children = element['#'];
  delete element['#'];

  if (!Array.isArray(children)) {
    return children;
  }

  return children.reduce(
    (element: any, child: any) => Object.assign(element, child),
    element
  );
}
