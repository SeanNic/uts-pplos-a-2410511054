<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PasienController;

Route::apiResource('pasien', PasienController::class);

use App\Http\Controllers\Api\DokterController;

Route::apiResource('dokter', DokterController::class);

use App\Http\Controllers\Api\JadwalDokterController;

Route::apiResource('jadwal-dokter', JadwalDokterController::class);

use App\Http\Controllers\Api\JanjiTemuController;

Route::apiResource('janji-temu', JanjiTemuController::class);