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

  const searchInput = document.getElementById("searchRekap");
  const filterJenis = document.getElementById("filterJenis");
  const filterForm = document.getElementById("rekapFilterForm");
  const resetButton = document.getElementById("resetRekap");
  const tableBody = document.getElementById("rekapTableBody");
  const rekapCount = document.getElementById("rekapCount");

  // Gunakan data bahan ajar yang tersedia.
  const daftarBahanAjar = Array.isArray(dataBahanAjar) ? dataBahanAjar : [];

  function angka(value) {
    const hasil = Number(value);
    return Number.isFinite(hasil) ? hasil : 0;
  }

  function buatSel(value) {
    const cell = document.createElement("td");
    cell.textContent = value ?? "-";
    return cell;
  }

  // Isi opsi filter berdasarkan jenis yang tersedia.
  function siapkanFilterJenis() {
    const jenisUnik = [
      ...new Set(
        daftarBahanAjar
          .map((item) => String(item.jenisBarang || "").trim())
          .filter(Boolean),
      ),
    ].sort((a, b) => a.localeCompare(b, "id"));

    jenisUnik.forEach(function (jenis) {
      const option = document.createElement("option");
      option.value = jenis;
      option.textContent = jenis;
      filterJenis.appendChild(option);
    });
  }

  // Ringkasan seluruh data, tidak terpengaruh filter tabel.
  function tampilkanRingkasan() {
    const totalStok = daftarBahanAjar.reduce(
      (total, item) => total + angka(item.stok),
      0,
    );

    const lokasiUnik = new Set(
      daftarBahanAjar
        .map((item) => String(item.kodeLokasi || "").trim())
        .filter(Boolean),
    );

    document.getElementById("totalJenis").textContent =
      daftarBahanAjar.length.toLocaleString("id-ID");

    document.getElementById("totalStok").textContent =
      totalStok.toLocaleString("id-ID");

    document.getElementById("totalLokasi").textContent =
      lokasiUnik.size.toLocaleString("id-ID");
  }

  // Cari dan filter data.
  function dapatkanHasilFilter() {
    const keyword = searchInput.value.trim().toLowerCase();
    const jenisDipilih = filterJenis.value.toLowerCase();

    return daftarBahanAjar.filter(function (item) {
      const kodeLokasi = String(item.kodeLokasi || "").toLowerCase();
      const kodeBarang = String(item.kodeBarang || "").toLowerCase();
      const namaBarang = String(item.namaBarang || "").toLowerCase();
      const jenisBarang = String(item.jenisBarang || "").toLowerCase();

      const cocokPencarian =
        kodeLokasi.includes(keyword) ||
        kodeBarang.includes(keyword) ||
        namaBarang.includes(keyword);

      const cocokJenis = !jenisDipilih || jenisBarang === jenisDipilih;

      return cocokPencarian && cocokJenis;
    });
  }

  function tampilkanTabel() {
    const hasil = dapatkanHasilFilter();

    tableBody.replaceChildren();

    rekapCount.textContent = `Menampilkan ${hasil.length} dari ${daftarBahanAjar.length} data bahan ajar`;

    if (hasil.length === 0) {
      const row = document.createElement("tr");
      const cell = document.createElement("td");

      cell.colSpan = 7;
      cell.className = "table-empty";
      cell.textContent = "Data bahan ajar tidak ditemukan.";

      row.appendChild(cell);
      tableBody.appendChild(row);
    } else {
      hasil.forEach(function (item, index) {
        const row = document.createElement("tr");

        row.appendChild(buatSel(index + 1));
        row.appendChild(buatSel(item.kodeLokasi));
        row.appendChild(buatSel(item.kodeBarang));
        row.appendChild(buatSel(item.namaBarang));
        row.appendChild(buatSel(item.jenisBarang));
        row.appendChild(buatSel(item.edisi));
        row.appendChild(buatSel(angka(item.stok).toLocaleString("id-ID")));

        tableBody.appendChild(row);
      });
    }

    const totalStokFilter = hasil.reduce(
      (total, item) => total + angka(item.stok),
      0,
    );

    document.getElementById("rekapTotalFilter").textContent =
      totalStokFilter.toLocaleString("id-ID");
  }

  filterForm.addEventListener("submit", function (event) {
    event.preventDefault();
    tampilkanTabel();
  });

  // Filter langsung berubah saat pengguna mengetik atau memilih jenis.
  searchInput.addEventListener("input", tampilkanTabel);
  filterJenis.addEventListener("change", tampilkanTabel);

  resetButton.addEventListener("click", function () {
    searchInput.value = "";
    filterJenis.value = "";
    tampilkanTabel();
  });

  document.getElementById("printReport").addEventListener("click", function () {
    window.print();
  });

  document.getElementById("logoutBtn").addEventListener("click", function () {
    if (window.confirm("Apakah Anda yakin ingin keluar dari SITTA Praktik?")) {
      localStorage.removeItem("sittaUser");
      window.location.href = "index.html";
    }
  });

  // Menu yang belum dikembangkan.
  document.querySelectorAll("[data-placeholder]").forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      window.alert("Menu ini belum tersedia pada tahap pengembangan.");
    });
  });

  siapkanFilterJenis();
  tampilkanRingkasan();
  tampilkanTabel();
});
