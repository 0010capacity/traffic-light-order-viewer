import React, { useEffect, useRef } from 'react';
import type { TrafficLight } from '../../types/traffic-light';
import { PRIORITY_COLORS } from '../../utils/constants';

interface TrafficLightMarkerProps {
  trafficLight: TrafficLight;
  map: any;
  onClick: (trafficLight: TrafficLight) => void;
}

const TrafficLightMarker: React.FC<TrafficLightMarkerProps> = ({
  trafficLight,
  map,
  onClick,
}) => {
  const markerRef = useRef<any>(null);
  const infoWindowRef = useRef<any>(null);

  useEffect(() => {
    if (!map || !window.kakao?.maps) return;

    // 마커 위치 설정
    const markerPosition = new window.kakao.maps.LatLng(
      trafficLight.location.lat,
      trafficLight.location.lng
    );

    // 커스텀 마커 이미지 생성 (우선순위 번호가 들어간 원형 마커)
    const markerContent = `
      <div style="
        width: 32px;
        height: 32px;
        background: ${PRIORITY_COLORS[trafficLight.priority as keyof typeof PRIORITY_COLORS] || PRIORITY_COLORS.default};
        border: 3px solid white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        color: white;
        font-size: 14px;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        transition: transform 0.2s;
      " 
      onmouseover="this.style.transform='scale(1.2)'"
      onmouseout="this.style.transform='scale(1)'"
      >
        ${trafficLight.priority}
      </div>
    `;

    // 커스텀 오버레이 생성
    markerRef.current = new window.kakao.maps.CustomOverlay({
      position: markerPosition,
      content: markerContent,
      xAnchor: 0.5,
      yAnchor: 1,
    });

    // 지도에 마커 표시
    markerRef.current.setMap(map);

    // 인포윈도우 내용
    const infoWindowContent = `
      <div style="
        padding: 12px;
        min-width: 200px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      ">
        <div style="
          font-weight: bold;
          color: #2d3748;
          margin-bottom: 6px;
          font-size: 14px;
        ">
          ${trafficLight.name}
        </div>
        <div style="
          color: #718096;
          font-size: 12px;
          margin-bottom: 8px;
          line-height: 1.4;
        ">
          ${trafficLight.address}
        </div>
        <div style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
        ">
          <span style="
            background: ${PRIORITY_COLORS[trafficLight.priority as keyof typeof PRIORITY_COLORS] || PRIORITY_COLORS.default};
            color: white;
            padding: 2px 8px;
            border-radius: 12px;
            font-weight: bold;
          ">
            ${trafficLight.priority}순위
          </span>
          <span style="color: #718096;">
            ${trafficLight.crosswalkDirection}
          </span>
        </div>
        ${trafficLight.notes ? `
          <div style="
            margin-top: 8px;
            padding-top: 8px;
            border-top: 1px solid #e2e8f0;
            color: #4a5568;
            font-size: 11px;
            line-height: 1.3;
          ">
            ${trafficLight.notes}
          </div>
        ` : ''}
      </div>
    `;

    // 인포윈도우 생성
    infoWindowRef.current = new window.kakao.maps.InfoWindow({
      content: infoWindowContent,
      removable: true,
    });

    // 마커 클릭 이벤트
    const markerElement = markerRef.current.getContent();
    if (markerElement) {
      markerElement.addEventListener('click', () => {
        // 다른 열려있는 인포윈도우 닫기
        infoWindowRef.current.close();
        
        // 인포윈도우 열기
        infoWindowRef.current.open(map, markerRef.current);
        
        // 부모 컴포넌트의 onClick 콜백 호출
        onClick(trafficLight);
      });
    }

    // 클린업
    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
      }
    };
  }, [trafficLight, map, onClick]);

  return null; // 이 컴포넌트는 DOM에 직접 렌더링하지 않음
};

export default TrafficLightMarker;