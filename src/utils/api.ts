// API 관련 유틸리티 함수들

import type { TrafficLight, Intersection } from '../types/traffic-light';

// 경기도 신호등 API 설정 (현재 서버 점검 중이므로 Mock 데이터 사용)
const GYEONGGI_API_CONFIG = {
  BASE_URL: 'https://openapi.gg.go.kr/Signlamp',
  KEY: 'd85ffe8364ba4dd78d23750d37510328',
  DEFAULT_PARAMS: {
    Type: 'json',
    pIndex: 1,
    pSize: 100,
  },
};

// 카카오 지오코딩 서비스를 이용한 주소 -> 좌표 변환
export const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number } | null> => {
  return new Promise((resolve) => {
    if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services) {
      console.warn('카카오 맵 서비스가 로드되지 않았습니다.');
      resolve(null);
      return;
    }

    const geocoder = new window.kakao.maps.services.Geocoder();
    
    geocoder.addressSearch(address, (result: any[], status: any) => {
      if (status === window.kakao.maps.services.Status.OK && result.length > 0) {
        const coord = result[0];
        resolve({
          lat: parseFloat(coord.y),
          lng: parseFloat(coord.x)
        });
      } else {
        console.warn(`주소 변환 실패: ${address}`);
        resolve(null);
      }
    });
  });
};

// JSON 파일에서 신호등 데이터 가져오기 (지오코딩 포함) - 현재 비활성화
export const fetchTrafficLightsFromAPI = async (): Promise<TrafficLight[]> => {
  try {
    console.log('API 점검으로 인해 Mock 데이터를 사용합니다.');
    
    // 실제 JSON 로딩 로직은 비활성화
    // const response = await fetch('/traffic-lights.json');
    // if (!response.ok) {
    //   throw new Error(`HTTP error! status: ${response.status}`);
    // }
    // const apiData = await response.json();
    // const trafficLights = await convertApiDataToTrafficLights(apiData);
    
    // 바로 Mock 데이터 반환
    return generateMockTrafficLights_backup();
    
  } catch (error) {
    console.error('데이터 로드 실패:', error);
    console.log('Mock 데이터를 사용합니다.');
    return generateMockTrafficLights_backup();
  }
};

// API 데이터를 TrafficLight 형식으로 변환 (지오코딩 포함) - 현재 비활성화
// const convertApiDataToTrafficLights = async (apiData: any[]): Promise<TrafficLight[]> => {
//   const trafficLights: TrafficLight[] = [];
//   
//   // 배치 처리를 위한 설정
//   const batchSize = 10;
//   const delay = 1000; // 1초 대기
//   
//   for (let i = 0; i < apiData.length; i += batchSize) {
//     const batch = apiData.slice(i, i + batchSize);
//     
//     const batchPromises = batch.map(async (item: any, index: number) => {
//       const address = generateAddressFromData(item);
//       
//       if (!address) {
//         console.warn(`주소 생성 실패 (ID: ${item.FCLT_MGT_NO}):`, item.SIGNGU_NM, item.ROUTE_NM);
//         return null;
//       }
//       
//       try {
//         // 배치 내에서 약간의 지연 추가
//         await new Promise(resolve => setTimeout(resolve, index * 100));
//         
//         const coordinates = await geocodeAddress(address);
//         
//         if (!coordinates) {
//           console.warn(`지오코딩 실패: ${address}`);
//           return null;
//         }
//         
//         return {
//           id: item.FCLT_MGT_NO || `unknown-${i + index}`,
//           name: `${item.SIGNGU_NM} ${item.ROUTE_NM}`,
//           position: coordinates,
//           priority: calculatePriority(item),
//           installDate: item.INSTALL_YMD || '',
//           management: item.MANAGE_INSTT_NM || '',
//           department: item.CHRG_DEPT_NM || '',
//           phone: item.CHRG_DEPT_TELNO || ''
//         };
//         
//       } catch (error) {
//         console.error(`지오코딩 오류 (${address}):`, error);
//         return null;
//       }
//     });
//     
//     const batchResults = await Promise.all(batchPromises);
//     const validResults = batchResults.filter((item): item is TrafficLight => item !== null);
//     trafficLights.push(...validResults);
//     
//     console.log(`배치 ${Math.floor(i / batchSize) + 1} 완료: ${validResults.length}/${batch.length} 성공`);
//     
//     // 다음 배치 전 대기
//     if (i + batchSize < apiData.length) {
//       await new Promise(resolve => setTimeout(resolve, delay));
//     }
//   }
//   
//   console.log(`총 ${trafficLights.length}개의 신호등 데이터를 처리했습니다.`);
//   return trafficLights;
// };

