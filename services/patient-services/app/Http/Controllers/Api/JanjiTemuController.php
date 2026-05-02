<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JanjiTemu;
use Illuminate\Http\Request;

class JanjiTemuController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->get('per_page', 10);
        $status = $request->get('status');
        $pasienId = $request->get('pasien_id');

        $query = JanjiTemu::with(['pasien', 'dokter', 'jadwal']);

        if ($status) {
            $query->where('status', $status);
        }

        if ($pasienId) {
            $query->where('pasien_id', $pasienId);
        }

        return response()->json($query->paginate($perPage));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'pasien_id' => 'required|exists:pasien,id',
            'dokter_id' => 'required|exists:dokter,id',
            'jadwal_id' => 'required|exists:jadwal_dokter,id',
            'tanggal' => 'required|date',
            'keluhan' => 'nullable|string',
        ]);

        $janji = JanjiTemu::create([
            ...$validated,
            'status' => 'menunggu'
        ]);

        return response()->json([
            'message' => 'Janji temu berhasil dibuat',
            'data' => $janji
        ], 201);
    }

    public function show($id)
    {
        $janji = JanjiTemu::with(['pasien', 'dokter', 'jadwal'])->findOrFail($id);
        return response()->json($janji);
    }

    public function update(Request $request, $id)
    {
        $janji = JanjiTemu::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|in:menunggu,dikonfirmasi,dibatalkan,selesai'
        ]);

        $janji->update($validated);

        return response()->json([
            'message' => 'Status janji temu diperbarui',
            'data' => $janji
        ]);
    }

    public function destroy($id)
    {
        $janji = JanjiTemu::findOrFail($id);
        $janji->delete();

        return response()->json(null, 204);
    }
}