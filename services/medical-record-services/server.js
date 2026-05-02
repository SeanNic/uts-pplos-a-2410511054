const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const rekamMedis = [];
const resep = [];

app.get("/", (req, res) => {
  res.json({ message: "Medical Record Service Running" });
});

app.post("/api/rekam-medis", async (req, res) => {
  try {
    const { janji_temu_id, diagnosis, catatan, resep_obat } = req.body;

    if (!janji_temu_id || !diagnosis) {
      return res.status(422).json({
        message: "janji_temu_id dan diagnosis wajib diisi",
      });
    }

    const janjiTemuResponse = await axios.get(
      `${process.env.PATIENT_SERVICE_URL}/janji-temu/${janji_temu_id}`
    );

    const dataRekamMedis = {
      id: rekamMedis.length + 1,
      janji_temu_id,
      data_janji_temu: janjiTemuResponse.data,
      diagnosis,
      catatan: catatan || null,
      created_at: new Date(),
    };

    rekamMedis.push(dataRekamMedis);

    if (resep_obat && Array.isArray(resep_obat)) {
      resep_obat.forEach((obat) => {
        resep.push({
          id: resep.length + 1,
          rekam_medis_id: dataRekamMedis.id,
          nama_obat: obat.nama_obat,
          dosis: obat.dosis,
          aturan_pakai: obat.aturan_pakai,
        });
      });
    }

    res.status(201).json({
      message: "Rekam medis berhasil dibuat",
      data: dataRekamMedis,
      resep,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal membuat rekam medis",
      error: error.message,
    });
  }
});

app.get("/api/rekam-medis", (req, res) => {
  res.json({
    data: rekamMedis,
  });
});

app.get("/api/resep", (req, res) => {
  res.json({
    data: resep,
  });
});

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
  console.log(`Medical Record Service running on port ${PORT}`);
});