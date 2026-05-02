<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pasien;
use Illuminate\Http\Request;

class PasienController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->get('per_page', 10);
        $search = $request->get('search');

        $query = Pasien::query();

        if ($search) {
            $query->where('nama', 'like', "%$search%")
                  ->orWhere('nik', 'like', "%$search%");
        }

        return response()->json($query->paginate($perPage));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nik' => 'required|unique:pasien,nik',
            'nama' => 'required|string|max:100',
            'jenis_kelamin' => 'required|in:laki-laki,perempuan',
            'tanggal_lahir' => 'required|date',
            'no_hp' => 'nullable|string|max:20',
            'alamat' => 'nullable|string',
        ]);

        $pasien = Pasien::create($validated);

        return response()->json([
            'message' => 'Data pasien berhasil dibuat',
            'data' => $pasien
        ], 201);
    }

    public function show($id)
    {
        $pasien = Pasien::findOrFail($id);
        return response()->json($pasien);
    }

    public function update(Request $request, $id)
    {
        $pasien = Pasien::findOrFail($id);

        $validated = $request->validate([
            'nik' => 'sometimes|required|unique:pasien,nik,' . $id,
            'nama' => 'sometimes|required|string|max:100',
            'jenis_kelamin' => 'sometimes|required|in:laki-laki,perempuan',
            'tanggal_lahir' => 'sometimes|required|date',
            'no_hp' => 'nullable|string|max:20',
            'alamat' => 'nullable|string',
        ]);

        $pasien->update($validated);

        return response()->json([
            'message' => 'Data pasien berhasil diperbarui',
            'data' => $pasien
        ]);
    }

    public function destroy($id)
    {
        $pasien = Pasien::findOrFail($id);
        $pasien->delete();

        return response()->json(null, 204);
    }
}