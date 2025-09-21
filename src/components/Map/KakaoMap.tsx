import React, { useEffect, useRef } from 'react';
import type { KakaoMapProps } from '../../types/map';

const KakaoMap: React.FC<KakaoMapProps> = ({ 
  center, 
  zoom, 
  onMapLoad, 
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

    // 지도 로드 콜백 호출
    if (onMapLoad) {
      onMapLoad(mapInstance.current);
    }
  }, [center.lat, center.lng, zoom, onMapLoad]);

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