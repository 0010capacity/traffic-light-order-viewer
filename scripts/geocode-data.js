/**
 * 경기도 신호등 데이터 지오코딩 전처리 스크립트
 * 
 * 사용법:
 * 1. 원본 JSON 파일을 public/traffic-lights-raw.json 에 저장
 * 2. node scripts/geocode-data.js 실행
 * 3. 변환된 데이터가 public/traffic-lights-processed.json 에 저장됨
 */

const fs = require('fs').promises;
const path = require('path');

// 카카오 REST API를 사용한 지오코딩
const KAKAO_REST_API_KEY = 'YOUR_KAKAO_REST_API_KEY'; // 여기에 카카오 REST API 키 입력

async function geocodeAddress(address) {
  try {
    const response = await fetch(`https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(address)}`, {
      headers: {
        'Authorization': `KakaoAK ${KAKAO_REST_API_KEY}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.documents && data.documents.length > 0) {
      const result = data.documents[0];
      return {
        lat: parseFloat(result.y),
        lng: parseFloat(result.x),
        address_name: result.address_name,
        road_address_name: result.road_address?.address_name
      };
    }
    
    return null;
  } catch (error) {
    console.error(`지오코딩 실패 - ${address}:`, error.message);
    return null;
  }
}

async function processTrafficLightData() {
  try {
    console.log('📍 경기도 신호등 데이터 지오코딩 시작...');
    
    // 원본 데이터 로드
    const rawDataPath = path.join(__dirname, '../public/traffic-lights.json');
    const rawData = JSON.parse(await fs.readFile(rawDataPath, 'utf-8'));
    
    console.log(`📊 총 ${rawData.length}개의 원본 데이터 로드됨`);
    
    // 주소별 그룹화
    const addressGroups = new Map();
    const processedData = [];
    
  apiData.forEach((item, index) => {
    // 주소 정보 구성: 시도 + 시군구 + 도로명
    const sido = item.SIDO_NM?.trim() || '경기도';
    const signgu = item.SIGNGU_NM?.trim();
    const route = item.ROUTE_NM?.trim();
    
    // 기본 주소 형식들을 시도
    const addressCandidates = [];
    
    if (signgu && route) {
      // 1순위: 시도 + 시군구 + 도로명
      addressCandidates.push(`${sido} ${signgu} ${route}`);
      // 2순위: 시군구 + 도로명
      addressCandidates.push(`${signgu} ${route}`);
    }
    
    if (signgu) {
      // 3순위: 시도 + 시군구 (시군청 주소로 대체)
      addressCandidates.push(`${sido} ${signgu}`);
    }
    
    // 가장 구체적인 주소를 사용
    const address = addressCandidates.find(addr => addr.trim().length > 0);
    
    if (!address) {
      console.warn(`❌ 주소 생성 실패 - Index: ${index}, 시군구: ${signgu}, 도로: ${route}`);
      return;
    }
    
    if (!addressGroups.has(address)) {
      addressGroups.set(address, []);
    }
    addressGroups.get(address).push({ ...item, originalIndex: index, generatedAddress: address });
  });    console.log(`🗺️  ${addressGroups.size}개의 고유 주소 발견`);
    
    let processedCount = 0;
    let successCount = 0;
    
    for (const [address, items] of addressGroups.entries()) {
      try {
        console.log(`🔍 지오코딩 중: ${address} (${items.length}개 항목)`);
        
        const coordinates = await geocodeAddress(address);
        
        if (coordinates) {
          successCount++;
          
          // 같은 주소의 모든 아이템에 좌표 추가
          items.forEach(item => {
            const processedItem = {
              ...item,
              coordinates: {
                lat: coordinates.lat,
                lng: coordinates.lng
              },
              geocoding_info: {
                generated_address: item.generatedAddress,
                original_sido: item.SIDO_NM,
                original_signgu: item.SIGNGU_NM,
                original_route: item.ROUTE_NM,
                kakao_address_name: coordinates.address_name,
                kakao_road_address: coordinates.road_address_name,
                geocoded_at: new Date().toISOString()
              }
            };
            
            processedData.push(processedItem);
          });
          
          console.log(`✅ 성공: ${coordinates.lat}, ${coordinates.lng}`);
        } else {
          console.log(`❌ 실패: ${address}`);
          
          // 좌표를 찾지 못한 경우에도 데이터는 보존
          items.forEach(item => {
            const processedItem = {
              ...item,
              coordinates: null,
              geocoding_info: {
                generated_address: item.generatedAddress,
                original_sido: item.SIDO_NM,
                original_signgu: item.SIGNGU_NM,
                original_route: item.ROUTE_NM,
                geocoding_failed: true,
                geocoded_at: new Date().toISOString()
              }
            };
            
            processedData.push(processedItem);
          });
        }
        
        processedCount++;
        
        // 진행상황 출력
        if (processedCount % 10 === 0) {
          console.log(`📈 진행상황: ${processedCount}/${addressGroups.size} (성공: ${successCount})`);
        }
        
        // API 제한을 위한 딜레이 (카카오는 초당 10건 제한)
        await new Promise(resolve => setTimeout(resolve, 150));
        
      } catch (error) {
        console.error(`💥 처리 중 오류 - ${address}:`, error);
      }
    }
    
    // 결과 저장
    const outputPath = path.join(__dirname, '../public/traffic-lights-processed.json');
    await fs.writeFile(outputPath, JSON.stringify(processedData, null, 2), 'utf-8');
    
    // 통계 출력
    const withCoordinates = processedData.filter(item => item.coordinates).length;
    const withoutCoordinates = processedData.filter(item => !item.coordinates).length;
    
    console.log('\n🎉 지오코딩 완료!');
    console.log(`📊 전체 데이터: ${processedData.length}개`);
    console.log(`✅ 좌표 변환 성공: ${withCoordinates}개`);
    console.log(`❌ 좌표 변환 실패: ${withoutCoordinates}개`);
    console.log(`📁 저장 경로: ${outputPath}`);
    
    // 지역별 통계
    const regionStats = new Map();
    processedData.forEach(item => {
      const region = item.SIGNGU_NM || '기타';
      if (!regionStats.has(region)) {
        regionStats.set(region, { total: 0, withCoords: 0 });
      }
      const stats = regionStats.get(region);
      stats.total++;
      if (item.coordinates) stats.withCoords++;
    });
    
    console.log('\n📍 지역별 통계:');
    for (const [region, stats] of regionStats.entries()) {
      console.log(`  ${region}: ${stats.withCoords}/${stats.total} (${Math.round(stats.withCoords/stats.total*100)}%)`);
    }
    
  } catch (error) {
    console.error('💥 스크립트 실행 중 오류:', error);
    process.exit(1);
  }
}

// 스크립트 실행
if (require.main === module) {
  processTrafficLightData();
}

module.exports = { processTrafficLightData, geocodeAddress };