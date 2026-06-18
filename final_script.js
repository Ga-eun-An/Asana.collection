let selectedAsanas = [];


// 1. 설정 정보
const API_KEY = 'AIzaSyAPo0Fx7ARmFbokIU2z6m8ieTanAGWwTzs'; 
const SHEET_ID = '1GsZaIB1Cwbbmh3ReuU5Ox_RV0P7wv8TeCR-B9M_CzZE';
const RANGE = 'Asana collection!A3:M263'; 

const listContainer = document.getElementById('asana-list');
const cursor = document.getElementById('custom-cursor');
const infoImage = document.getElementById('info-image'); 

// 2. 구글 시트에서 데이터 가져오기
async function fetchSheetData() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;
    
    try {
        const response = await fetch(url);
        const result = await response.json();
        const rows = result.values; 

        if (rows && rows.length > 0) {
            renderAsanas(rows);
        } else {
            console.error("데이터를 찾을 수 없습니다. 시트 이름이나 범위를 확인하세요.");
        }
    } catch (error) {
        console.error("데이터 호출 실패:", error);
    }
}

// 3. 화면에 리스트와 정보 그리기
function renderAsanas(rows) {
    listContainer.innerHTML = ''; 

    // 헤더(1행) 제외하고 데이터 시작
    const realData = rows;

    realData.forEach((row) => {
        const data = {

    sanskrit:      row[1] || '',
    pronunciation: row[2] || '',
    koreanName:    row[3] || '',
    category:      row[4] || '',
    origin:        row[5] || '',
    type:          row[6] || '',
    mechanic:      row[7] || '',
    level:         row[8] || '',
    story:         row[9] || '',
    image:         row[10] || '',

    printImageL:   row[11] || '',
    printImageM:   row[12] || ''

};

        if (!data.sanskrit) return; 

        const item = document.createElement('div');
        item.className = 'asana-item';
        item.innerText = data.sanskrit; 

     // [마우스 엔터] 목록 활성화 및 이미지 표시
        item.addEventListener('mouseenter', () => {
            document.querySelectorAll('.asana-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            if (data.image && data.image.includes('http')) {
                infoImage.src = data.image;
                infoImage.style.display = 'block'; // 사진 보이기
            }
        });

        // [마우스 리브] 마우스가 나가면 사진 숨기기 (피그마처럼 깔끔하게)
        item.addEventListener('mouseleave', () => {
            infoImage.style.display = 'none'; 
        });

        // [클릭] 오른쪽 섹션 업데이트
        item.addEventListener('click', () => {

  const exists = selectedAsanas.some(
    item => item.sanskrit === data.sanskrit
);

if (!exists) {

    selectedAsanas.push(data);

    console.log(
        data.sanskrit + " 선택됨"
    );

}

console.log(selectedAsanas);

    const infoBox = document.querySelector('.info-box');
            const infoStory = document.getElementById('info-story'); // HTML에 이 ID를 가진 요소가 있어야 합니다.

            const rowsArray = [
                { label: "산스크리트어", value: data.sanskrit },
                { label: "발음", value: data.pronunciation },
                { label: "아사나 명칭", value: data.koreanName },
                { label: "Origin Category", value: data.category },
                { label: "카테고리", value: data.category },
                { label: "언어기원", value: data.origin },
                { label: "자세분류", value: data.type },
                { label: "역학적분류", value: data.mechanic },
                { label: "난이도", value: data.level }
            ];

            const rowsHtml = rowsArray
                .filter(r => r.value && r.value.toString().trim() !== "") 
                .map(r => `<p><strong>${r.label}</strong> <span>${r.value}</span></p>`)
                .join("");

            if (infoBox) {
                // 상단 그리드 정보 주입
                infoBox.innerHTML = rowsHtml;
                
                // [추가] 스토리(J열) 데이터가 있다면 infoBox 아래에 1단으로 추가
                if (data.story && data.story.trim() !== "") {
                    infoBox.innerHTML += `<div class="story-text">${data.story}</div>`;
                }
            }

            // 이미지 업데이트
            if (data.image && data.image.includes('http')) {
                infoImage.src = data.image;
                infoImage.style.display = 'block';
            } else {
                infoImage.style.display = 'none';
            }

        });

        listContainer.appendChild(item);
    });
}

// 4. 배경 색상 보간
function interpolateColor(color1, color2, factor) {
    const r1 = parseInt(color1.substring(1, 3), 16);
    const g1 = parseInt(color1.substring(3, 5), 16);
    const b1 = parseInt(color1.substring(5, 7), 16);

    const r2 = parseInt(color2.substring(1, 3), 16);
    const g2 = parseInt(color2.substring(3, 5), 16);
    const b2 = parseInt(color2.substring(5, 7), 16);

    const r = Math.round(r1 + factor * (r2 - r1));
    const g = Math.round(g1 + factor * (g2 - g1));
    const b = Math.round(b1 + factor * (b2 - b1));

    return `rgb(${r}, ${g}, ${b})`;
}

// 스크롤 인터랙션
window.addEventListener('DOMContentLoaded', () => {
    const listSection = document.getElementById('asana-list');
    if (listSection) {
        listSection.addEventListener('scroll', () => {
            const scrollHeight = listSection.scrollHeight - listSection.clientHeight;
            const scrollTop = listSection.scrollTop;
            const scrollPercent = scrollHeight > 0 ? scrollTop / scrollHeight : 0;

            const startColor = "#D9FFFA";
            const endColor = "#78FFED";

            const currentColor = interpolateColor(startColor, endColor, scrollPercent);
            document.body.style.setProperty('--bg-color', currentColor);
        });
    }
});

// 5. 커스텀 커서 움직임
window.addEventListener('mousemove', (e) => {
    if (cursor) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    }
});

// 실행
fetchSheetData();


   document
.getElementById("pdf-btn")
.addEventListener("click", () => {

    if (selectedAsanas.length === 0) {

        alert(
            "아사나를 먼저 선택해주세요."
        );

        return;
    }

    createPrintPages();

});

 

function createPrintPages() {

    // 기존 인쇄 레이어 삭제
    const oldLayer =
    document.getElementById("print-layer");

    if (oldLayer) {

        oldLayer.remove();

    }

    // 새 인쇄 레이어 생성
    const printLayer =
    document.createElement("div");

 printLayer.id =
"print-container";

    document.body.appendChild(
        printLayer
    );

printLayer.innerHTML += `
    <div class="print-page">
        <img src="cover.jpg">
    </div>
`;

    // 선택된 아사나 페이지 추가
   selectedAsanas.forEach((asana, index) => {

    // 첫 번째 선택된 아사나
    if (index === 0) {

        if (asana.printImageM) {

            printLayer.innerHTML += `
                <div class="print-page">
                    <img src="${asana.printImageM}">
                </div>
            `;
        }

    }

    // 두 번째 이후
    else {

        if (asana.printImageL) {

            printLayer.innerHTML += `
                <div class="print-page">
                    <img src="${asana.printImageL}">
                </div>
            `;
        }

        if (asana.printImageM) {

            printLayer.innerHTML += `
                <div class="print-page">
                    <img src="${asana.printImageM}">
                </div>
            `;
        }
    }

});

    // 컬렉션 3장 추가
    printLayer.innerHTML += `

        <div class="print-page">
            <img src="collection-1.jpg">
        </div>

        <div class="print-page">
            <img src="collection-2.jpg">
        </div>

        <div class="print-page">
            <img src="collection-3.jpg">
        </div>


    `;

    // 이미지 로딩 기다렸다가 인쇄
    setTimeout(() => {

        window.print();

    }, 500);

}