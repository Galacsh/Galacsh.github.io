// Reference >> https://web.dev/add-manifest/
const getManifestOptions = meta => ({
  name: meta.title, // used when the app is installed.
  short_name: meta.shortTitle || meta.title, // home screen, launcher, or other places where space may be limited.
  description: meta.description,

  // [display - minimal-ui]
  // provides the user a minimal set of UI elements for controlling navigation (such as back and reload).
  // 최소한의 UI 요소들로 구성
  display: `minimal-ui`,

  // [cache_busting_mode]
  // 아이콘이 쿼리 문자열 변화에 따라 캐싱됨
  icon: `src/images/icon.png`,
  cache_busting_mode: `query`,

  // [start_url]
  // prevents the app from starting on whatever page the user was on when they added your app to their home screen.
  // 홈 스크린에 추가됐을 때 어떤 경로에서 시작할 지 지정
  start_url: meta.pathPrefix,

  // [background_color]
  // used on the splash screen when the application is first launched on mobile.
  // 모바일에서 처음 실행되었을 때 스플래시 화면에서 쓰일 색상
  background_color: meta.themeColor,
  // [theme_color]
  // sets the color of the tool bar, and may be reflected in the app's preview in task switchers.
  // 툴바나 작업 전환기에서의 색 지정
  theme_color: meta.themeColor,
})

module.exports = { getManifestOptions }
