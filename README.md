# 김명수 포트폴리오 사이트

바이브 코딩으로 만든 웹앱을 전시하는 정적 사이트입니다. (HTML·CSS·JavaScript만 사용)

| 파일 | 역할 | 직접 고칠 일 |
|---|---|---|
| `projects.json` | 프로젝트 목록, 연락처 주소 | ★ 자주 |
| `images/` | 스크린샷 | 가끔 |
| `index.html` | 소개·강의 주제 문구 | 가끔 |
| `style.css` | 디자인 (맨 위 `--primary` 값으로 대표 색 변경) | 거의 없음 |
| `script.js` | 카드 자동 생성 | 거의 없음 |

---

## ① 내 컴퓨터에서 미리 보기

`index.html`을 더블클릭하면 **프로젝트 카드가 나오지 않습니다.** 브라우저가 보안 때문에 내 컴퓨터의 `projects.json`을 바로 읽지 못하게 막기 때문입니다. 아래 방법 중 하나로 여세요.

**방법 A — 명령어 한 줄 (Node.js가 설치되어 있으면)**
1. 탐색기에서 `포트폴리오` 폴더를 연 뒤, 주소창에 `cmd` 입력 후 Enter
2. 검은 창에 입력: `npx serve -l 5500`
3. 브라우저에서 http://localhost:5500 접속
4. 끝낼 때는 검은 창에서 `Ctrl + C`

**방법 B — VS Code를 쓴다면**
확장 프로그램 "Live Server" 설치 → `index.html` 오른쪽 클릭 → "Open with Live Server"

**휴대폰 화면으로 보기:** 크롬에서 `F12` → 왼쪽 위 휴대폰 모양 아이콘(`Ctrl + Shift + M`) 클릭

---

## ② 새 프로젝트 추가하기

1. 스크린샷을 `images` 폴더에 넣습니다. (가로로 긴 16:9 화면 캡처 권장, 파일 이름은 영어로. 예: `quiz-app.png`)
2. `projects.json`을 열고, `"projects": [` 목록 안 **마지막 항목의 `}` 뒤에 쉼표(,)** 를 찍은 다음 아래 묶음을 붙여 넣습니다.

```json
    {
      "title": "앱 이름",
      "summary": "한 줄 설명",
      "audience": "교사용",
      "tags": ["HTML", "JavaScript"],
      "image": "images/quiz-app.png",
      "link": "https://내앱주소.vercel.app",
      "indischool": "",
      "reason": "만든 이유",
      "features": ["기능 1", "기능 2", "기능 3"],
      "privacy": "개인정보 처리 방식"
    }
```

- `audience`는 **교사용 / 학급용 / 개인용** 중 하나를 정확히 적어야 필터가 작동합니다.
- `indischool`을 `""`(빈칸)으로 두면 [인디스쿨 게시글] 버튼이 숨겨집니다.
- `link`가 `https://`로 시작하지 않으면 버튼이 "링크 준비 중"으로 보입니다.
- 스크린샷이 없거나 파일 이름이 틀리면 "스크린샷 준비 중" 임시 그림이 나옵니다.
- 카드 순서 = 목록 순서입니다. 대표작을 맨 위에 두세요.

**자주 하는 실수:** 항목 사이 쉼표 빠뜨림, 마지막 항목 뒤에 쉼표 남김, 따옴표를 `“ ”`(둥근 따옴표)로 입력.
저장 후 화면에 "프로젝트 목록을 불러오지 못했습니다"가 뜨면 대부분 이 문제입니다. https://jsonlint.com 에 내용을 붙여 넣으면 틀린 줄을 알려 줍니다.

### 연락처 주소 바꾸기
`projects.json` 맨 위 `contact` 부분의 `○○`를 바꾸면 됩니다.
- `kakao`: 오픈채팅 주소 (`https://open.kakao.com/o/...`)
- `email`: 이메일 주소. 공개하고 싶지 않으면 `""`로 두면 버튼이 사라집니다.

---

## ③ GitHub + Vercel로 배포하기

### 1단계. GitHub에 올리기 (명령어 없이 웹에서)
1. https://github.com 가입·로그인
2. 오른쪽 위 `+` → **New repository**
3. Repository name: `portfolio` (영어), **Public** 선택 → **Create repository**
4. 만들어진 페이지에서 **uploading an existing file** 링크 클릭
5. `포트폴리오` 폴더 안의 **내용물**(index.html, style.css, script.js, projects.json, images 폴더, README.md)을 끌어다 놓기
   - 폴더 자체가 아니라 안의 파일들을 올려야 합니다. `.claude` 폴더는 올리지 않아도 됩니다.
6. 아래 **Commit changes** 클릭

### 2단계. Vercel로 배포
1. https://vercel.com → **Sign Up** → **Continue with GitHub** (GitHub 계정으로 가입)
2. 대시보드에서 **Add New… → Project**
3. 방금 만든 `portfolio` 저장소 옆 **Import**
4. 설정은 건드리지 말고 (Framework Preset: **Other**) **Deploy** 클릭
5. 1분 정도 뒤 `https://portfolio-xxxx.vercel.app` 같은 주소가 생깁니다. 이 주소를 전문가풀·인디스쿨 프로필에 적으면 됩니다.

### 3단계. 이후 수정할 때
GitHub 저장소에서 파일을 고치거나(파일 클릭 → 연필 아이콘 → Commit changes) 새 파일을 올리면, **Vercel이 1분 안에 자동으로 사이트를 다시 만듭니다.** 따로 배포 버튼을 누를 필요가 없습니다.

### (선택) 주소 바꾸기
Vercel 프로젝트 → **Settings → Domains** 에서 `kimmyungsu.vercel.app`처럼 비어 있는 이름으로 바꿀 수 있습니다.
