import React from 'react';
import type { Intersection } from '../../types/traffic-light';
import { GYEONGGI_REGIONS, PRIORITY_COLORS } from '../../utils/constants';
import './Sidebar.css';

interface SidebarProps {
  intersections: Intersection[];
  selectedIntersection: Intersection | null;
  onIntersectionSelect: (intersection: Intersection) => void;
  onFilterChange: (filters: { region?: string; priority?: number }) => void;
  filters: { region?: string; priority?: number };
}

const Sidebar: React.FC<SidebarProps> = ({
  intersections,
  selectedIntersection,
  onIntersectionSelect,
  onFilterChange,
  filters,
}) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        {/* 필터 섹션 */}
        <div className="filter-section">
          <h3>🔍 필터</h3>
          
          <div className="filter-group">
            <label htmlFor="region-select">지역:</label>
            <select
              id="region-select"
              value={filters.region || 'all'}
              onChange={(e) =>
                onFilterChange({
                  ...filters,
                  region: e.target.value === 'all' ? undefined : e.target.value,
                })
              }
              className="filter-select"
            >
              <option value="all">전체 지역</option>
              {GYEONGGI_REGIONS.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="priority-select">우선순위:</label>
            <select
              id="priority-select"
              value={filters.priority || 'all'}
              onChange={(e) =>
                onFilterChange({
                  ...filters,
                  priority: e.target.value === 'all' ? undefined : Number(e.target.value),
                })
              }
              className="filter-select"
            >
              <option value="all">전체 우선순위</option>
              <option value={1}>1순위</option>
              <option value={2}>2순위</option>
              <option value={3}>3순위</option>
              <option value={4}>4순위</option>
              <option value={5}>5순위</option>
            </select>
          </div>
        </div>

        {/* 교차로 목록 */}
        <div className="intersection-section">
          <h3>📍 교차로 ({intersections.length}개)</h3>
          <div className="intersection-list">
            {intersections.map((intersection) => (
              <div
                key={intersection.id}
                className={`intersection-item ${
                  selectedIntersection?.id === intersection.id ? 'selected' : ''
                }`}
                onClick={() => onIntersectionSelect(intersection)}
              >
                <div className="intersection-name">{intersection.name}</div>
                <div className="intersection-info">
                  <span className="traffic-light-count">
                    신호등 {intersection.totalCount}개
                  </span>
                  <span className="region">
                    {intersection.trafficLights[0]?.region}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 선택된 교차로 상세 정보 */}
        {selectedIntersection && (
          <div className="detail-section">
            <h3>📋 상세 정보</h3>
            <div className="intersection-detail">
              <h4>{selectedIntersection.name}</h4>
              <p className="intersection-address">
                {selectedIntersection.trafficLights[0]?.address}
              </p>
              
              <div className="traffic-lights-list">
                <h5>신호등 우선순위:</h5>
                {selectedIntersection.trafficLights.map((light) => (
                  <div key={light.id} className="traffic-light-item">
                    <div
                      className="priority-badge"
                      style={{ 
                        backgroundColor: PRIORITY_COLORS[light.priority as keyof typeof PRIORITY_COLORS] || PRIORITY_COLORS.default 
                      }}
                    >
                      {light.priority}
                    </div>
                    <div className="traffic-light-info">
                      <div className="light-name">{light.name}</div>
                      <div className="light-direction">
                        {light.crosswalkDirection}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {selectedIntersection.trafficLights[0]?.notes && (
                <div className="notes">
                  <strong>참고:</strong> {selectedIntersection.trafficLights[0].notes}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;