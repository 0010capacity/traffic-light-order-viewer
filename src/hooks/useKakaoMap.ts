import { useEffect, useState } from 'react';

export const useKakaoMap = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 이미 로드된 경우
    if (window.kakao?.maps) {
      window.kakao.maps.load(() => {
        setIsLoaded(true);
      });
      return;
    }

    // 스크립트가 아직 로드되지 않은 경우 대기
    const checkScriptLoaded = () => {
      if (window.kakao?.maps) {
        window.kakao.maps.load(() => {
          setIsLoaded(true);
        });
      } else {
        // 100ms 후 다시 확인
        setTimeout(checkScriptLoaded, 100);
      }
    };

    // 최대 10초 대기
    const timeout = setTimeout(() => {
      setError('Kakao Maps API 로드 시간이 초과되었습니다.');
    }, 10000);

    checkScriptLoaded();

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return { isLoaded, error };
};