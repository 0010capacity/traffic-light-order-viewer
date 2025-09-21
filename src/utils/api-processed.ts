/**
 * 전처리된 데이터를 위한 새로운 API 함수
 */

import type { TrafficLight } from '../types/traffic-light';
import { generateMockTrafficLights_backup } from './api';

// 전처리된 데이터에서 신호등 정보 로드
export const fetchProcessedTrafficLights = async (): Promise<TrafficLight[]> => {
  try {
    console.log('전처리된 신호등 데이터를 로드합니다...');

    // 전처리된 JSON 파일에서 데이터 로드
    const response = await fetch('/traffic-lights-processed.json');
    if (!response.ok) {
      console.warn('전처리된 데이터를 찾을 수 없습니다. Mock 데이터를 사용합니다.');
      return generateMockTrafficLights_backup();
    }
    
    const processedData = await response.json();
    
    // 좌표가 있는 데이터만 필터링하고 TrafficLight 형식으로 변환
    const trafficLights: TrafficLight[] = processedData
      .filter((item: any) => item.coordinates && item.coordinates.lat && item.coordinates.lng)
      .map((item: any, index: number) => {
        // 우선순위 계산
        let priority = 5;
        const orderInfo = item.SGNL_LLGT_ORDR_INFO;
        if (orderInfo && typeof orderInfo === 'string') {
          const colorCount = (orderInfo.match(/녹색|황색|적색/g) || []).length;
          priority = Math.min(Math.max(1, 6 - colorCount), 5);
        }

        // 교차로명 생성
        const intersectionName = `${item.SIGNGU_NM || ''}${item.ROUTE_NM || '교차로'}`.replace(/\s+/g, ' ').trim();

        // 방향 정보
        const direction = item.ROUTE_INFO === '3' ? '양방향' : 
                         item.TFLGT_DIV === '1' ? '차량신호등' : 
                         item.TFLGT_DIV === '2' ? '보행신호등' : '기타';

        return {
          id: item.TFLGT_MANAGE_NO_INFO || `processed_${index}`,
          name: `${intersectionName}-${direction}`,
          location: {
            lat: item.coordinates.lat,
            lng: item.coordinates.lng,
          },
          intersection: intersectionName,
          priority: priority,
          address: item.geocoding_info?.kakao_road_address || item.geocoding_info?.kakao_address_name || item.geocoding_info?.generated_address || '',
          region: item.SIGNGU_NM?.trim() || '기타',
          crosswalkDirection: direction,
          notes: item.BLINDPSN_SOUND_SGNAPP_EXTNO === 'Y' ? '음향신호기' : undefined,
        };
      });

    console.log(`✅ ${trafficLights.length}개의 신호등 데이터 로드 완료`);
    
    // 지역별 통계
    const regionStats = new Map<string, number>();
    trafficLights.forEach(light => {
      const count = regionStats.get(light.region) || 0;
      regionStats.set(light.region, count + 1);
    });
    
    console.log('📊 지역별 신호등 수:');
    Array.from(regionStats.entries())
      .sort((a, b) => b[1] - a[1])
      .forEach(([region, count]) => {
        console.log(`  ${region}: ${count}개`);
      });

    return trafficLights;
    
  } catch (error) {
    console.error('전처리된 데이터 로드 실패:', error);
    console.log('Mock 데이터를 사용합니다.');
    return generateMockTrafficLights_backup();
  }
};

// 기존 API 함수들은 그대로 유지 (fallback용)
// ... (기존 코드)