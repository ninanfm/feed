import 'reflect-metadata';
import {create} from '..';
import {Podcast, Episode} from '../feed/podcast';

const ep1 = create(Episode, {
  id: '1',
  title: 'ep1',
  audioUrl: 'http://localhost/audio.mp3',
  audioSize: 1024,
  audioType: 'audio/mpeg',
  publishedAt: new Date(),
  description: '<a href="http://google.com">link</a>',
});

const podacst = create(Podcast, {
  title: 'example',
  feedUrl: 'http://localhost/feed.xml',
  episodes: [ep1],
  description: '<a href="http://google.com">link</a>',
  coverImageUrl: 'https://localhost/cover.jpeg',
  language: 'zh-tw',
  categories: ['Kids & family'],
  ownerName: 'Po-Ying Chen',
  ownerEmail: 'poying.me@gmail.com',
  homePageUrl: 'https://google.com',
});

console.log(podacst.toRSS());
