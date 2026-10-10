document.addEventListener("DOMContentLoaded", function () {
    // Validasi sesi login.
    let pengguna;

    try {
        pengguna = JSON.parse(localStorage.getItem("sittaUser"));
    } catch (error) {
        pengguna = null;
    }

    if (!pengguna || !pengguna.email) {
        window.location.href = "index.html";
        return;
    }

    document.getElementById("userInfo").textContent =
        `${pengguna.nama} | ${pengguna.role}`;

    // Data simulasi histori transaksi.
    // Tidak mengubah dataBahanAjar maupun stok aslinya.
    const dataHistoriTransaksi = [
        {
            tanggal: "2025-08-20",
            nomorTransaksi: "TRX-2025-001",
            jenis: "Masuk",
            kodeBarang: "ASIP4301",
            namaBarang: "Pengantar Ilmu Komunikasi",
            jumlah: 50,
            keterangan: "Penerimaan bahan ajar"
        },
        {
            tanggal: "2025-08-21",
            nomorTransaksi: "TRX-2025-002",
            jenis: "Keluar",
            kodeBarang: "EKMA4216",
            namaBarang: "Manajemen Keuangan",
            jumlah: 20,
            keterangan: "Pengiriman bahan ajar"
        },
        {
            tanggal: "2025-08-22",
            nomorTransaksi: "TRX-2025-003",
            jenis: "Masuk",
            kodeBarang: "EKMA4310",
            namaBarang: "Kepemimpinan",
            jumlah: 30,
            keterangan: "Penambahan persediaan"
        },
        {
            tanggal: "2025-08-23",
            nomorTransaksi: "TRX-2025-004",
            jenis: "Keluar",
            kodeBarang: "BIOL4211",
            namaBarang: "Mikrobiologi Dasar",
            jumlah: 15,
            keterangan: "Distribusi bahan ajar"
        },
        {
            tanggal: "2025-08-24",
            nomorTransaksi: "TRX-2025-005",
            jenis: "Masuk",
            kodeBarang: "PAUD4401",
            namaBarang: "Perkembangan Anak Usia Dini",
            jumlah: 25,
            keterangan: "Penerimaan persediaan"
        },
        {
            tanggal: "2025-08-25",
            nomorTransaksi: "TRX-2025-006",
            jenis: "Keluar",
            kodeBarang: "ASIP4301",
            namaBarang: "Pengantar Ilmu Komunikasi",
            jumlah: 10,
            keterangan: "Pengeluaran bahan ajar"
        }
    ];

    const searchInput = document.getElementById("searchHistori");
    const filterJenis = document.getElementById("filterTransaksi");
    const filterForm = document.getElementById("historiFilterForm");
    const resetButton = document.getElementById("resetHistori");
    const tableBody = document.getElementById("historiTableBody");
    const historiCount = document.getElementById("historiCount");

    function formatAngka(nilai) {
        return Number(nilai || 0).toLocaleString("id-ID");
    }

    function formatTanggal(tanggal) {
        if (!tanggal) return "-";

        const date = new Date(`${tanggal}T00:00:00`);

        if (Number.isNaN(date.getTime())) {
            return tanggal;
        }

        return date.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    }

    function buatSel(nilai) {
        const cell = document.createElement("td");
        cell.textContent = nilai ?? "-";
        return cell;
    }

    function buatBadgeJenis(jenis) {
        const cell = document.createElement("td");
        const badge = document.createElement("span");

        badge.className = "histori-badge";
        badge.classList.add(
            jenis === "Masuk" ? "histori-badge-masuk" : "histori-badge-keluar"
        );
        badge.textContent = jenis || "-";

        cell.appendChild(badge);
        return cell;
    }

    // Hitung jumlah transaksi berdasarkan jenis.
    function tampilkanRingkasan() {
        document.getElementById("totalTransaksi").textContent =
            formatAngka(dataHistoriTransaksi.length);

        document.getElementById("totalMasuk").textContent =
            formatAngka(
                dataHistoriTransaksi.filter(item => item.jenis === "Masuk").length
            );

        document.getElementById("totalKeluar").textContent =
            formatAngka(
                dataHistoriTransaksi.filter(item => item.jenis === "Keluar").length
            );
    }

    function dapatkanHasilFilter() {
        const keyword = searchInput.value.trim().toLowerCase();
        const jenisDipilih = filterJenis.value;

        return dataHistoriTransaksi
            .filter(function (item) {
                const cocokKata =
                    String(item.nomorTransaksi).toLowerCase().includes(keyword) ||
                    String(item.kodeBarang).toLowerCase().includes(keyword) ||
                    String(item.namaBarang).toLowerCase().includes(keyword) ||
                    String(item.keterangan).toLowerCase().includes(keyword);

                const cocokJenis =
                    jenisDipilih === "" || item.jenis === jenisDipilih;

                return cocokKata && cocokJenis;
            })
            .sort((a, b) => b.tanggal.localeCompare(a.tanggal));
    }

    function tampilkanTabel() {
        const hasil = dapatkanHasilFilter();

        tableBody.replaceChildren();

        historiCount.textContent =
            `Menampilkan ${hasil.length} dari ${dataHistoriTransaksi.length} transaksi`;

        if (hasil.length === 0) {
            const row = document.createElement("tr");
            const cell = document.createElement("td");

            cell.colSpan = 8;
            cell.className = "table-empty";
            cell.textContent = "Histori transaksi tidak ditemukan.";

            row.appendChild(cell);
            tableBody.appendChild(row);
            return;
        }

        hasil.forEach(function (item, index) {
            const row = document.createElement("tr");

            row.appendChild(buatSel(index + 1));
            row.appendChild(buatSel(formatTanggal(item.tanggal)));
            row.appendChild(buatSel(item.nomorTransaksi));
            row.appendChild(buatBadgeJenis(item.jenis));
            row.appendChild(buatSel(item.kodeBarang));
            row.appendChild(buatSel(item.namaBarang));
            row.appendChild(buatSel(formatAngka(item.jumlah)));
            row.appendChild(buatSel(item.keterangan));

            tableBody.appendChild(row);
        });
    }

    filterForm.addEventListener("submit", function (event) {
        event.preventDefault();
        tampilkanTabel();
    });

    searchInput.addEventListener("input", tampilkanTabel);
    filterJenis.addEventListener("change", tampilkanTabel);

    resetButton.addEventListener("click", function () {
        searchInput.value = "";
        filterJenis.value = "";
        tampilkanTabel();
    });

    document.getElementById("printHistori").addEventListener("click", function () {
        window.print();
    });

    document.getElementById("logoutBtn").addEventListener("click", function () {
        if (window.confirm("Apakah Anda yakin ingin keluar dari SITTA Praktik?")) {
            localStorage.removeItem("sittaUser");
            window.location.href = "index.html";
        }
    });

    // Jalankan jika ada menu yang masih berupa placeholder.
    document.querySelectorAll("[data-placeholder]").forEach(function (link) {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            window.alert("Menu ini belum tersedia pada tahap pengembangan.");
        });
    });

    tampilkanRingkasan();
    tampilkanTabel();
});