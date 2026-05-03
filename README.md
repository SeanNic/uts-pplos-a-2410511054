# uts-pplos-A-2410511054

## Identitas

Nama: Sean Nicholas  
NIM: 2410511054  
Kelas: A  
Mata Kuliah: Pembangunan Perangkat Lunak Berorientasi Service  

## Studi Kasus

Sistem Reservasi Klinik / Manajemen Pasien

Sistem ini dibangun menggunakan arsitektur microservices dengan minimal 3 service dan 1 API Gateway sebagai single entry point.

## Service

| Service | Teknologi | Port | Fungsi |
|---|---|---:|---|
| Auth-Service | Node.js Express | 3001 | Register, login JWT, refresh token, logout, Google OAuth |
| Patient-Service | Laravel PHP MVC | 8000 | Pasien, dokter, jadwal dokter, janji temu |
| Medical-Service | Node.js Express | 3003 | Rekam medis dan e-resep |
| API Gateway | Node.js Express | 4000 | Routing, JWT validation, rate limiting |

## Arsitektur Sistem

```txt
Client / Postman
        |
        v
API Gateway (4000)
- Routing
- JWT Validation
- Rate Limit 60 request/menit
        |
        |--------------------|--------------------|
        v                    v                    v
Auth-Service            Patient-Service       Medical-Service
Node.js :3001           Laravel :8000         Node.js :3003
        |                    |                    |
        v                    v                    v
auth_db              patient_db              medical data

## Service

| Service | Teknologi | Port | Fungsi |
|---|---|---:|---|
| Auth-Service | Node.js Express | 3001 | Register, login JWT, refresh token, logout, Google OAuth |
| Patient-Service | Laravel (PHP MVC) | 8000 | Pasien, dokter, jadwal dokter, janji temu |
| Medical-Service | Node.js Express | 3003 | Rekam medis dan e-resep |
| API Gateway | Node.js Express | 4000 | Routing, JWT validation, rate limiting |

---

## Tabel Routing API Gateway

| Path | Service Tujuan | Port | JWT |
|---|---|---:|---|
| /api/auth/* | Auth-Service | 3001 | Tidak |
| /api/auth/profile | Auth-Service | 3001 | Ya |
| /api/auth/logout | Auth-Service | 3001 | Ya |
| /api/patient/* | Patient-Service | 8000 | Ya |
| /api/medical/* | Medical-Service | 3003 | Ya |

---

## Endpoint Utama

### Auth

- POST `/api/auth/register`
- POST `/api/auth/login`
- POST `/api/auth/refresh`
- POST `/api/auth/logout`
- GET `/api/auth/profile`
- GET `/api/auth/google`

### Patient

- GET `/api/patient/pasien`
- POST `/api/patient/pasien`
- GET `/api/patient/dokter`
- POST `/api/patient/dokter`
- GET `/api/patient/jadwal-dokter`
- POST `/api/patient/jadwal-dokter`
- GET `/api/patient/janji-temu`
- POST `/api/patient/janji-temu`

### Medical

- GET `/api/medical/rekam-medis`
- POST `/api/medical/rekam-medis`

---

## Cara Menjalankan

### 1. Auth-Service

```bash
cd services/auth-services
npm install
node server.js

cd services/patient-services
composer install
php artisan serve

cd services/medical-record-services
npm install
node server.js

cd gateway
npm install
node server.js

akses: http://localhost:4000

Demo Video: https://youtu.be/79RMAyY2pD4