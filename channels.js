/**
 * channels.js — Edit this file to add/remove/reorder channels.
 * Each channel needs: id, name, shortName, stream (m3u8 URL), quality ('HD' or 'SD')
 * logo is optional — leave as '' for auto-generated initials badge.
 */
const CHANNELS_DATA = {
  categories: [
    {
      name: 'Sports',
      icon: '🏆',
      channels: [
        {
          id: 't-sports',
          name: 'T Sports',
          shortName: 'T SPT',
          logo: '',
          stream: 'https://tvsen7.aynaott.com/tsports-hd/index.m3u8',
          quality: 'HD'
        },
      ]
    },
    {
      name: 'Bangladesh',
      icon: '🇧🇩',
      channels: [
        {
          id: 'btv',
          name: 'BTV National',
          shortName: 'BTV',
          logo: '',
          stream: 'https://tvsen6.aynaott.com/btvhd/index.m3u8',
          quality: 'HD'
        },
        {
          id: 'jamuna-tv',
          name: 'Jamuna TV',
          shortName: 'JTV',
          logo: '',
          stream: 'https://tvsen6.aynaott.com/jamunatv/index.m3u8',
          quality: 'HD'
        },
        {
          id: 'somoy-tv',
          name: 'Somoy TV',
          shortName: 'SOMOY',
          logo: '',
          stream: 'https://tvsen6.aynaott.com/somoytv/index.m3u8',
          quality: 'HD'
        },
        {
          id: 'ekattor-tv',
          name: 'Ekattor TV',
          shortName: '71TV',
          logo: '',
          stream: 'https://tvsen6.aynaott.com/ekattorbdtv/index.m3u8',
          quality: 'HD'
        },
      ]
    },
  ]
};
