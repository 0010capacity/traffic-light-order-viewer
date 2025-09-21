import { useEffect, useState } from 'react';
import { API_CONFIG } from '../utils/constants';

export const useKakaoMap = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 이미 로드된 경우
    if (window.kakao?.maps) {
      setIsLoaded(true);
      return;
    }

    // API 키 확인
    if (!API_CONFIG.KAKAO_MAP_API_KEY) {
      setError('Kakao Maps API 키가 설정되지 않았습니다. .env.local 파일을 확인해주세요.');
      return;
    }

    // 스크립트 태그 생성
    const script = document.createElement('script');
    script.src = `${API_CONFIG.KAKAO_MAP_URL}?appkey=${API_CONFIG.KAKAO_MAP_API_KEY}&autoload=false`;
    script.async = true;

    // 스크립트 로드 성공
    script.onload = () => {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          setIsLoaded(true);
        });
      } else {
        setError('Kakao Maps API 로드에 실패했습니다.');
      }
    };

    // 스크립트 로드 실패
    script.onerror = () => {
      setError('Kakao Maps API 스크립트 로드에 실패했습니다.');
    };

    // 문서에 스크립트 추가
    document.head.appendChild(script);

    // 클린업
    return () => {
      // 스크립트 제거는 하지 않음 (재사용을 위해)
    };
  }, []);

  return { isLoaded, error };
};