import {getValue, normalizeElement, RSSFeedParser} from '../rss/parser';
import {FeedParser} from '../types';
import {assert} from '../utils';
import {
  ChannelItunes,
  ItemItunes,
  ItunesCategory,
  ItunesEpisodeType,
  ItunesType,
  PodcastChannel,
  PodcastFeed,
  PodcastItem,
} from './feed';

export class PodcastFeedParser
  extends RSSFeedParser
  implements FeedParser<PodcastFeed>
{
  constructor() {
    super();

    // channel level
    this.channelElementParser.set('itunes:image', this.parseChannelItunesImage);
    this.channelElementParser.set(
      'itunes:category',
      this.parseChannelItunesCategories
    );
    this.channelElementParser.set(
      'itunes:explicit',
      this.parseChannelItunesExplicit
    );
    this.channelElementParser.set(
      'itunes:author',
      this.parseChannelItunesAuthor
    );
    this.channelElementParser.set('itunes:owner', this.parseChannelItunesOwner);
    this.channelElementParser.set('itunes:title', this.parseChannelItunesTitle);
    this.channelElementParser.set('itunes:type', this.parseChannelItunesType);
    this.channelElementParser.set(
      'itunes:new-feed-url',
      this.parseChannelItunesNewFeedUrl
    );
    this.channelElementParser.set('itunes:block', this.parseChannelItunesBlock);
    this.channelElementParser.set('itunes:complete', this.parseChannelComplete);

    // item level
    this.itemElementParser.set('itunes:image', this.parseItemItunesImage);
    this.itemElementParser.set('itunes:explicit', this.parseItemItunesExplicit);
    this.itemElementParser.set('itunes:title', this.parseItemItunesTitle);
    this.itemElementParser.set('itunes:episode', this.parseItemItunesEpisode);
    this.itemElementParser.set('itunes:season', this.parseItemItunesSeason);
    this.itemElementParser.set(
      'itunes:episodeType',
      this.parseItemItunesEpisodeType
    );
    this.itemElementParser.set('itunes:block', this.parseItemItunesBlock);
  }

  private setChannelItunesProperty<T extends keyof ChannelItunes>(
    feed: DeepPartial<PodcastFeed>,
    key: T,
    value: ChannelItunes[T]
  ) {
    const itunes = feed.channel!.itunes || {};
    itunes[key] = value;
    feed.channel!.itunes = itunes;
  }

  private setItemItunesProperty<T extends keyof ItemItunes>(
    item: DeepPartial<PodcastItem>,
    key: T,
    value: ItemItunes[T]
  ) {
    const itunes = item.itunes || {};
    itunes[key] = value;
    item.itunes = itunes;
  }

  private parseChannelItunesImage(
    element: any,
    root: any,
    feed: DeepPartial<PodcastFeed>
  ) {
    assert(element['@href'], 'rss.channel.itunes:image', element);
    this.setChannelItunesProperty(feed, 'image', element['@href']);
  }

  private parseChannelItunesCategories(
    element: any,
    root: any,
    feed: DeepPartial<PodcastFeed>
  ) {
    this.parseChannelItunesCategoriesRecursively(element, feed.channel!);
  }

  private parseChannelItunesCategoriesRecursively(
    element: any,
    target: DeepPartial<PodcastChannel> | DeepPartial<ItunesCategory>
  ) {
    const elements = Array.isArray(element) ? element : [element];
    target.categories = elements.map(element => {
      element = normalizeElement(element);
      const name = element['@text'];
      assert(name, 'rss.channel.itunes:category[@].@text', element);
      const category: ItunesCategory = {name};
      if (element.category) {
        this.parseChannelItunesCategoriesRecursively(
          element.category,
          category
        );
      }
      return category;
    });
  }

  private parseChannelItunesExplicit(
    element: any,
    root: any,
    feed: DeepPartial<PodcastFeed>
  ) {
    const value = getValue(element)?.toLowerCase() === 'true';
    this.setChannelItunesProperty(feed, 'explicit', value);
  }

  private parseChannelItunesAuthor(
    element: any,
    root: any,
    feed: DeepPartial<PodcastFeed>
  ) {
    const value = getValue(element);
    if (value) {
      this.setChannelItunesProperty(feed, 'author', value);
    }
  }

  private parseChannelItunesOwner(
    element: any,
    root: any,
    feed: DeepPartial<PodcastFeed>
  ) {
    const name = getValue(element['itunes:name']);
    const email = getValue(element['itunes:email']);

    assert(name, 'rss.channel.itunes:owner.name', element);
    assert(email, 'rss.channel.itunes:owner.email', element);

    this.setChannelItunesProperty(feed, 'owner', {
      name,
      email,
    });
  }

  private parseChannelItunesTitle(
    element: any,
    root: any,
    feed: DeepPartial<PodcastFeed>
  ) {
    const value = getValue(element);
    if (value) {
      this.setChannelItunesProperty(feed, 'title', value);
    }
  }

  private parseChannelItunesType(
    element: any,
    root: any,
    feed: DeepPartial<PodcastFeed>
  ) {
    const value = getValue(element)?.toLowerCase();
    if (value) {
      const entry = Object.entries(ItunesType).find(
        ([, type]) => type.toLowerCase() === value
      );
      assert(entry, 'rss.channel.itunes:type', element);
      this.setChannelItunesProperty(feed, 'type', entry![1]);
    }
  }

  private parseChannelItunesNewFeedUrl(
    element: any,
    root: any,
    feed: DeepPartial<PodcastFeed>
  ) {
    const value = getValue(element);
    if (value) {
      this.setChannelItunesProperty(feed, 'newFeedUrl', value);
    }
  }

  private parseChannelItunesBlock(
    element: any,
    root: any,
    feed: DeepPartial<PodcastFeed>
  ) {
    const value = getValue(element)?.toLocaleLowerCase() === 'yes';
    this.setChannelItunesProperty(feed, 'block', value);
  }

  private parseChannelComplete(
    element: any,
    root: any,
    feed: DeepPartial<PodcastFeed>
  ) {
    const value = getValue(element)?.toLocaleLowerCase() === 'yes';
    this.setChannelItunesProperty(feed, 'complete', value);
  }

  private parseItemItunesImage(
    element: any,
    root: any,
    item: DeepPartial<PodcastItem>
  ) {
    assert(element['@href'], 'rss.item.itunes:image', element);
    this.setItemItunesProperty(item, 'image', element['@href']);
  }

  private parseItemItunesExplicit(
    element: any,
    root: any,
    item: DeepPartial<PodcastItem>
  ) {
    const value = getValue(element)?.toLowerCase() === 'true';
    this.setItemItunesProperty(item, 'explicit', value);
  }

  private parseItemItunesTitle(
    element: any,
    root: any,
    item: DeepPartial<PodcastItem>
  ) {
    const value = getValue(element);
    if (value) {
      this.setItemItunesProperty(item, 'title', value);
    }
  }

  private parseItemItunesEpisode(
    element: any,
    root: any,
    item: DeepPartial<PodcastItem>
  ) {
    const value = getValue(element);
    if (value) {
      this.setItemItunesProperty(item, 'episode', value);
    }
  }

  private parseItemItunesSeason(
    element: any,
    root: any,
    item: DeepPartial<PodcastItem>
  ) {
    const value = getValue(element);
    if (value) {
      this.setItemItunesProperty(item, 'season', value);
    }
  }

  private parseItemItunesEpisodeType(
    element: any,
    root: any,
    item: DeepPartial<PodcastItem>
  ) {
    const value = getValue(element)?.toLowerCase();
    if (value) {
      const entry = Object.entries(ItunesEpisodeType).find(
        ([, type]) => type.toLowerCase() === value
      );
      assert(entry, 'rss.channel.items[@].itunes:episodeType', element);
      this.setItemItunesProperty(item, 'episodeType', entry![1]);
    }
  }

  private parseItemItunesBlock(
    element: any,
    root: any,
    item: DeepPartial<PodcastItem>
  ) {
    const value = getValue(element)?.toLocaleLowerCase() === 'yes';
    this.setItemItunesProperty(item, 'block', value);
  }
}
