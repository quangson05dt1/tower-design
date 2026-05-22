// ===========================
//  DICTIONARY FOR 3 LANGUAGES
// ===========================

const translations = {
  vi: {
    title: "Thiết kế vị trí cột và anten",
    header: "Thiết kế vị trí cột và anten",

    tab1: "Thiết kế móng cột",
    tab2: "Thiết kế anten",

    lat: "Tọa độ tâm cột (Vĩ độ):",
    lng: "Tọa độ tâm cột (Kinh độ):",

    towerType: "Loại cột:",
    guyed: "Dây co",
    self: "Tự đứng",

    gateAzimuth: "Hướng cửa trạm (góc Azimuth):",
    fence: "Kích thước hàng rào (rộng x dài) (m):",
    anchors: "Số móng co:",
    anchorsHint: "Dây co: 3, 4 | Tự đứng: 0",

    height: "Độ cao cột (m):",

    drawMap1: "Vẽ bản đồ",
    drawMap2: "Vẽ bản đồ",

    antenCount: "Số lượng anten:",
    addAnten: "Thêm anten",

    // Station/checklist (mới)
    stationCode: "Mã trạm:",
    stationCodePh: "Nhập mã trạm...",
    checklistTitle: "Checklist nghiệm thu",
    clArea: "Diện tích đất:",
    clTerrain: "Địa hình:",
    clPower: "Nguồn điện:",
    clSafety: "An toàn:",
    yesOk: "Đảm bảo",
    noOk: "Không đảm bảo",
    yesPower: "Có điện",
    noPower: "Không có",
    yesTerrain: "Bị trũng",
    noTerrain: "Không trũng",
    notePh: "Ghi chú...",
    applyBtn: "Apply & Cập nhật trạm",
    gpsBtn: "GPS",
    mapPickBtn: "Bản đồ",
    gpsTitle: "Lấy GPS hiện tại",
    mapPickTitle: "Chọn trên bản đồ",

    // Login
    loginSub: "Hệ thống thiết kế vị trí cột và anten",
    loginUserPh: "Tên đăng nhập",
    loginPassPh: "Mật khẩu",
    loginBtn: "Đăng nhập",
    logoutBtn: "Đăng xuất",
    greeting: "Xin chào",
    loginFooter: "Chỉ dành cho nội bộ",

    // Dynamic strings (dùng từ script.js qua hàm t())
    stNotFound: "Mã trạm không tồn tại trong danh sách",
    stDesign: "Thiết kế",
    stMaxDev: "Sai lệch cho phép",
    stDistOK: "Đạt",
    stDistFail: "Không đảm bảo",
    stDistance: "Khoảng cách",
  },

  en: {
    title: "Tower and Antenna Design",
    header: "Tower and Antenna Design",

    tab1: "Tower Foundation Design",
    tab2: "Antenna Design",

    lat: "Tower center latitude:",
    lng: "Tower center longitude:",

    towerType: "Tower type:",
    guyed: "Guyed tower",
    self: "Self-supporting tower",

    gateAzimuth: "Site gate azimuth (degrees):",
    fence: "Fence size (width x length) (m):",
    anchors: "Number of anchor blocks:",
    anchorsHint: "Guyed: 3, 4 | Self-support: 0",

    height: "Tower height (m):",

    drawMap1: "Draw map",
    drawMap2: "Draw map",

    antenCount: "Number of antennas:",
    addAnten: "Add antenna",

    stationCode: "Station code:",
    stationCodePh: "Enter station code...",
    checklistTitle: "Acceptance checklist",
    clArea: "Land area:",
    clTerrain: "Terrain:",
    clPower: "Power supply:",
    clSafety: "Safety:",
    yesOk: "OK",
    noOk: "Not OK",
    yesPower: "Available",
    noPower: "Unavailable",
    yesTerrain: "Low-lying",
    noTerrain: "OK",
    notePh: "Note...",
    applyBtn: "Apply & Update station",
    gpsBtn: "GPS",
    mapPickBtn: "Pick",
    gpsTitle: "Get current GPS",
    mapPickTitle: "Pick on map",

    loginSub: "Tower & antenna positioning system",
    loginUserPh: "Username",
    loginPassPh: "Password",
    loginBtn: "Login",
    logoutBtn: "Logout",
    greeting: "Hello",
    loginFooter: "Internal use only",

    stNotFound: "Station code not found",
    stDesign: "Design",
    stMaxDev: "Max deviation",
    stDistOK: "OK",
    stDistFail: "Out of tolerance",
    stDistance: "Distance",
  },

  pt: {
    title: "Design da torre e antena",
    header: "Design da torre e antena",

    tab1: "Design das fundações da torre",
    tab2: "Design da antena",

    lat: "Latitude do centro da torre:",
    lng: "Longitude do centro da torre:",

    towerType: "Tipo de torre:",
    guyed: "Torre estaiada",
    self: "Torre autoportante",

    gateAzimuth: "Azimute do portão do site (graus):",
    fence: "Tamanho da cerca (largura x comprimento) (m):",
    anchors: "Número de fundações:",
    anchorsHint: "Estaiada: 3, 4 | Autoportante: 0",

    height: "Altura da torre (m):",

    drawMap1: "Desenhar mapa",
    drawMap2: "Desenhar mapa",

    antenCount: "Número de antenas:",
    addAnten: "Adicionar antena",

    stationCode: "Código da estação:",
    stationCodePh: "Digite o código...",
    checklistTitle: "Checklist de aceitação",
    clArea: "Área do terreno:",
    clTerrain: "Terreno:",
    clPower: "Fonte de energia:",
    clSafety: "Segurança:",
    yesOk: "OK",
    noOk: "Não OK",
    yesPower: "Disponível",
    noPower: "Indisponível",
    yesTerrain: "Baixo",
    noTerrain: "OK",
    notePh: "Observação...",
    applyBtn: "Aplicar e atualizar",
    gpsBtn: "GPS",
    mapPickBtn: "Mapa",
    gpsTitle: "Obter GPS atual",
    mapPickTitle: "Escolher no mapa",

    loginSub: "Sistema de posicionamento de torres",
    loginUserPh: "Usuário",
    loginPassPh: "Senha",
    loginBtn: "Entrar",
    logoutBtn: "Sair",
    greeting: "Olá",
    loginFooter: "Uso interno",

    stNotFound: "Código de estação não encontrado",
    stDesign: "Projeto",
    stMaxDev: "Desvio máx.",
    stDistOK: "OK",
    stDistFail: "Fora da tolerância",
    stDistance: "Distância",
  },
};

// ===========================
// APPLY LANGUAGE
// ===========================
function changeLanguage() {
  const lang = document.getElementById("languageSelect").value;
  const dict = translations[lang] || translations.vi;

  // Text content (data-lang)
  document.querySelectorAll("[data-lang]").forEach((el) => {
    const key = el.getAttribute("data-lang");
    if (dict[key]) el.innerHTML = dict[key];
  });

  // Placeholder (data-lang-placeholder)
  document.querySelectorAll("[data-lang-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-lang-placeholder");
    if (dict[key]) el.setAttribute("placeholder", dict[key]);
  });

  // Title attribute (data-lang-title) — cho tooltip nút
  document.querySelectorAll("[data-lang-title]").forEach((el) => {
    const key = el.getAttribute("data-lang-title");
    if (dict[key]) el.setAttribute("title", dict[key]);
  });

  document.title = dict.title;
}

window.onload = function () {
  changeLanguage();
};
