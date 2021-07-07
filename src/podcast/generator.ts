import {XMLBuilder} from 'xmlbuilder2/lib/interfaces';
import {RSSFeedGenerator} from '../rss/generator';
import {FeedGenerator} from '../types';
import {ItunesCategory, PodcastFeed, PodcastItem} from './feed';

export class PodcastFeedGenerator
  extends RSSFeedGenerator
  implements FeedGenerator<PodcastFeed>
{
  protected createChannelElement(rss: XMLBuilder, feed: PodcastFeed) {
    super.createChannelElement(rss, feed);
    const channel = rss.last();

    if (!feed.channel!.itunes) {
      return;
    }

    const itunes = feed.channel!.itunes;

    channel.ele('itunes:image').att('href', itunes.image);

    channel.ele('itunes:explicit').txt(itunes.explicit ? 'True' : 'False');

    this.createItunesCategoriesElement(channel, itunes.categories);

    if (itunes.author) {
      channel.ele('itunes:author').txt(itunes.author);
    }

    if (itunes.owner) {
      const owner = channel.ele('itunes:owner');
      if (itunes.owner.name) {
        owner.ele('itunes:name').txt(itunes.owner.name);
      }
      if (itunes.owner.email) {
        owner.ele('itunes:email').txt(itunes.owner.email);
      }
    }

    if (itunes.title) {
      channel.ele('itunes:title').txt(itunes.title);
    }

    if (itunes.type) {
      channel.ele('itunes:type').txt(itunes.type);
    }

    if (itunes.newFeedUrl) {
      channel.ele('itunes:new-feed-url').txt(itunes.newFeedUrl);
    }

    if (itunes.block) {
      channel.ele('itunes:block').txt('Yes');
    }

    if (itunes.complete) {
      channel.ele('itunes:complete').txt('Yes');
    }
  }

  protected createItemElement(channel: XMLBuilder, item: PodcastItem) {
    super.createItemElement(channel, item);
    const itemElement = channel.last();

    if (!item.itunes) {
      return;
    }

    const itunes = item.itunes;

    if (itunes.duration) {
      itemElement.ele('itunes:duration').txt(String(itunes.duration));
    }

    if (itunes.image) {
      itemElement.ele('itunes:image').att('href', itunes.image);
    }

    itemElement.ele('itunes:explicit').txt(itunes.explicit ? 'Yes' : 'No');

    if (itunes.title) {
      itemElement.ele('itunes:title').txt(itunes.title);
    }

    if (itunes.episode) {
      itemElement.ele('itunes:episode').txt(itunes.episode);
    }

    if (itunes.season) {
      itemElement.ele('itunes:season').txt(itunes.season);
    }

    if (itunes.episodeType) {
      itemElement.ele('itunes:episodeType').txt(itunes.episodeType);
    }

    itemElement.ele('itunes:block').txt(itunes.block ? 'Yes' : 'No');
  }

  private createItunesCategoriesElement(
    parent: XMLBuilder,
    categories: ItunesCategory[]
  ) {
    for (const category of categories) {
      const categoryElement = parent
        .ele('itunes:category')
        .att('text', category.name);
      if (category.categories) {
        this.createItunesCategoriesElement(
          categoryElement,
          category.categories
        );
      }
    }
  }
}
