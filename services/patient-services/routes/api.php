<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PasienController;

Route::apiResource('pasien', PasienController::class);