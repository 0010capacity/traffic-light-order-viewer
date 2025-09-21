import { useState, useCallback, useEffect } from 'react';
import { Header, Sidebar } from './components/UI';
import { KakaoMap, TrafficLightMarker } from './components/Map';
import { useKakaoMap } from './hooks/useKakaoMap';
import { 
  generateMockTrafficLights, 
  groupTrafficLightsByIntersection,
  filterTrafficLightsByRegion,
  filterTrafficLightsByPriority,
  searchTrafficLights
} from './utils/api';
import { DEFAULT_MAP_CONFIG } from './utils/constants';
import type { TrafficLight, Intersection } from './types/traffic-light';
import './App.css';

function App() {
  const { isLoaded, error } = useKakaoMap();
  const [map, setMap] = useState<any>(null);
  const [trafficLights, setTrafficLights] = useState<TrafficLight[]>([]);
  const [filteredLights, setFilteredLights] = useState<TrafficLight[]>([]);
  const [intersections, setIntersections] = useState<Intersection[]>([]);
  const [selectedIntersection, setSelectedIntersection] = useState<Intersection | null>(null);
  const [filters, setFilters] = useState<{ region?: string; priority?: number }>({});
  const [searchQuery, setSearchQuery] = useState('');

  // 초기 데이터 로드
  useEffect(() => {
    const mockData = generateMockTrafficLights();
    setTrafficLights(mockData);
    setFilteredLights(mockData);
  }, []);

  // 필터링 및 검색 적용
  useEffect(() => {
    let filtered = trafficLights;

    // 지역 필터 적용
    if (filters.region) {
      filtered = filterTrafficLightsByRegion(filtered, filters.region);
    }

    // 우선순위 필터 적용
    if (filters.priority) {
      filtered = filterTrafficLightsByPriority(filtered, filters.priority);
    }

    // 검색 적용
    if (searchQuery) {
      filtered = searchTrafficLights(filtered, searchQuery);
    }

    setFilteredLights(filtered);

    // 교차로 데이터 업데이트
    const grouped = groupTrafficLightsByIntersection(filtered);
    setIntersections(grouped);
  }, [trafficLights, filters, searchQuery]);

  // 지도 로드 콜백
  const handleMapLoad = useCallback((mapInstance: any) => {
    setMap(mapInstance);
  }, []);

  // 검색 처리
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // 필터 변경 처리
  const handleFilterChange = useCallback((newFilters: { region?: string; priority?: number }) => {
    setFilters(newFilters);
  }, []);

  // 교차로 선택 처리
  const handleIntersectionSelect = useCallback((intersection: Intersection) => {
    setSelectedIntersection(intersection);
    
    // 지도 중심을 선택된 교차로로 이동
    if (map) {
      const moveLatLon = new window.kakao.maps.LatLng(
        intersection.location.lat, 
        intersection.location.lng
      );
      map.setCenter(moveLatLon);
      map.setLevel(3); // 줌 레벨을 3으로 설정 (더 가까이)
    }
  }, [map]);

  // 신호등 마커 클릭 처리
  const handleTrafficLightClick = useCallback((trafficLight: TrafficLight) => {
    // 해당 신호등이 속한 교차로 찾기
    const intersection = intersections.find(inter => 
      inter.trafficLights.some(light => light.id === trafficLight.id)
    );
    
    if (intersection) {
      setSelectedIntersection(intersection);
    }
  }, [intersections]);

  // 로딩 상태
  if (!isLoaded) {
    return (
      <div className="app-loading">
        <div className="loading-spinner">🚦</div>
        <p>지도를 로딩하는 중...</p>
        {error && <p className="error-message">오류: {error}</p>}
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="app-error">
        <h2>⚠️ 오류가 발생했습니다</h2>
        <p>{error}</p>
        <p>Kakao Maps API 키가 올바르게 설정되었는지 확인해주세요.</p>
      </div>
    );
  }

  return (
    <div className="app">
      <Header onSearch={handleSearch} />
      
      <div className="app-content">
        <Sidebar
          intersections={intersections}
          selectedIntersection={selectedIntersection}
          onIntersectionSelect={handleIntersectionSelect}
          onFilterChange={handleFilterChange}
          filters={filters}
        />
        
        <main className="map-container">
          <KakaoMap
            center={DEFAULT_MAP_CONFIG.center}
            zoom={DEFAULT_MAP_CONFIG.zoom}
            onMapLoad={handleMapLoad}
          >
            {map && filteredLights.map((light) => (
              <TrafficLightMarker
                key={light.id}
                trafficLight={light}
                map={map}
                onClick={handleTrafficLightClick}
              />
            ))}
          </KakaoMap>
          
          {filteredLights.length === 0 && searchQuery && (
            <div className="no-results">
              <p>"{searchQuery}" 검색 결과가 없습니다.</p>
              <p>다른 키워드로 검색해보세요.</p>
            </div>
          )}
          
          <div className="map-info">
            <div className="legend">
              <h4>우선순위 범례</h4>
              <div className="legend-items">
                <div className="legend-item">
                  <div className="legend-color" style={{backgroundColor: '#FF4444'}}></div>
                  <span>1순위</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color" style={{backgroundColor: '#FF8800'}}></div>
                  <span>2순위</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color" style={{backgroundColor: '#FFDD00'}}></div>
                  <span>3순위</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color" style={{backgroundColor: '#88DD00'}}></div>
                  <span>4순위</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color" style={{backgroundColor: '#0088DD'}}></div>
                  <span>5순위</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
