
// interface NewsItem {
//   title: string;
//   snippet: string;
//   url: string;
//   source: string;
// }

// interface Trend {
//   title: string;
//   news: NewsItem[];
//   picture?: string; // 이미지 필드 추가
// }

// interface TrendingData {
//   lastUpdated: string;
//   trends: Trend[];
// }

// const TrendingSearches = ({ sendMessage }: { sendMessage: (message: string) => void }) => {
//   const [trendingSearches, setTrendingSearches] = useState<Trend[]>([]);
//   const [lastUpdated, setLastUpdated] = useState<string>('');

//   useEffect(() => {
//     const fetchTrendingSearches = async () => {
//       try {
//         const response = await fetch('/trending-searches.json');
//         const data: TrendingData = await response.json();
//         setTrendingSearches(data.trends);
//         setLastUpdated(new Date(data.lastUpdated).toLocaleString());
//       } catch (error) {
//         console.error('실시간 검색어를 불러오는데 실패했습니다:', error);
//       }
//     };

//     fetchTrendingSearches();
//   }, []);

//   const handleSearch = (title: string) => {
//     sendMessage(`${title} 뉴스`);
//   };

//   return (
//     <div className="mt-4">
//       <h3 className="text-black/70 dark:text-white/70 text-xl font-medium mb-2">🔥 이슈 트렌드 검색어</h3>
//       <ul className="space-y-4">
//         {trendingSearches.map((trend, index) => (
//           <li
//             key={index}
//             className="text-black/60 dark:text-white/60 cursor-pointer"
//           >
//             <div className="flex items-center space-x-4">
//               {trend.picture && (
//                 <img
//                   src={trend.picture}
//                   alt={trend.title}
//                   className="w-16 h-16 object-cover rounded"
//                   onClick={() => handleSearch(trend.title)}
//                 />
//               )}
//               <div
//                 className="font-bold text-blue-600 dark:text-blue-400"
//                 onClick={() => handleSearch(trend.title)}
//               >
//                 {trend.title}
//               </div>
//             </div>
//             {trend.news && trend.news.length > 0 && (
//               <ul className="ml-4 space-y-2">
//                 {trend.news.map((newsItem, newsIndex) => (
//                   <li key={newsIndex} className="text-sm">
//                     <a href={newsItem.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400">
//                       {newsItem.title}
//                     </a>
//                     <p className="text-xs text-gray-500 dark:text-gray-400">{newsItem.snippet}</p>
//                     {/* <p className="text-xs text-gray-500 dark:text-gray-400">출처: {newsItem.source}</p> */}
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </li>
//         ))}
//       </ul>
//       <p className="text-xs text-black/40 dark:text-white/40 mt-2">마지막 업데이트: {lastUpdated}</p>
//     </div>
//   );
// };

import React, { useEffect, useState } from 'react';
import EmptyChatMessageInput from './EmptyChatMessageInput';


interface Trend {
  rank: string;
  thumbnail: string;
  title: string;
  snippet: string;
  query: string;
  url: string; 
}


interface TrendingData {
  lastUpdated?: string;
  trends: Trend[];
}

const TrendingSearches = ({ sendMessage }: { sendMessage: (message: string) => void }) => {
  const [trendingSearches, setTrendingSearches] = useState<Trend[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    const fetchTrendingSearches = async () => {
      try {
        const response = await fetch('/240630-145517.json');
        const trends: Trend[] = await response.json();
        setTrendingSearches(trends);
        setLastUpdated(new Date().toLocaleString());
      } catch (error) {
        console.error('실시간 검색어를 불러오는데 실패했습니다:', error);
      }
    };
  
    fetchTrendingSearches();
  }, []);

  const handleSearch = (query: string) => {
    sendMessage(`${query}`);
  };

  return (
    <div className="mt-4">
      <h3 className="text-black/70 dark:text-white/70 text-xl font-medium mb-2">🔥 이슈 트렌드 검색어</h3>
      <ul className="space-y-4">
        {trendingSearches.map((trend, index) => (
          <li key={index} className="text-black/60 dark:text-white/60">
            <div className="flex items-center space-x-4">
              {trend.thumbnail && (
                <a href={trend.url} target="_blank" rel="noopener noreferrer">
                  <img
                    src={trend.thumbnail}
                    alt={trend.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                </a>
              )}
              <div>
                <div
                  className="font-bold text-blue-600 dark:text-blue-400 cursor-pointer"
                  onClick={() => handleSearch(trend.query)}
                >
                  {trend.query}
                </div>
                <a href={trend.url} target="_blank" rel="noopener noreferrer" className="font-medium text-lg text-black dark:text-white">
                  {trend.title}
                </a>
                {/* <p className="text-xs text-gray-500 dark:text-gray-400">{trend.snippet}</p> */}
              </div>
            </div>
          </li>
        ))}
      </ul>
      {/* <p className="text-xs text-black/40 dark:text-white/40 mt-2">마지막 업데이트: {lastUpdated}</p> */}
    </div>
  );
};


const EmptyChat = ({
  sendMessage,
  focusMode,
  setFocusMode,
}: {
  sendMessage: (message: string) => void;
  focusMode: string;
  setFocusMode: (mode: string) => void;
}) => {
  return (
    <div className="relative min-h-screen flex flex-col justify-center">
      <div className="flex flex-col items-center max-w-screen-sm mx-auto p-4 space-y-8 w-full">
        <h2 className="text-black/70 dark:text-white/70 text-3xl font-medium">
          Trend Search begins here.
        </h2>
        <EmptyChatMessageInput
          sendMessage={sendMessage}
          focusMode={focusMode}
          setFocusMode={setFocusMode}
        />
        <TrendingSearches sendMessage={sendMessage} />
      </div>
    </div>
  );
};

export default EmptyChat;