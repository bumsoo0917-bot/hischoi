# 한국사 수련장

최태성 한국사 필기를 바탕으로 1~10강의 연습 전투, 3단계 보스전, 도감과 계정별 순위표를 제공하는 Next.js 앱입니다. 배포 대상은 Vercel이며 영구 데이터는 Firebase Cloud Firestore에 저장합니다.

## 요구 사항

- Node.js 22.13 이상
- npm
- Firebase 프로젝트와 Vercel 계정(실제 배포 시)

```bash
npm install
npm run dev
npm test
npm run lint
npm run build
```

## 저장 구조와 보안

서버는 `playerProgress/{identityId}` 문서를 사용합니다. Firebase 계정은 `firebase:{uid}`, 기존 ChatGPT 계정은 이메일 원문 대신 `chatgpt:{SHA-256}` 문서 ID를 사용합니다.

문서에는 `currentGold`, `totalGold`, `bossesDefeated`, `masteredLessons`, `title`, 강의별 `lessonBosses`·`lessonProgress`, `defeated`, `collection`, `attempts`, `rankScore`, `updatedAt`이 저장됩니다. 브라우저는 Firestore에 직접 접근하지 않으며 모든 읽기·쓰기는 Next.js API와 Firebase Admin SDK를 통과합니다. 서버 트랜잭션은 기존 해금 취소, 한 요청에서 비정상적인 골드·보스·도감 증가, 시도 횟수 조작을 거부합니다. `firestore.rules`는 클라이언트의 모든 직접 접근을 차단합니다.

## Firebase 설정

1. [Firebase Console](https://console.firebase.google.com/)에서 프로젝트를 생성하고 **Firestore Database**를 프로덕션 모드로 활성화합니다.
2. **프로젝트 설정 → 내 앱 → 웹 앱 추가**에서 웹 앱을 등록합니다.
3. **Authentication → Sign-in method**에서 Google 공급자를 활성화합니다. 기존 OpenAI workspace의 ChatGPT 로그인 헤더도 계속 지원되므로 해당 환경에서는 Firebase Auth가 없어도 기존 계정을 사용할 수 있습니다.
4. Firebase CLI로 로그인한 로컬 환경에서 대상 프로젝트를 선택한 뒤 규칙과 인덱스를 배포합니다.

```bash
npx firebase-tools login
npx firebase-tools use --add
npx firebase-tools deploy --only firestore:rules,firestore:indexes
```

5. **프로젝트 설정 → 서비스 계정**에서 Admin SDK 서비스 계정을 준비합니다. JSON 파일 자체는 저장하거나 Vercel에 업로드하지 말고, 필요한 세 필드만 Vercel의 암호화된 환경변수에 각각 입력합니다.
6. `.env.example`을 `.env.local`로 복사하여 로컬 값을 채웁니다. `.env.local`, 서비스 계정 JSON 및 실제 비밀 키는 커밋하지 않습니다.

## 환경변수

브라우저용 Firebase 웹 앱 설정:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

서버 전용 Firebase Admin 설정:

- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY` — PEM 줄바꿈을 문자 `\\n`으로 치환

`NEXT_PUBLIC_` 변수는 Firebase 앱 식별 설정이며 보안 권한을 부여하지 않습니다. Admin 변수에는 절대로 `NEXT_PUBLIC_` 접두사를 붙이지 마세요.

## Vercel 배포

1. 이 저장소를 GitHub에 push합니다.
2. Vercel에서 **Add New → Project**로 GitHub 저장소를 연결합니다.
3. Framework Preset이 **Next.js**인지 확인합니다. 별도 `vercel.json`은 필요하지 않습니다.
4. Vercel 프로젝트의 **Settings → Environment Variables**에 `.env.example`의 변수 7개를 Production/Preview/Development 필요 범위별로 입력합니다.
5. Firebase Authentication의 **Authorized domains**에 Vercel 프로덕션 도메인과 사용하는 Preview 도메인을 추가합니다.
6. 배포 후 Google 로그인, 연습 결과 저장, 보스 해금, 재로그인 복원, 도감 및 TOP 10 순위표를 확인합니다.

## 계정 호환성

Vercel에서는 Firebase Google 로그인을 사용합니다. OpenAI workspace에서 주입되는 기존 `oai-authenticated-user-*` 헤더도 서버에서 계속 인식하며 기존 로그인·로그아웃 경로를 유지합니다. 두 공급자의 식별자는 명시적으로 네임스페이스를 분리하여 서로의 문서를 덮어쓸 수 없습니다.
