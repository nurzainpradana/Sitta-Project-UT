
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

    const trackingForm = document.getElementById("trackingForm");
    const nomorDOInput = document.getElementById("nomorDO");
    const trackingResult = document.getElementById("trackingResult");
    const trackingMessage = document.getElementById("trackingMessage");
    const trackingTimeline = document.getElementById("trackingTimeline");

    document.getElementById("userInfo").textContent =
        `${pengguna.nama} | ${pengguna.role}`;

    // Format tanggal agar lebih mudah dibaca.
    function formatTanggal(tanggal) {
        if (!tanggal) return "-";

        const date = new Date(tanggal.replace(" ", "T"));

        if (Number.isNaN(date.getTime())) {
            return tanggal;
        }

        return date.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });
    }

    // Format waktu pada timeline.
    function formatWaktu(waktu) {
        if (!waktu) return "-";

        const date = new Date(waktu.replace(" ", "T"));

        if (Number.isNaN(date.getTime())) {
            return waktu;
        }

        return date.toLocaleString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false
        });
    }

    function tampilkanPesan(pesan, jenis) {
        trackingMessage.textContent = pesan;
        trackingMessage.className = jenis === "error"
            ? "alert-error"
            : "alert-success";
    }

    function hapusPesan() {
        trackingMessage.textContent = "";
        trackingMessage.className = "";
    }

    // Mencari dan menampilkan data DO.
    function cariPengiriman(nomorDO) {
        hapusPesan();

        const nomor = nomorDO.trim();

        if (!nomor) {
            trackingResult.hidden = true;
            tampilkanPesan("Masukkan nomor DO terlebih dahulu.", "error");
            return;
        }

        const data = dataTracking[nomor];

        if (!data || data.nomorDO !== nomor) {
            trackingResult.hidden = true;
            tampilkanPesan(
                "Nomor DO tidak ditemukan. Silakan periksa kembali nomor yang dimasukkan.",
                "error"
            );
            return;
        }

        // Isi informasi pengiriman.
        document.getElementById("trackingDONumber").textContent =
            `Nomor DO: ${data.nomorDO}`;

        document.getElementById("trackingNama").textContent =
            data.nama || "-";

        document.getElementById("trackingEkspedisi").textContent =
            data.ekspedisi || "-";

        document.getElementById("trackingTanggal").textContent =
            formatTanggal(data.tanggalKirim);

        document.getElementById("trackingPaket").textContent =
            data.paket || "-";

        document.getElementById("trackingTotal").textContent =
            data.total || "-";

        const statusElement = document.getElementById("trackingStatus");
        statusElement.textContent = data.status || "Status tidak tersedia";
        statusElement.className = "status-badge";

        if (data.status === "Dalam Perjalanan") {
            statusElement.classList.add("status-transit");
        } else if (data.status === "Dikirim") {
            statusElement.classList.add("status-delivered");
        }

        // Buat timeline.
        trackingTimeline.replaceChildren();

        if (Array.isArray(data.perjalanan) && data.perjalanan.length > 0) {
            data.perjalanan.forEach(function (item) {
                const timelineItem = document.createElement("div");
                timelineItem.className = "timeline-item";

                const marker = document.createElement("span");
                marker.className = "timeline-marker";
                marker.setAttribute("aria-hidden", "true");

                const content = document.createElement("div");
                content.className = "timeline-content";

                const time = document.createElement("p");
                time.className = "timeline-time";
                time.textContent = formatWaktu(item.waktu);

                const description = document.createElement("p");
                description.className = "timeline-description";
                description.textContent = item.keterangan || "-";

                content.append(time, description);
                timelineItem.append(marker, content);
                trackingTimeline.appendChild(timelineItem);
            });
        } else {
            const empty = document.createElement("p");
            empty.textContent = "Belum ada riwayat perjalanan.";
            trackingTimeline.appendChild(empty);
        }

        trackingResult.hidden = false;
        trackingResult.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }

    trackingForm.addEventListener("submit", function (event) {
        event.preventDefault();
        cariPengiriman(nomorDOInput.value);
    });

    // Tombol contoh DO.
    document.querySelectorAll("[data-do]").forEach(function (button) {
        button.addEventListener("click", function () {
            nomorDOInput.value = button.dataset.do;
            cariPengiriman(button.dataset.do);
        });
    });

    // Buka hasil secara otomatis dari parameter URL.
    const params = new URLSearchParams(window.location.search);
    const nomorDODariURL = params.get("do");

    if (nomorDODariURL) {
        nomorDOInput.value = nomorDODariURL;
        cariPengiriman(nomorDODariURL);
    }

    // Logout.
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
});