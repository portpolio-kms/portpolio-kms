// projects.json을 읽어서 프로젝트 카드와 연락처 버튼을 자동으로 만듭니다.
// 보통은 이 파일을 고칠 필요가 없습니다. 내용 수정은 projects.json에서 하세요.

const PLACEHOLDER_IMAGE = "images/placeholder.svg";

let allProjects = [];
let currentFilter = "전체";

const grid = document.getElementById("project-grid");
const emptyMessage = document.getElementById("empty-message");
const dialog = document.getElementById("project-dialog");
const dialogContent = document.getElementById("dialog-content");

// 글자 속 특수문자를 안전하게 바꿔 줍니다.
function escapeHtml(text) {
  return String(text ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// http:// 또는 https:// 로 시작하는 진짜 주소인지 확인합니다. (○○ 같은 빈칸은 false)
function isRealLink(url) {
  return typeof url === "string" && /^https?:\/\//.test(url.trim());
}

// 이미지 태그 (파일이 없으면 임시 이미지로 바뀜)
function imageHtml(project, className) {
  const src = project.image ? escapeHtml(project.image) : PLACEHOLDER_IMAGE;
  return `<img class="${className}" src="${src}" alt="${escapeHtml(project.title)} 화면" loading="lazy"
    onerror="this.onerror=null; this.src='${PLACEHOLDER_IMAGE}';">`;
}

function tagsHtml(tags) {
  if (!Array.isArray(tags) || tags.length === 0) return "";
  return `<ul class="tags">${tags.map((t) => `<li>${escapeHtml(t)}</li>`).join("")}</ul>`;
}

function audienceHtml(audience) {
  if (!audience) return "";
  return `<span class="audience audience-${escapeHtml(audience)}">${escapeHtml(audience)}</span>`;
}

// [바로 써보기] [인디스쿨 게시글] 버튼
function actionsHtml(project) {
  const tryButton = isRealLink(project.link)
    ? `<a class="btn btn-primary btn-sm" href="${escapeHtml(project.link)}" target="_blank" rel="noopener">바로 써보기</a>`
    : `<span class="btn btn-primary btn-sm is-disabled" aria-disabled="true">링크 준비 중</span>`;

  const indiButton = isRealLink(project.indischool)
    ? `<a class="btn btn-outline btn-sm" href="${escapeHtml(project.indischool)}" target="_blank" rel="noopener">인디스쿨 게시글</a>`
    : "";

  return `<div class="card-actions">${tryButton}${indiButton}</div>`;
}

// 카드 하나 만들기
function cardHtml(project, index) {
  return `
    <article class="card">
      <button type="button" class="card-open" data-index="${index}" aria-label="${escapeHtml(project.title)} 자세히 보기">
        ${imageHtml(project, "card-thumb")}
        <div class="card-body">
          ${audienceHtml(project.audience)}
          <h3 class="card-title">${escapeHtml(project.title)}</h3>
          <p class="card-summary">${escapeHtml(project.summary)}</p>
          <span class="card-more">자세히 보기 →</span>
        </div>
      </button>
      ${tagsHtml(project.tags)}
      ${actionsHtml(project)}
    </article>`;
}

// 필터에 맞는 카드만 그리기
function renderCards() {
  const visible = allProjects
    .map((project, index) => ({ project, index }))
    .filter(({ project }) => currentFilter === "전체" || project.audience === currentFilter);

  grid.innerHTML = visible.map(({ project, index }) => cardHtml(project, index)).join("");

  if (visible.length === 0) {
    emptyMessage.textContent = `${currentFilter} 프로젝트는 준비 중입니다.`;
    emptyMessage.hidden = false;
  } else {
    emptyMessage.hidden = true;
  }
}

// 상세 팝업 열기
function openDetail(index) {
  const p = allProjects[index];
  if (!p) return;

  const features = Array.isArray(p.features) && p.features.length
    ? `<h3>주요 기능</h3><ul class="dot-list">${p.features.map((f) => `<li>${escapeHtml(f)}</li>`).join("")}</ul>`
    : "";

  dialogContent.innerHTML = `
    ${imageHtml(p, "dialog-thumb")}
    <div class="dialog-body">
      ${audienceHtml(p.audience)}
      <h2 id="dialog-title">${escapeHtml(p.title)}</h2>
      <p>${escapeHtml(p.summary)}</p>
      ${tagsHtml(p.tags)}
      ${p.reason ? `<h3>만든 이유</h3><p>${escapeHtml(p.reason)}</p>` : ""}
      ${features}
      ${p.privacy ? `<h3>개인정보 처리 방식</h3><p class="privacy-box">${escapeHtml(p.privacy)}</p>` : ""}
    </div>
    ${actionsHtml(p)}`;

  dialog.showModal();
  dialog.scrollTop = 0;
}

// 연락처 버튼 설정
function setupContact(contact = {}) {
  const kakaoBtn = document.getElementById("kakao-btn");
  const emailBtn = document.getElementById("email-btn");

  if (isRealLink(contact.kakao)) {
    kakaoBtn.href = contact.kakao.trim();
  } else {
    kakaoBtn.removeAttribute("href");
    kakaoBtn.classList.add("is-disabled");
    kakaoBtn.textContent = "카카오톡 오픈채팅 (준비 중)";
  }

  const email = (contact.email || "").trim();
  if (email.includes("@")) {
    emailBtn.href = `mailto:${email}?subject=${encodeURIComponent("[강의 문의] ")}`;
    emailBtn.textContent = `이메일 보내기 (${email})`;
  } else {
    emailBtn.remove(); // 이메일을 적지 않으면 버튼을 숨깁니다.
  }
}

// ----- 이벤트 연결 -----
document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;
    document.querySelectorAll(".filter-btn").forEach((b) => b.classList.toggle("is-active", b === btn));
    renderCards();
  });
});

grid.addEventListener("click", (event) => {
  const opener = event.target.closest(".card-open");
  if (opener) openDetail(Number(opener.dataset.index));
});

dialog.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
// 팝업 바깥(어두운 부분)을 누르면 닫기
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

// ----- projects.json 불러오기 -----
fetch("projects.json", { cache: "no-cache" })
  .then((res) => {
    if (!res.ok) throw new Error(res.status);
    return res.json();
  })
  .then((data) => {
    allProjects = Array.isArray(data.projects) ? data.projects : [];
    setupContact(data.contact);
    renderCards();
  })
  .catch((err) => {
    console.error("projects.json을 불러오지 못했습니다.", err);
    emptyMessage.textContent =
      "프로젝트 목록을 불러오지 못했습니다. (내 컴퓨터에서 파일을 바로 열면 이렇게 보일 수 있어요. README의 '미리 보기' 방법을 참고하세요. projects.json의 쉼표·따옴표도 확인해 주세요.)";
    emptyMessage.hidden = false;
    setupContact({});
  });
