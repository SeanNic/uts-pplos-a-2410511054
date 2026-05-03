<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PasienController;
use App\Http\Controllers\Api\DokterController;
use App\Http\Controllers\Api\JadwalDokterController;
use App\Http\Controllers\Api\JanjiTemuController;

Route::apiResource('pasien', PasienController::class);
Route::apiResource('dokter', DokterController::class);
Route::apiResource('jadwal-dokter', JadwalDokterController::class);
Route::apiResource('janji-temu', JanjiTemuController::class);