// 지도 관련 타입 정의

export interface MapConfig {
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
  bounds?: {
    sw: { lat: number; lng: number };
    ne: { lat: number; lng: number };
  };
}

export interface KakaoMapProps {
  center: { lat: number; lng: number };
  zoom: number;
  onMapLoad?: (map: any) => void;
  children?: React.ReactNode;
}

export interface MarkerProps {
  position: { lat: number; lng: number };
  title?: string;
  content?: string;
  onClick?: () => void;
}

// Kakao Maps API 타입 확장
declare global {
  interface Window {
    kakao: any;
  }
}

export interface KakaoMapsAPI {
  maps: {
    Map: new (container: HTMLElement, options: any) => any;
    Marker: new (options: any) => any;
    InfoWindow: new (options: any) => any;
    LatLng: new (lat: number, lng: number) => any;
    event: {
      addListener: (target: any, type: string, handler: Function) => void;
    };
  };
}