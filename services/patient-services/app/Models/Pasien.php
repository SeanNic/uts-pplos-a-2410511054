<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pasien extends Model
{
    protected $table = 'pasien';

    protected $fillable = [
        'user_id',
        'nik',
        'nama',
        'jenis_kelamin',
        'tanggal_lahir',
        'no_hp',
        'alamat',
    ];

    public function janjiTemu()
    {
        return $this->hasMany(JanjiTemu::class, 'pasien_id');
    }
}