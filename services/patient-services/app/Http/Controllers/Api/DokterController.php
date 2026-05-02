<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Dokter;
use Illuminate\Http\Request;

class DokterController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->get('per_page', 10);
        $spesialisasi = $request->get('spesialisasi');

        $query = Dokter::query();

        if ($spesialisasi) {
            $query->where('spesialisasi', 'like', "%$spesialisasi%");
        }

        return response()->json($query->paginate($perPage));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:100',
            'spesialisasi' => 'required|string|max:100',
            'no_hp' => 'nullable|string|max:20',
            'aktif' => 'boolean',
        ]);

        $dokter = Dokter::create($validated);

        return response()->json([
            'message' => 'Data dokter berhasil dibuat',
            'data' => $dokter
        ], 201);
    }

    public function show($id)
    {
        return response()->json(Dokter::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $dokter = Dokter::findOrFail($id);

        $validated = $request->validate([
            'nama' => 'sometimes|required|string|max:100',
            'spesialisasi' => 'sometimes|required|string|max:100',
            'no_hp' => 'nullable|string|max:20',
            'aktif' => 'boolean',
        ]);

        $dokter->update($validated);

        return response()->json([
            'message' => 'Data dokter berhasil diperbarui',
            'data' => $dokter
        ]);
    }

    public function destroy($id)
    {
        $dokter = Dokter::findOrFail($id);
        $dokter->delete();

        return response()->json(null, 204);
    }
}