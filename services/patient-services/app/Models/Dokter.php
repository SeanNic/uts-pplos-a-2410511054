<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Dokter extends Model
{
    protected $table = 'dokter';

    protected $fillable = [
        'nama',
        'spesialisasi',
        'no_hp',
        'aktif',
    ];

    public function jadwal()
    {
        return $this->hasMany(JadwalDokter::class, 'dokter_id');
    }

    public function janjiTemu()
    {
        return $this->hasMany(JanjiTemu::class, 'dokter_id');
    }
}