// 모의 신호등 데이터 생성 함수 (백업용)
export const generateMockTrafficLights_backup = (): TrafficLight[] => {
  const mockData: TrafficLight[] = [
    // 수원시 데이터
    {
      id: 'tl_001',
      name: '수원역사거리-북측',
      location: { lat: 37.2663, lng: 127.0011 },
      intersection: '수원역사거리',
      priority: 1,
      address: '경기도 수원시 팔달구 매산로1가 15',
      region: '수원시',
      crosswalkDirection: '남북방향',
      notes: '수원역 주변 주요 교차로'
    },
    {
      id: 'tl_002',
      name: '수원역사거리-동측',
      location: { lat: 37.2665, lng: 127.0013 },
      intersection: '수원역사거리',
      priority: 2,
      address: '경기도 수원시 팔달구 매산로1가 15',
      region: '수원시',
      crosswalkDirection: '동서방향'
    },
    {
      id: 'tl_003',
      name: '수원역사거리-남측',
      location: { lat: 37.2661, lng: 127.0011 },
      intersection: '수원역사거리',
      priority: 3,
      address: '경기도 수원시 팔달구 매산로1가 15',
      region: '수원시',
      crosswalkDirection: '남북방향'
    },
    {
      id: 'tl_004',
      name: '수원역사거리-서측',
      location: { lat: 37.2663, lng: 127.0009 },
      intersection: '수원역사거리',
      priority: 4,
      address: '경기도 수원시 팔달구 매산로1가 15',
      region: '수원시',
      crosswalkDirection: '동서방향'
    },
    // 성남시 데이터
    {
      id: 'tl_005',
      name: '판교역사거리-북측',
      location: { lat: 37.3951, lng: 127.1113 },
      intersection: '판교역사거리',
      priority: 1,
      address: '경기도 성남시 분당구 판교역로 235',
      region: '성남시',
      crosswalkDirection: '남북방향',
      notes: '판교 테크노밸리 인근'
    },
    {
      id: 'tl_006',
      name: '판교역사거리-동측',
      location: { lat: 37.3953, lng: 127.1115 },
      intersection: '판교역사거리',
      priority: 2,
      address: '경기도 성남시 분당구 판교역로 235',
      region: '성남시',
      crosswalkDirection: '동서방향'
    },
    // 고양시 데이터
    {
      id: 'tl_007',
      name: '일산서구청사거리-북측',
      location: { lat: 37.6548, lng: 126.7706 },
      intersection: '일산서구청사거리',
      priority: 1,
      address: '경기도 고양시 일산서구 중앙로 1556',
      region: '고양시',
      crosswalkDirection: '남북방향'
    },
    {
      id: 'tl_008',
      name: '일산서구청사거리-동측',
      location: { lat: 37.6550, lng: 126.7708 },
      intersection: '일산서구청사거리',
      priority: 2,
      address: '경기도 고양시 일산서구 중앙로 1556',
      region: '고양시',
      crosswalkDirection: '동서방향'
    },
    {
      id: 'tl_009',
      name: '일산서구청사거리-남측',
      location: { lat: 37.6546, lng: 126.7706 },
      intersection: '일산서구청사거리',
      priority: 3,
      address: '경기도 고양시 일산서구 중앙로 1556',
      region: '고양시',
      crosswalkDirection: '남북방향'
    },
    // 용인시 데이터
    {
      id: 'tl_010',
      name: '죽전역사거리-서측',
      location: { lat: 37.3248, lng: 127.1067 },
      intersection: '죽전역사거리',
      priority: 1,
      address: '경기도 용인시 수지구 죽전로 152',
      region: '용인시',
      crosswalkDirection: '동서방향'
    },
    {
      id: 'tl_011',
      name: '죽전역사거리-북측',
      location: { lat: 37.3250, lng: 127.1069 },
      intersection: '죽전역사거리',
      priority: 2,
      address: '경기도 용인시 수지구 죽전로 152',
      region: '용인시',
      crosswalkDirection: '남북방향'
    }
  ];

  return mockData;
};

// 교차로별로 신호등 데이터 그룹화
export const groupTrafficLightsByIntersection = (trafficLights: TrafficLight[]): Intersection[] => {
  const intersectionMap = new Map<string, TrafficLight[]>();

  // 교차로별로 신호등들을 그룹화
  trafficLights.forEach(light => {
    if (!intersectionMap.has(light.intersection)) {
      intersectionMap.set(light.intersection, []);
    }
    intersectionMap.get(light.intersection)?.push(light);
  });

  // Intersection 객체 배열로 변환
  const intersections: Intersection[] = [];
  intersectionMap.forEach((lights, intersectionName) => {
    if (lights.length > 0) {
      // 교차로의 중심점 계산 (신호등들의 평균 좌표)
      const centerLat = lights.reduce((sum, light) => sum + light.location.lat, 0) / lights.length;
      const centerLng = lights.reduce((sum, light) => sum + light.location.lng, 0) / lights.length;

      intersections.push({
        id: `intersection_${intersectionName.replace(/\s+/g, '_')}`,
        name: intersectionName,
        location: {
          lat: centerLat,
          lng: centerLng
        },
        trafficLights: lights.sort((a, b) => a.priority - b.priority), // 우선순위별 정렬
        totalCount: lights.length
      });
    }
  });

  return intersections;
};

// 지역별 신호등 필터링
export const filterTrafficLightsByRegion = (trafficLights: TrafficLight[], region: string): TrafficLight[] => {
  if (!region || region === 'all') {
    return trafficLights;
  }
  return trafficLights.filter(light => light.region === region);
};

// 우선순위별 신호등 필터링
export const filterTrafficLightsByPriority = (trafficLights: TrafficLight[], priority: number): TrafficLight[] => {
  if (!priority) {
    return trafficLights;
  }
  return trafficLights.filter(light => light.priority === priority);
};

// 거리 계산 함수 (두 좌표 사이의 거리를 km 단위로 반환)
export const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 6371; // 지구의 반지름 (km)
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// 검색 함수 (교차로명, 주소, 지역으로 검색)
export const searchTrafficLights = (trafficLights: TrafficLight[], query: string): TrafficLight[] => {
  if (!query.trim()) {
    return trafficLights;
  }

  const searchTerm = query.toLowerCase().trim();
  return trafficLights.filter(light =>
    light.name.toLowerCase().includes(searchTerm) ||
    light.intersection.toLowerCase().includes(searchTerm) ||
    light.address.toLowerCase().includes(searchTerm) ||
    light.region.toLowerCase().includes(searchTerm)
  );
};