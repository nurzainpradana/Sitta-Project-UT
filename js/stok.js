document.addEventListener("DOMContentLoaded", function () {
  // Pastikan pengguna sudah login.
  const sessionUser = localStorage.getItem("sittaUser");

  if (!sessionUser) {
    window.location.href = "index.html";
    return;
  }

  let pengguna;

  try {
    pengguna = JSON.parse(sessionUser);
  } catch (error) {
    localStorage.removeItem("sittaUser");
    window.location.href = "index.html";
    return;
  }

  if (!pengguna || !pengguna.email) {
    localStorage.removeItem("sittaUser");
    window.location.href = "index.html";
    return;
  }

  // Ambil elemen HTML.
  const stockTableBody = document.getElementById("stockTableBody");
  const stockCount = document.getElementById("stockCount");
  const stockForm = document.getElementById("stockForm");
  const stockFormSection = document.getElementById("stockFormSection");
  const toggleStockForm = document.getElementById("toggleStockForm");
  const cancelStockForm = document.getElementById("cancelStockForm");
  const stockMessage = document.getElementById("stockMessage");
  const logoutBtn = document.getElementById("logoutBtn");
  const userInfo = document.getElementById("userInfo");

  const fallbackCover = "img/pengantar_komunikasi.jpg";

  // Pastikan data tersedia.
  if (!Array.isArray(dataBahanAjar)) {
    stockTableBody.innerHTML = `
            <tr>
                <td colspan="8">Data bahan ajar tidak tersedia.</td>
            </tr>
        `;
    return;
  }

  // Tampilkan identitas pengguna.
  if (userInfo) {
    userInfo.textContent = `${pengguna.nama} | ${pengguna.role}`;
  }

  // Membuat path sampul dari nama file.
  function getCoverPath(cover) {
    if (!cover || !cover.trim()) {
      return "";
    }

    const fileName = cover.trim().split(/[\\/]/).pop();

    if (!/\.(jpg|jpeg)$/i.test(fileName)) {
      return "";
    }

    return `img/${fileName}`;
  }
  // Tampilkan notifikasi.
  function showMessage(message, type) {
    stockMessage.textContent = message;
    stockMessage.className = "";

    if (type === "success") {
      stockMessage.classList.add("alert-success");
    } else if (type === "error") {
      stockMessage.classList.add("alert-error");
    }
  }

  function clearMessage() {
    stockMessage.textContent = "";
    stockMessage.className = "";
  }

  // Membuat satu baris tabel menggunakan DOM.
  function createStockRow(item, index) {
    const row = document.createElement("tr");

    const values = [
      index + 1,
      null,
      item.kodeLokasi,
      item.kodeBarang,
      item.namaBarang,
      item.jenisBarang,
      item.edisi,
      Number(item.stok).toLocaleString("id-ID"),
    ];

    values.forEach(function (value, columnIndex) {
      const cell = document.createElement("td");

      if (columnIndex === 1) {
        if (item.cover && item.cover.trim() !== "") {
          const image = document.createElement("img");

          image.src = item.cover;
          image.alt = `Sampul ${item.namaBarang || "bahan ajar"}`;
          image.width = 55;
          image.height = 70;
          image.style.objectFit = "cover";
          image.style.borderRadius = "5px";

          image.addEventListener("error", function () {
            image.remove();
            cell.textContent = "-";
          });

          cell.appendChild(image);
        } else {
          cell.textContent = "-";
        }
      } else {
        cell.textContent = value ?? "-";
      }

      row.appendChild(cell);
    });

    return row;
  }

  // Render ulang seluruh tabel dari dataBahanAjar.
  function renderStockTable() {
    stockTableBody.replaceChildren();

    if (dataBahanAjar.length === 0) {
      const row = document.createElement("tr");
      const cell = document.createElement("td");

      cell.colSpan = 8;
      cell.textContent = "Belum ada data bahan ajar.";
      row.appendChild(cell);
      stockTableBody.appendChild(row);
    } else {
      dataBahanAjar.forEach(function (item, index) {
        stockTableBody.appendChild(createStockRow(item, index));
      });
    }

    stockCount.textContent = `Total ${dataBahanAjar.length} bahan ajar`;
  }

  // Buka dan tutup form.
  toggleStockForm.addEventListener("click", function () {
    const isHidden = stockFormSection.hidden;

    stockFormSection.hidden = !isHidden;
    toggleStockForm.textContent = isHidden
      ? "Tutup Form"
      : "+ Tambah Bahan Ajar";

    clearMessage();

    if (isHidden) {
      document.getElementById("kodeLokasi").focus();
    }
  });

  function closeStockForm() {
    stockFormSection.hidden = true;
    toggleStockForm.textContent = "+ Tambah Bahan Ajar";
    stockForm.reset();
    clearMessage();
  }

  cancelStockForm.addEventListener("click", closeStockForm);

  stockForm.addEventListener("reset", clearMessage);

  // Proses penambahan bahan ajar.
  stockForm.addEventListener("submit", function (event) {
    event.preventDefault();
    clearMessage();

    const kodeLokasi = document.getElementById("kodeLokasi").value.trim();

    const kodeBarang = document
      .getElementById("kodeBarang")
      .value.trim()
      .toUpperCase();

    const namaBarang = document.getElementById("namaBarang").value.trim();

    const jenisBarang = document.getElementById("jenisBarang").value;

    const edisiInput = document.getElementById("edisi").value;
    const stokInput = document.getElementById("stok").value;
    const coverInput = document.getElementById("cover").value.trim();

    const edisi = Number(edisiInput);
    const stok = Number(stokInput);

    // Validasi field wajib.
    if (
      !kodeLokasi ||
      !kodeBarang ||
      !namaBarang ||
      !jenisBarang ||
      edisiInput === "" ||
      stokInput === ""
    ) {
      showMessage(
        "Semua field wajib harus diisi, kecuali nama file sampul.",
        "error",
      );
      return;
    }

    // Validasi angka.
    if (!Number.isInteger(edisi) || edisi < 1) {
      showMessage("Edisi harus berupa bilangan bulat minimal 1.", "error");
      return;
    }

    if (!Number.isInteger(stok) || stok < 0) {
      showMessage(
        "Stok harus berupa bilangan bulat dan tidak boleh negatif.",
        "error",
      );
      return;
    }

    // Kode barang harus unik.
    const isDuplicate = dataBahanAjar.some(function (item) {
      return String(item.kodeBarang).toUpperCase() === kodeBarang;
    });

    if (isDuplicate) {
      showMessage(
        "Kode barang sudah terdaftar. Gunakan kode barang lain.",
        "error",
      );
      document.getElementById("kodeBarang").focus();
      return;
    }

    // Bentuk objek bahan ajar baru.
    const bahanAjarBaru = {
      kodeLokasi: kodeLokasi,
      kodeBarang: kodeBarang,
      namaBarang: namaBarang,
      jenisBarang: jenisBarang,
      edisi: edisi,
      stok: stok,
      cover: coverInput.trim() !== "" ? getCoverPath(coverInput) : "",
    };

    // Tambahkan ke array dan render ulang tabel.
    dataBahanAjar.push(bahanAjarBaru);
    renderStockTable();

    showMessage(`Bahan ajar "${namaBarang}" berhasil ditambahkan.`, "success");

    stockForm.reset();
    stockFormSection.hidden = true;
    toggleStockForm.textContent = "+ Tambah Bahan Ajar";
  });

  // Logout.
  logoutBtn.addEventListener("click", function () {
    const yakin = window.confirm(
      "Apakah Anda yakin ingin keluar dari SITTA Praktik?",
    );

    if (yakin) {
      localStorage.removeItem("sittaUser");
      window.location.href = "index.html";
    }
  });

  // Navigasi yang belum tersedia.
  document.querySelectorAll("[data-placeholder]").forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      window.alert("Menu ini belum tersedia pada tahap pengembangan.");
    });
  });

  // Tampilkan data awal.
  renderStockTable();
});

