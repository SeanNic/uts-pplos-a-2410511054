<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JanjiTemu extends Model
{
    protected $table = 'janji_temu';

    protected $fillable = [
        'pasien_id',
        'dokter_id',
        'jadwal_id',
        'tanggal',
        'keluhan',
        'status',
    ];

    public function pasien()
    {
        return $this->belongsTo(Pasien::class, 'pasien_id');
    }

    public function dokter()
    {
        return $this->belongsTo(Dokter::class, 'dokter_id');
    }

    public function jadwal()
    {
        return $this->belongsTo(JadwalDokter::class, 'jadwal_id');
    }
}