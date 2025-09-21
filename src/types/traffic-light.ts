// 신호등 관련 타입 정의

export interface TrafficLight {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  intersection: string;
  priority: number;
  address: string;
  region: string;
  crosswalkDirection: string;
  notes?: string;
}

export interface Intersection {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  trafficLights: TrafficLight[];
  totalCount: number;
}

export interface TrafficLightFilter {
  region?: string;
  priority?: number;
  intersection?: string;
}