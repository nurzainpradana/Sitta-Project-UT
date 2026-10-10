
/*
 * =========================================================
 * SITTA PRAKTIK
 * File: js/script.js
 * Tahap 4: Login, Lupa Password, dan Daftar
 * =========================================================
 */

document.addEventListener("DOMContentLoaded", function () {

    // Pastikan data pengguna tersedia.
    if (typeof dataPengguna === "undefined") {
        alert("Data pengguna tidak berhasil dimuat.");
        return;
    }

    // =====================================================
    // 1. REFERENSI ELEMEN HTML
    // =====================================================

    const loginForm = document.getElementById("loginForm");

    const forgotPasswordBtn =
        document.getElementById("forgotPasswordBtn");

    const registerBtn =
        document.getElementById("registerBtn");

    const forgotPasswordModal =
        document.getElementById("forgotPasswordModal");

    const registerModal =
        document.getElementById("registerModal");

    const forgotPasswordForm =
        document.getElementById("forgotPasswordForm");

    const registerForm =
        document.getElementById("registerForm");

    const forgotPasswordMessage =
        document.getElementById("forgotPasswordMessage");

    const registerMessage =
        document.getElementById("registerMessage");


    // =====================================================
    // 2. FUNGSI MEMBUKA DAN MENUTUP MODAL
    // =====================================================

    function bukaModal(modal) {
        if (!modal) return;

        // Tutup modal lain terlebih dahulu.
        tutupSemuaModal();

        modal.hidden = false;

        // Fokuskan input pertama pada modal.
        const inputPertama = modal.querySelector(
            "input:not([type='hidden'])"
        );

        if (inputPertama) {
            inputPertama.focus();
        }
    }

    function tutupModal(modal) {
        if (modal) {
            modal.hidden = true;
        }
    }

    function tutupSemuaModal() {
        tutupModal(forgotPasswordModal);
        tutupModal(registerModal);
    }


    // Tombol Lupa Password.
    forgotPasswordBtn.addEventListener("click", function () {
        forgotPasswordForm.reset();
        forgotPasswordMessage.innerHTML = "";

        bukaModal(forgotPasswordModal);
    });


    // Tombol Daftar.
    registerBtn.addEventListener("click", function () {
        registerForm.reset();
        registerMessage.innerHTML = "";

        bukaModal(registerModal);
    });


    // Semua tombol dengan data-close-modal.
    document.querySelectorAll("[data-close-modal]")
        .forEach(function (button) {
            button.addEventListener("click", function () {
                const modal = button.closest(".modal");
                tutupModal(modal);
            });
        });


    // Tutup modal jika area gelap di luar konten diklik.
    document.querySelectorAll(".modal")
        .forEach(function (modal) {
            modal.addEventListener("click", function (event) {
                if (event.target === modal) {
                    tutupModal(modal);
                }
            });
        });


    // Tutup modal menggunakan tombol Escape.
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            tutupSemuaModal();
        }
    });


    // =====================================================
    // 3. PROSES LOGIN
    // =====================================================

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = document.getElementById("email")
            .value.trim().toLowerCase();

        const password = document.getElementById("password")
            .value;

        // Cari pengguna yang email dan password-nya cocok.
        const pengguna = dataPengguna.find(function (user) {
            return user.email.toLowerCase() === email
                && user.password === password;
        });

        if (!pengguna) {
            alert("email/password yang anda masukkan salah");
            return;
        }

        // Simpan informasi pengguna yang login.
        // Password tidak ikut disimpan.
        const sesiPengguna = {
            id: pengguna.id,
            nama: pengguna.nama,
            email: pengguna.email,
            role: pengguna.role,
            lokasi: pengguna.lokasi
        };

        try {
            localStorage.setItem(
                "sittaUser",
                JSON.stringify(sesiPengguna)
            );
        } catch (error) {
            alert("Browser tidak dapat menyimpan sesi login.");
            return;
        }

        // Login berhasil: buka dashboard.
        window.location.href = "dashboard.html";
    });


    // =====================================================
    // 4. FITUR LUPA PASSWORD
    // =====================================================

    forgotPasswordForm.addEventListener(
        "submit",
        function (event) {
            event.preventDefault();

            const email = document.getElementById("forgotEmail")
                .value.trim().toLowerCase();

            const pengguna = dataPengguna.find(function (user) {
                return user.email.toLowerCase() === email;
            });

            if (pengguna) {
                tampilkanPesan(
                    forgotPasswordMessage,
                    "Email terdaftar. Untuk simulasi ini, silakan hubungi administrator untuk bantuan reset password.",
                    "alert-info"
                );
            } else {
                tampilkanPesan(
                    forgotPasswordMessage,
                    "Email tidak ditemukan dalam data pengguna.",
                    "alert-error"
                );
            }
        }
    );


    // =====================================================
    // 5. FITUR DAFTAR
    // =====================================================

    registerForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const nama = document.getElementById("registerName")
            .value.trim();

        const email = document.getElementById("registerEmail")
            .value.trim().toLowerCase();

        const password = document.getElementById("registerPassword")
            .value;

        // Periksa apakah email sudah digunakan.
        const emailTerdaftar = dataPengguna.some(function (user) {
            return user.email.toLowerCase() === email;
        });

        if (emailTerdaftar) {
            tampilkanPesan(
                registerMessage,
                "Email sudah terdaftar. Silakan gunakan email lain.",
                "alert-error"
            );
            return;
        }

        // Tambahkan pengguna baru ke data selama halaman aktif.
        const penggunaBaru = {
            id: Math.max(
                0,
                ...dataPengguna.map(function (user) {
                    return Number(user.id) || 0;
                })
            ) + 1,

            nama: nama,
            email: email,
            password: password,
            role: "UPBJJ-UT",
            lokasi: "Belum ditentukan"
        };

        dataPengguna.push(penggunaBaru);

        tampilkanPesan(
            registerMessage,
            "Pendaftaran simulasi berhasil. Silakan login menggunakan akun baru Anda.",
            "alert-success"
        );

        registerForm.reset();
    });


    // =====================================================
    // 6. FUNGSI MENAMPILKAN PESAN
    // =====================================================

    function tampilkanPesan(elemen, pesan, jenis) {
        if (!elemen) return;

        // Gunakan textContent untuk menghindari interpretasi HTML.
        elemen.textContent = pesan;
        elemen.className = "mt-2 alert " + jenis;
    }

});
