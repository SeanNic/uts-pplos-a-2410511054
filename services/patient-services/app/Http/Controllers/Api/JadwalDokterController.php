<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JadwalDokter;
use Illuminate\Http\Request;

class JadwalDokterController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->get('per_page', 10);
        $hari = $request->get('hari');
        $dokterId = $request->get('dokter_id');

        $query = JadwalDokter::with('dokter');

        if ($hari) {
            $query->where('hari', $hari);
        }

        if ($dokterId) {
            $query->where('dokter_id', $dokterId);
        }

        return response()->json($query->paginate($perPage));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'dokter_id' => 'required|exists:dokter,id',
            'hari' => 'required|in:senin,selasa,rabu,kamis,jumat,sabtu,minggu',
            'jam_mulai' => 'required|date_format:H:i',
            'jam_selesai' => 'required|date_format:H:i|after:jam_mulai',
            'kuota' => 'nullable|integer|min:1',
        ]);

        $jadwal = JadwalDokter::create($validated);

        return response()->json([
            'message' => 'Jadwal dokter berhasil dibuat',
            'data' => $jadwal
        ], 201);
    }

    public function show($id)
    {
        $jadwal = JadwalDokter::with('dokter')->findOrFail($id);
        return response()->json($jadwal);
    }

    public function update(Request $request, $id)
    {
        $jadwal = JadwalDokter::findOrFail($id);

        $validated = $request->validate([
            'dokter_id' => 'sometimes|required|exists:dokter,id',
            'hari' => 'sometimes|required|in:senin,selasa,rabu,kamis,jumat,sabtu,minggu',
            'jam_mulai' => 'sometimes|required|date_format:H:i',
            'jam_selesai' => 'sometimes|required|date_format:H:i|after:jam_mulai',
            'kuota' => 'nullable|integer|min:1',
        ]);

        $jadwal->update($validated);

        return response()->json([
            'message' => 'Jadwal dokter berhasil diperbarui',
            'data' => $jadwal
        ]);
    }

    public function destroy($id)
    {
        $jadwal = JadwalDokter::findOrFail($id);
        $jadwal->delete();

        return response()->json(null, 204);
    }
}