function getCoverCandidates(cover) {
  if (!cover || !cover.trim()) {
    return [];
  }

  // Ambil nama file tanpa folder dan ekstensi.
  const fileName = cover.trim().split(/[\\/]/).pop();
  const baseName = fileName.replace(/\.(jpg|jpeg)$/i, "");

  // Coba ekstensi yang ditulis terlebih dahulu.
  const candidates = [fileName];

  // Kemudian coba kedua ekstensi secara otomatis.
  candidates.push(`${baseName}.jpg`);
  candidates.push(`${baseName}.jpeg`);

  // Hilangkan kandidat duplikat.
  return [...new Set(candidates)].map((name) => `img/${name}`);
}

// =========================================
// PREVIEW COVER BAHAN AJAR
// =========================================

const stockTableBody = document.getElementById("stockTableBody");
const previewModal = document.getElementById("coverPreviewModal");
const previewImage = document.getElementById("coverPreviewImage");
const previewCaption = document.getElementById("coverPreviewCaption");
const closePreviewButton = document.getElementById("closeCoverPreview");

function bukaPreview(img) {
    if (!img || !img.src || !img.complete || img.naturalWidth === 0) {
        alert("Gambar cover tidak ditemukan.");
        return;
    }

    previewImage.src = img.currentSrc || img.src;
    previewImage.alt = img.alt || "Cover bahan ajar";
    previewCaption.textContent =
        img.dataset.coverName || img.alt || "Cover bahan ajar";

    previewModal.classList.add("show");
    previewModal.setAttribute("aria-hidden", "false");
    closePreviewButton.focus();
}

function tutupPreview() {
    previewModal.classList.remove("show");
    previewModal.setAttribute("aria-hidden", "true");
    previewImage.src = "";
}

if (stockTableBody && previewModal && previewImage && closePreviewButton) {
    // Klik gambar di tabel, termasuk gambar yang ditambahkan secara dinamis.
    stockTableBody.addEventListener("click", function (event) {
        const img = event.target.closest("img");

        if (!img) return;

        bukaPreview(img);
    });

    // Tutup dengan tombol X.
    closePreviewButton.addEventListener("click", tutupPreview);

    // Tutup jika area gelap di luar modal diklik.
    previewModal.addEventListener("click", function (event) {
        if (event.target === previewModal) {
            tutupPreview();
        }
    });

    // Tutup dengan tombol Escape.
    document.addEventListener("keydown", function (event) {
        if (
            event.key === "Escape" &&
            previewModal.classList.contains("show")
        ) {
            tutupPreview();
        }
    });
}