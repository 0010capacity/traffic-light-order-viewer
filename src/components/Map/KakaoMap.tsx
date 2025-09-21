import React, { useEffect, useRef } from 'react';
import type { KakaoMapProps } from '../../types/map';

interface ExtendedKakaoMapProps extends KakaoMapProps {
  onMarkerClick?: (trafficLightId: string) => void;
}

const KakaoMap: React.FC<ExtendedKakaoMapProps> = ({ 
  center, 
  zoom, 
  onMapLoad, 
  onMarkerClick,
  children 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Kakao Maps API 로드 확인
    if (!window.kakao?.maps) {
      console.error('Kakao Maps API가 로드되지 않았습니다.');
      return;
    }

    // 지도 생성
    const mapOption = {
      center: new window.kakao.maps.LatLng(center.lat, center.lng),
      level: zoom,
    };

    mapInstance.current = new window.kakao.maps.Map(mapRef.current, mapOption);

    // 전역 클릭 핸들러 설정 (마커 클릭용)
    (window as any).trafficLightClick = (trafficLightId: string) => {
      const infoWindowData = (window as any).trafficLightInfoWindows?.[trafficLightId];
      if (infoWindowData && onMarkerClick) {
        const { infoWindow, marker, trafficLight, onClick } = infoWindowData;
        
        // 다른 열려있는 인포윈도우 닫기
        Object.values((window as any).trafficLightInfoWindows || {}).forEach((data: any) => {
          if (data.infoWindow) {
            data.infoWindow.close();
          }
        });
        
        // 인포윈도우 열기
        infoWindow.open(mapInstance.current, marker);
        
        // 부모 컴포넌트의 onClick 콜백 호출
        onClick(trafficLight);
      }
    };

    // 지도 로드 콜백 호출
    if (onMapLoad) {
      onMapLoad(mapInstance.current);
    }
  }, [center.lat, center.lng, zoom, onMapLoad, onMarkerClick]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div 
        ref={mapRef} 
        style={{ 
          width: '100%', 
          height: '100%',
          borderRadius: '8px',
          overflow: 'hidden'
        }} 
      />
      {children}
    </div>
  );
};

export default KakaoMap;