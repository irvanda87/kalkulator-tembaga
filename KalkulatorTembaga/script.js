// script.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. Ambil semua elemen input dan output
    const beratTotalInput = document.getElementById('berat-total');
    const kemurnianPersenInput = document.getElementById('kemurnian-persen');
    const hargaTembagaInput = document.getElementById('harga-tembaga');
    const selisihHargaInput = document.getElementById('selisih-harga');
    const pilihKemurnianSelect = document.getElementById('pilih-kemurnian');
    const satuanUkurSelect = document.getElementById('satuan-ukur');
    const nilaiTotalOutput = document.getElementById('nilai-total-tembaga');
    const resetBtn = document.getElementById('reset-kalkulator');

    // Konstanta Konversi
    const KG_TO_POUND = 2.20462; // 1 kg = 2.20462 pound
    const KG_TO_GRAM = 1000;

    // Fungsi untuk memformat angka ke Rupiah
    const formatter = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    // Fungsi Utama untuk Menghitung
    function hitungTotal() {
        // Ambil nilai input dan ubah ke float
        let beratInput = parseFloat(beratTotalInput.value) || 0;
        const kemurnian = parseFloat(kemurnianPersenInput.value) || 0;
        const hargaPerPound = parseFloat(hargaTembagaInput.value) || 0;
        const selisihPersen = parseFloat(selisihHargaInput.value) || 0;

        // A. Penyesuaian Satuan Berat ke Kilogram Dasar
        let beratKg;
        if (satuanUkurSelect.value === 'gram') {
            beratKg = beratInput / KG_TO_GRAM;
        } else {
            beratKg = beratInput;
        }

        // B. Konversi Berat Total ke Pound
        const beratInPound = beratKg * KG_TO_POUND;

        // C. Hitung Berat Tembaga Murni (dalam Pound)
        const kemurnianValid = Math.min(kemurnian, 100);
        const kemurnianRatio = kemurnianValid / 100;
        const beratTembagaMurniPound = beratInPound * kemurnianRatio;

        // D. Hitung Nilai Dasar (Harga Tembaga Murni tanpa Selisih)
        let nilaiDasar = beratTembagaMurniPound * hargaPerPound;

        // E. Hitung Nilai Total dengan Selisih Harga
        const faktorSelisih = 1 + (selisihPersen / 100);
        const nilaiTotal = nilaiDasar * faktorSelisih;

        // 3. Tampilkan Hasil
        nilaiTotalOutput.textContent = formatter.format(nilaiTotal);

        // Update detail output
        document.getElementById('out-kilogram').textContent = `${beratKg.toFixed(2)} kg`;
        document.getElementById('out-gram').textContent = `${(beratKg * KG_TO_GRAM).toFixed(2)} g`;
        document.getElementById('harga-penawaran').textContent = formatter.format(nilaiDasar);
        document.getElementById('tanya-harga').textContent = formatter.format(nilaiTotal);
    }

    // Event Listener untuk Select Kemurnian (mengisi otomatis persentase)
    pilihKemurnianSelect.addEventListener('change', function() {
        const ratio = parseFloat(this.value);
        // Mengubah ratio menjadi persen (misal 0.99 menjadi 99)
        kemurnianPersenInput.value = (ratio * 100).toFixed(0);
        hitungTotal();
    });

    // 4. Tambahkan Event Listener (pemicu perhitungan pada semua input)
    document.querySelectorAll('input, select').forEach(element => {
        element.addEventListener('input', hitungTotal);
    });

    // 5. Fungsi Reset
    resetBtn.addEventListener('click', () => {
        // Reset semua input ke nilai awal
        beratTotalInput.value = 0;
        kemurnianPersenInput.value = 0;
        // Harga tembaga dibiarkan pada nilai default-nya
        selisihHargaInput.value = 0;
        pilihKemurnianSelect.value = 0;
        satuanUkurSelect.value = 'kilogram';
        
        // Panggil hitungTotal untuk mereset tampilan
        hitungTotal();
    });

    // Panggil sekali saat halaman dimuat
    hitungTotal();
});