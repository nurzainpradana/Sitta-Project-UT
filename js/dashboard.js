
/*
 * =========================================================
 * SITTA PRAKTIK
 * File: js/dashboard.js
 * Fungsi: Mengatur interaksi dashboard
 * =========================================================
 */

document.addEventListener("DOMContentLoaded", function () {

    // =====================================================
    // 1. PERIKSA SESI LOGIN
    // =====================================================

    let penggunaAktif = null;

    try {
        const sesi = localStorage.getItem("sittaUser");

        if (sesi) {
            penggunaAktif = JSON.parse(sesi);
        }
    } catch (error) {
        localStorage.removeItem("sittaUser");
    }

    // Jika belum login, kembali ke halaman login.
    if (!penggunaAktif) {
        window.location.replace("index.html");
        return;
    }


    // =====================================================
    // 2. TAMPILKAN INFORMASI PENGGUNA
    // =====================================================

    document.getElementById("userInfo").textContent =
        penggunaAktif.nama + " | " + penggunaAktif.role;

    document.getElementById("userName").textContent =
        penggunaAktif.nama;

    document.getElementById("userEmail").textContent =
        penggunaAktif.email;

    document.getElementById("userRole").textContent =
        penggunaAktif.role;

    document.getElementById("userLocation").textContent =
        penggunaAktif.lokasi;


    // =====================================================
    // 3. SAPAAN BERDASARKAN WAKTU LOKAL
    // =====================================================

    function tampilkanSapaan() {
        const jam = new Date().getHours();

        let sapaan;

        if (jam >= 4 && jam < 11) {
            sapaan = "Selamat pagi";
        } else if (jam >= 11 && jam < 15) {
            sapaan = "Selamat siang";
        } else if (jam >= 15 && jam < 18) {
            sapaan = "Selamat sore";
        } else {
            sapaan = "Selamat malam";
        }

        document.getElementById("greeting").textContent =
            sapaan + ", " + penggunaAktif.nama + "!";
    }

    tampilkanSapaan();


    // =====================================================
    // 4. RINGKASAN JUMLAH DATA
    // =====================================================

    document.getElementById("totalBahanAjar").textContent =
        dataBahanAjar.length;

    document.getElementById("totalTracking").textContent =
        Object.keys(dataTracking).length;


    // =====================================================
    // 5. PINTASAN TRACKING
    // =====================================================

    const trackingShortcuts =
        document.getElementById("trackingShortcuts");

    Object.keys(dataTracking).forEach(function (nomorDO) {
        const transaksi = dataTracking[nomorDO];

        const item = document.createElement("div");
        item.className = "tracking-info mt-2";

        const info = document.createElement("p");
        info.className = "info-value";
        info.textContent =
            nomorDO + " — " + transaksi.nama;

        const status = document.createElement("p");
        status.className = "text-muted";
        status.textContent =
            "Status: " + transaksi.status;

        const tombol = document.createElement("a");
        tombol.className = "btn btn-outline mt-1";
        tombol.href =
            "tracking.html?do=" + encodeURIComponent(nomorDO);
        tombol.textContent = "Lihat Tracking";

        item.appendChild(info);
        item.appendChild(status);
        item.appendChild(tombol);

        trackingShortcuts.appendChild(item);
    });


    // =====================================================
    // 6. LOGOUT
    // =====================================================

    document.getElementById("logoutBtn")
        .addEventListener("click", function () {

            const konfirmasi = window.confirm(
                "Apakah Anda yakin ingin logout?"
            );

            if (!konfirmasi) {
                return;
            }

            localStorage.removeItem("sittaUser");

            window.location.replace("index.html");
        });


    // =====================================================
    // 7. MENU YANG BELUM DIIMPLEMENTASIKAN
    // =====================================================

    document.querySelectorAll("[data-placeholder]")
        .forEach(function (link) {

            link.addEventListener("click", function (event) {
                event.preventDefault();

                alert(
                    "Menu " +
                    link.dataset.placeholder +
                    " belum tersedia pada tugas ini."
                );
            });
        });

});
