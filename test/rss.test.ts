import fs from 'fs';
import path from 'path';
import mergeDeep from 'merge-deep';
import {RSS, RSSFeed} from '../src/rss';

describe('RSS', () => {
  const createFeed = (feed: DeepPartial<RSSFeed> = {}): RSSFeed => {
    return mergeDeep(
      {
        namespaces: [],
        channel: {
          title: '',
          link: '',
          description: '',
        },
      },
      feed
    );
  };

  describe('#generate', () => {
    it('required properties', () => {
      const spec = new RSS();
      const feed = createFeed({
        channel: {
          title: 'test',
          link: 'https://google.com',
          description: 'test test',
        },
      });
      const result = spec.generate(feed);
      expect(result).toMatchSnapshot();
    });

    it('categories', () => {
      const spec = new RSS();
      const feed: RSSFeed = createFeed({
        channel: {
          categories: [{name: 'test'}, {name: 'test2', domain: 'ninan.fm'}],
        },
      });
      const result = spec.generate(feed);
      expect(result).toMatchSnapshot();
    });

    it('pubDate', () => {
      const spec = new RSS();
      const feed: RSSFeed = createFeed({
        channel: {
          pubDate: new Date('2020-01-01'),
        },
      });
      const result = spec.generate(feed);
      expect(result).toMatchSnapshot();
    });

    it('lastBuildDate', () => {
      const spec = new RSS();
      const feed: RSSFeed = createFeed({
        channel: {
          lastBuildDate: new Date('2020-01-01'),
        },
      });
      const result = spec.generate(feed);
      expect(result).toMatchSnapshot();
    });

    it('other optional properties', () => {
      const spec = new RSS();
      const feed: RSSFeed = createFeed({
        channel: {
          language: 'en-US',
          copyright: 'copyright',
          managingEditor: 'geo@herald.com (George Matesky)',
          webMaster: 'betty@herald.com (Betty Guernsey)',
          generator: 'NiNan',
          docs: 'https://ninan.fm',
          ttl: 600,
        },
      });
      const result = spec.generate(feed);
      expect(result).toMatchSnapshot();
    });

    describe('items', () => {
      const spec = new RSS();
      const feed: RSSFeed = createFeed({
        channel: {
          items: [
            {
              title: 'test',
              link: 'https://google.com',
              description: 'test test',
              author: 'betty@herald.com (Betty Guernsey)',
              categories: [{name: 'test'}, {name: 'test', domain: 'ninan.fm'}],
              comments: 'https://google.com/test',
              enclosure: {
                url: 'https://facebook.com',
                type: 'audio/mpeg',
              },
              guid: {
                isPermaLink: true,
                value: 'https://google.com/abc',
              },
              pubDate: new Date('2021-01-01'),
              source: {
                url: 'https://google.com',
                name: 'test',
              },
            },
          ],
        },
      });
      const result = spec.generate(feed);
      expect(result).toMatchSnapshot();
    });
  });

  describe('#parse', () => {
    it('anchor', () => {
      const rawXML = fs.readFileSync(
        path.resolve(__dirname, './fixture/anchor.rss'),
        'utf8'
      );
      const spec = new RSS();
      const result = spec.parse(rawXML);
      expect(result).toMatchSnapshot();
    });

    it('transistor', () => {
      const rawXML = fs.readFileSync(
        path.resolve(__dirname, './fixture/transistor.rss'),
        'utf8'
      );
      const spec = new RSS();
      const result = spec.parse(rawXML);
      expect(result).toMatchSnapshot();
    });

    it('soundon', () => {
      const rawXML = fs.readFileSync(
        path.resolve(__dirname, './fixture/soundon.rss'),
        'utf8'
      );
      const spec = new RSS();
      const result = spec.parse(rawXML);
      expect(result).toMatchSnapshot();
    });
  });
});
