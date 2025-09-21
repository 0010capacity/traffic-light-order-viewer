// API 관련 유틸리티 함수들

import type { TrafficLight, Intersection } from '../types/traffic-light';

// 모의 신호등 데이터 생성 함수
export const generateMockTrafficLights = (): TrafficLight[] => {
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