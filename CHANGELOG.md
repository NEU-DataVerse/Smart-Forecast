# Changelog

Tất cả các thay đổi đáng chú ý của dự án sẽ được ghi lại trong file này.

Định dạng dựa trên [Keep a Changelog](https://keepachangelog.com/vi/1.0.0/),
và dự án tuân thủ [Semantic Versioning](https://semver.org/lang/vi/).

---

## [1.0.0] - 2025-12-05

### Ra mat phien ban dau tien

Phien ban dau tien cua Smart Forecast - Nen tang giam sat va canh bao moi truong do thi thong minh.

---

## Giai doan 4: Hoan thien & Demo (01/12 - 05/12)

**Muc tieu:** "Dong bang" tinh nang, tap trung sua loi, dong goi san pham va chuan bi kich ban demo hoan chinh cho ngay 05/12.

### Kiem thu & Sua loi (Bug Fixing)

- [P4-BUG-01] Kiem thu Luong Xac thuc - Test dang nhap, dang ky, phan quyen Admin/Citizen, token het han
- [P4-BUG-02] Kiem thu Luong Du lieu (1 chieu) - Kiem tra du lieu AQI/Weather hien thi tren Web/Mobile co khop va cap nhat tu dong
- [P4-BUG-03] Kiem thu Luong Bao cao (Incident) - Gui bao cao (kem anh) tu Mobile, kiem tra anh tren MinIO va data trong DB
- [P4-BUG-04] Kiem thu Luong Duyet (Incident) - Duyet/tu choi su co tren Web, kiem tra app co cap nhat trang thai
- [P4-BUG-05] Kiem thu Luong Canh bao (Alert) - Gui canh bao tu Web, kiem tra Mobile nhan duoc Push Notification
- [P4-BUG-06] Sua loi Responsive (Web) - Kiem tra va sua loi vo giao dien Dashboard tren cac kich thuoc man hinh
- [P4-BUG-07] Sua loi UI/UX (Mobile) - Ra soat loi chinh ta, can chinh, font chu, trai nghiem nguoi dung

### Dong goi & Trien khai (Packaging)

- [P4-DEP-01] Hoan thien `docker-compose.yml` - Ra soat, don dep va toi uu file docker-compose
- [P4-DEP-02] Hoan thien file `.env.example` - Cung cap file `.env.example` day du cac bien moi truong
- [P4-DEP-03] Build Docker Image (Backend) - Toi uu `Dockerfile` cho backend Node.js (multi-stage build)
- [P4-DEP-04] Build file `.apk` (Mobile) - Build file `.apk` (Android) de cai dat demo truc tiep

### Hoan thien Tai lieu & Kich ban Demo

- [P4-DOC-01] Hoan thien Slide Thuyet trinh
- [P4-DOC-02] Hoan thien `README.md` - Cap nhat README.md, bo sung anh GIF demo, huong dan chay nhanh
- [P4-DOC-03] Viet Kich ban Demo (Script)
- [P4-DOC-04] Chuan bi Data Demo - Chuan bi du lieu "sach" cho buoi demo
- [P4-DOC-05] Chay thu (Rehearsal) lan 1
- [P4-DOC-06] Chay thu (Rehearsal) lan 2

---

## Giai doan 3: Tinh nang tuong tac (24/11 - 30/11)

**Muc tieu:** Hoan thanh luong du lieu hai chieu: Canh bao tu Admin (Web) va Bao cao su co tu Nguoi dan (Mobile).

### Hoan thien Module Bao cao Su co (Incident)

- [P3-INC-01] [Backend] Phat trien Module `file` - Tao API `POST /api/v1/file/upload` de nhan anh, tai len MinIO va tra ve URL
- [P3-INC-02] [Backend] Phat trien API `incident` - Tao API `POST /api/v1/incident` de nhan bao cao va luu vao PostgreSQL
- [P3-INC-03] [Mobile] Tich hop Upload Anh - Cho phep nguoi dung chup anh upload len server, nhan ve URL
- [P3-INC-04] [Mobile] Tich hop Gui Bao cao - Tong hop (text, GPS, URLs anh) va gui bao cao su co
- [P3-INC-05] [Backend] API cho Admin (Web) - Tao API `GET /api/v1/incident` va `PUT /api/v1/incident/:id/status`
- [P3-INC-06] [Web] Xay dung UI Quan ly Su co - Tao trang "Quan ly su co" tren Dashboard
- [P3-INC-07] [Web] Tich hop Duyet Su co - Cho phep Admin xem chi tiet, xem anh, va duyet/tu choi

### Phat trien Module Canh bao Khan (Alert)

- [P3-ALT-01] [Backend] Cau hinh Firebase Admin - Cai dat Firebase Admin SDK va ket noi voi du an Firebase
- [P3-ALT-02] [Backend] API Luu FcmToken - Tao API `POST /api/v1/user/fcm-token` de luu FcmToken cua thiet bi
- [P3-ALT-03] [Mobile] Tich hop Firebase SDK - Cai dat SDK Firebase (FCM), xu ly lay FcmToken
- [P3-ALT-04] [Mobile] Xu ly Nhan Thong bao - Thiet lap listener de nhan va hien thi push notification
- [P3-ALT-05] [Backend] API Gui Canh bao - Tao API `POST /api/v1/alert` de gui thong bao qua FCM
- [P3-ALT-06] [Web] Xay dung UI Gui Canh bao - Tao trang "Gui canh bao" tren Dashboard
- [P3-ALT-07] [Web] Tich hop API Gui Canh bao - Tich hop API vao nut "Gui"

### Xay dung Trang Thong ke (Web)

- [P3-ANA-01] [Backend] Phat trien API Thong ke - Tao cac API `GET /api/v1/analysis/...`
- [P3-ANA-02] [Web] Xay dung UI Trang Thong ke - Tao trang "Analysis / Thong ke" tren Dashboard
- [P3-ANA-03] [Web] Tich hop Bieu do (Incident) - Goi API, dung Chart.js ve bieu do thong ke cac loai su co

### Hoan thien Tai lieu (P3)

- [P3-DOC-01] Cap nhat tai lieu API - Bo sung tai lieu cho cac API module `incident`, `alert`, `file`, `analysis`
- [P3-DOC-02] Bat dau Slide Thuyet trinh
- [P3-DOC-03] Viet Huong dan su dung (User Guide)

---

## Giai doan 2: Luong du lieu chinh (17/11 - 23/11)

**Muc tieu:** Hoan thanh luong du lieu mot chieu: tu API ben ngoai -> Context Broker -> Hien thi len Web/Mobile.

### Phat trien Module Thu thap Du lieu (Ingestion)

- [P2-ING-01] [Backend] Phat trien service goi OWM - Tao logic goi API OWM de lay du lieu chat luong khong khi (AQI)
- [P2-ING-02] [Backend] Phat trien service goi OpenWeatherMap - Tao logic goi API OWM de lay du lieu thoi tiet
- [P2-ING-03] [Backend] Chuan hoa NGSI-LD (AirQuality) - Viet ham chuyen doi du lieu JSON sang `AirQualityObserved`
- [P2-ING-04] [Backend] Chuan hoa NGSI-LD (Weather) - Viet ham chuyen doi du lieu JSON sang `WeatherObserved`
- [P2-ING-05] [Backend] Day du lieu vao Orion-LD - Tao service tuong tac voi Orion-LD
- [P2-ING-06] [Backend] Cau hinh Cron Job - Thiet lap tac vu lap lai (moi 30 phut) de tu dong chay luong ingestion

### Cau hinh Dong bo Du lieu Lich su (Native Persistence)

- [P2-PER-01] [Backend] Tao PersistenceModule - Tao module NestJS xu ly NGSI-LD notifications tu Orion-LD
- [P2-PER-02] [Backend] Implement Notification Endpoint - Tao endpoint `POST /api/v1/notify`
- [P2-PER-03] [Backend] Parser NGSI-LD Normalized Format - Viet service parse NGSI-LD normalized format
- [P2-PER-04] [Backend] Tao Time-Series Entities - Tao TypeORM entities cho `AirQualityObserved` va `WeatherObserved`
- [P2-PER-05] [Backend] Tao Subscription Service - Implement service tu dong tao subscriptions trong Orion-LD
- [P2-PER-06] Kiem thu - Xac thuc luong du lieu, kiem tra PostgreSQL de dam bao du lieu lich su duoc luu

### Xay dung API Doc Du lieu Moi truong

- [P2-API-01] [Backend] API Lay du lieu Real-time - Tao `GET /api/v1/airquality/now` va `.../weather/now`
- [P2-API-02] [Backend] API Lay du lieu Lich su (Chart) - Tao `GET /api/v1/airquality/history` va `.../weather/history`
- [P2-API-03] [Backend] API Lay danh sach Tram quan trac - Tao `GET /api/v1/stations`

### Phat trien Dashboard Hien thi Du lieu (Web)

- [P2-WEB-01] [Web] Tich hop API (Dashboard) - Goi cac API de lay va hien thi du lieu AQI, thoi tiet len cac widget
- [P2-WEB-02] [Web] Tich hop Ban do (Map) - Cai dat Mapbox (hoac Leaflet), hien thi vi tri cac tram quan trac
- [P2-WEB-03] [Web] Hien thi Marker (Ban do) - Khi nhan vao Marker, hien thi popup voi thong tin AQI/thoi tiet moi nhat
- [P2-WEB-04] [Web] Tich hop Bieu do (Chart) - Dung Chart.js de ve bieu do lich su AQI

### Phat trien Man hinh chinh (Mobile)

- [P2-MOB-01] [Mobile] Tich hop API (Home) - Goi API de lay va hien thi chi so AQI/thoi tiet dua tren vi tri GPS
- [P2-MOB-02] [Mobile] Hoan thien UI/UX Bao cao Su co - Hoan thien giao dien Form Gui bao cao
- [P2-MOB-03] [Mobile] Tich hop Quyen (Permission) - Xu ly viec xin quyen truy cap Vi tri (GPS) va Camera/Thu vien anh

### Cap nhat Tai lieu (P2)

- [P2-DOC-01] Viet tai lieu API - Su dung Postman/Swagger de mo ta cac API da hoan thanh
- [P2-DOC-02] Hoan thien So do Kien truc - Cap nhat so do the hien luong Native Persistence -> PostgreSQL

---

## Giai doan 1: Nen tang & Cau hinh (10/11 - 16/11)

**Muc tieu:** Thiet lap toan bo moi truong phat trien, "bo khung" (boilerplate) cua cac du an va dich vu xac thuc co ban.

### Thiet lap Moi truong & Ha tang DevOps

- [P1-DEV-01] Khoi tao Monorepo - Tao repository, cau hinh NPM Workspace voi 4 package: `backend`, `web`, `mobile`, `shared`
- [P1-DEV-02] Cau hinh Docker Compose (Core) - Viet file `docker-compose.yml` khoi chay Orion-LD Context Broker va MongoDB
- [P1-DEV-03] Cau hinh Docker Compose (Storage) - Them PostgreSQL va MinIO vao `docker-compose.yml`
- [P1-DEV-04] Thiet lap CI/CD co ban - Cau hinh GitHub Actions de chay linting/build khi push code
- [P1-DEV-05] Khoi tao package `shared` - Dinh nghia cac `interface` va `constants` dung chung

### Xay dung Module Xac thuc (Auth)

- [P1-AUTH-01] [Backend] Thiet ke DB (User) - Tao bang `User` trong PostgreSQL luu thong tin (email, password hash, role)
- [P1-AUTH-02] [Backend] Implement API `auth/register` - Tao API `POST /api/v1/auth/register` cho Citizen dang ky
- [P1-AUTH-03] [Backend] Implement API `auth/login` - Tao API `POST /api/v1/auth/login` (dung JWT)
- [P1-AUTH-04] [Backend] Implement JWT Guard & API `auth/me` - Tao Guard de bao ve cac API khac
- [P1-AUTH-05] [Web] Tich hop API Login - Tich hop API `login` vao UI trang Login
- [P1-AUTH-06] [Mobile] Tich hop API Login/Register - Tich hop API `login` va `register`

### Khoi tao "Bo khung" Backend (Node.js)

- [P1-BE-01] Khoi tao du an Node.js - Cai dat NestJS trong package `backend/`
- [P1-BE-02] Cau hinh co so du lieu - Thiet lap ket noi den PostgreSQL va Orion-LD
- [P1-BE-03] Cau truc Module - Tao cau truc thu muc cho cac module chinh
- [P1-BE-04] Cau hinh Environment - Thiet lap file `.env` va config service

### Khoi tao "Bo khung" Web Dashboard (Next.js)

- [P1-WEB-01] Khoi tao du an Next.js - Cai dat Next.js + Tailwind CSS trong package `web/`
- [P1-WEB-02] Dung Layout chinh - Tao `Layout` chung cho trang Dashboard (Sidebar, Header, Content)
- [P1-WEB-03] Dung UI trang Login - Hoan thien giao dien trang Dang nhap
- [P1-WEB-04] Cau hinh Routing - Thiet lap cac route co ban (`/login`, `/`, `/incidents`, `/alerts`)

### Khoi tao "Bo khung" Mobile App (Expo)

- [P1-MOB-01] Khoi tao du an Expo - Cai dat Expo (React Native) trong package `mobile/`
- [P1-MOB-02] Cau hinh Navigation - Cai dat React Navigation, thiet lap luong Auth va App
- [P1-MOB-03] Dung UI (Mockup) man hinh chinh - Thiet ke giao dien cho man hinh Login, Trang chu, Gui bao cao

### Khoi tao Tai lieu Du an

- [P1-DOC-01] Viet `README.md` chinh - Cap nhat file `README.md` o thu muc goc
- [P1-DOC-02] Viet tai lieu Huong dan cai dat - Viet trong `docs/SETUP.md`
- [P1-DOC-03] Viet tai lieu Kien truc - Viet trong `docs/ARCHITECTURE.md`

---

## Quy uoc phien ban

- **MAJOR** (X.0.0): Thay doi khong tuong thich nguoc
- **MINOR** (0.X.0): Tinh nang moi, tuong thich nguoc
- **PATCH** (0.0.X): Sua loi, tuong thich nguoc

---

## Links

- [1.0.0]: https://github.com/NEU-DataVerse/Smart-Forecast/releases/tag/v1.0.0
