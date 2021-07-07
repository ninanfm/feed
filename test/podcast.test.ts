import fs from 'fs';
import mergeDeep from 'merge-deep';
import path from 'path';
import {Podcast, PodcastFeed} from '../src/podcast';

describe('Podcast', () => {
  const createFeed = (feed: DeepPartial<PodcastFeed> = {}): PodcastFeed => {
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
    it('should pass', () => {
      const spec = new Podcast();
      const feed = createFeed({
        channel: {
          itunes: {
            explicit: false,
            image: 'https://google.com',
            categories: [{name: 'test', categories: [{name: 'abc'}]}],
          },
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
      const spec = new Podcast();
      const result = spec.parse(rawXML);
      expect(result).toMatchSnapshot();
    });

    it('transistor', () => {
      const rawXML = fs.readFileSync(
        path.resolve(__dirname, './fixture/transistor.rss'),
        'utf8'
      );
      const spec = new Podcast();
      const result = spec.parse(rawXML);
      expect(result).toMatchSnapshot();
    });

    it('soundon', () => {
      const rawXML = fs.readFileSync(
        path.resolve(__dirname, './fixture/soundon.rss'),
        'utf8'
      );
      const spec = new Podcast();
      const result = spec.parse(rawXML);
      expect(result).toMatchSnapshot();
    });
  });
});
