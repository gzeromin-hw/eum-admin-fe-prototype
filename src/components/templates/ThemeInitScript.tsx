/**
 * FART/FOUC 방지를 위한 테마 초기화 스크립트
 * 서버에서 전달받은 초기 테마와 동기화하여 hydration mismatch 방지
 */
interface ThemeInitScriptProps {
  initialTheme: 'light' | 'dark'
}

export function ThemeInitScript({ initialTheme }: ThemeInitScriptProps) {
  return (
    <script
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            try {
              var serverTheme = '${initialTheme}';
              var cookieTheme = document.cookie.split('; ').find(row => row.startsWith('theme='))?.split('=')[1];
              var localStorageTheme = localStorage.getItem('theme');
              
              // 쿠키가 없으면 서버 테마를 쿠키에 저장
              if (!cookieTheme) {
                document.cookie = 'theme=' + serverTheme + '; path=/; max-age=31536000';
                cookieTheme = serverTheme;
              }
              
              // localStorage와 쿠키 동기화 (쿠키 우선)
              var finalTheme = cookieTheme || localStorageTheme || serverTheme;
              if (localStorageTheme !== finalTheme) {
                localStorage.setItem('theme', finalTheme);
              }
              
              // 쿠키가 없고 localStorage도 없으면 시스템 설정 확인
              if (!cookieTheme && !localStorageTheme) {
                var systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                var systemTheme = systemPrefersDark ? 'dark' : 'light';
                document.cookie = 'theme=' + systemTheme + '; path=/; max-age=31536000';
                localStorage.setItem('theme', systemTheme);
                finalTheme = systemTheme;
              }
              
              // 테마 적용 (서버와 동일하게)
              if (finalTheme === 'dark') {
                document.documentElement.classList.add('dark');
                document.documentElement.setAttribute('data-theme', 'dark');
              } else {
                document.documentElement.classList.remove('dark');
                document.documentElement.setAttribute('data-theme', 'light');
              }
            } catch (e) {}
          })();
        `,
      }}
    />
  )
}
