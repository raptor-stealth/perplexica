# -*- coding: utf-8 -*-
import requests
import xmltodict
import json
from datetime import datetime
import html


GOOGLE_TRENDS_URL = 'https://trends.google.com/trends/trendingsearches/daily/rss?geo=KR'
OUTPUT_FILE = './ui/public/trending-searches.json'


def fetch_trending_searches():
    try:
        response = requests.get(GOOGLE_TRENDS_URL)
        response.raise_for_status()

        data = xmltodict.parse(response.content)

        items = data['rss']['channel']['item']
        trends = []

        for item in items:
            trend = {
                'title': html.unescape(item['title']),
                'news': [],
                'picture': item.get('ht:picture', None)
            }

            if 'ht:news_item' in item:
                news_items = item['ht:news_item']
                if isinstance(news_items, list):
                    for news_item in news_items:
                        trend['news'].append({
                            'title': html.unescape(news_item['ht:news_item_title']),
                            'snippet': html.unescape(news_item['ht:news_item_snippet']),
                            'url': news_item['ht:news_item_url'],
                            'source': news_item['ht:news_item_source']
                        })
                else:
                    trend['news'].append({
                        'title': html.unescape(news_items['ht:news_item_title']),
                        'snippet': html.unescape(news_items['ht:news_item_snippet']),
                        'url': news_items['ht:news_item_url'],
                        'source': news_items['ht:news_item_source']
                    })

            trends.append(trend)

    except requests.RequestException as e:
        print(f'Failed to fetch data: {e}')
    except Exception as e:
        print(f'Unexpected error occurred: {e}')

    trending_data = {
        'lastUpdated': datetime.now().isoformat(),
        'trends': trends[:10]
    }

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(trending_data, f, ensure_ascii=False, indent=2)

    print(f'{OUTPUT_FILE} file has been successfully updated.')

fetch_trending_searches()
