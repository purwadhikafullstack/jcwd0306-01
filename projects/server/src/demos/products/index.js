module.exports = [
  {
    id: 1,
    name: 'Apple iPhone 15 Pro Max',
    description: `<div><p>iPhone 15 Pro Max. Lahir dari titanium dan dilengkapi chip A17 Pro terobosan, <br>tombol Tindakan yang dapat disesuaikan, dan sistem kamera iPhone paling andal yang pernah ada.<strong><br><br><br>Isi Kotak :<br></strong><strong>• iPhone dengan iOS 17.<br></strong><strong>• Kabel USB-C ke USB-C.<br></strong><strong>• Buku Manual dan dokumentasi lain.</strong></p></div>`,
    price: 24_999_000,
    weight: 500,
    discount: 0,
    createdAt: new Date(2023, 6, 1),
    updatedAt: new Date(2023, 6, 1),
    categories: [8],
    images: require('./product-1'),
    warehouses: [
      { warehouseId: 1, stock: 96 },
      { warehouseId: 2, stock: 14 },
      { warehouseId: 3, stock: 42 },
      { warehouseId: 4, stock: 67 },
      { warehouseId: 5, stock: 89 },
    ],
  },
  {
    id: 2,
    name: 'Samsung Galaxy S23 Ultra 5G 12/512GB - Phantom Black',
    description: `<div>
                    <ul>
                        <li>Ukuran layar: 6.8 inch, 3088 x 1440 pixels, Dynamic AMOLED 2X, 120Hz, HDR10+, 1750 nits</li>
                        <li>Memori: RAM 12 GB, ROM 512 GB</li>
                        <li>Sistem operasi: Android 13, One UI 5.1</li>
                        <li>CPU: Qualcomm SM8550-AC Snapdragon 8 Gen 2 (4 nm), Octa-core (1x3.36 GHz Cortex-X3 &amp; 2x2.8 GHz Cortex-A715 &amp; 2x2.8 GHz Cortex-A710 &amp; 3x2.0 GHz Cortex-A510)</li>
                        <li>GPU: Adreno 740</li>
                        <li>Kamera: Quad 200 MP, f/1.7, 23mm (wide), 1/1.3", 0.6µm, PDAF, Laser AF, OIS, 12 MP, f/2.2, 13mm, 120˚ (ultrawide), 1/2.55", 1.4µm, dual pixel PDAF, 10 MP, f/4.9, 230mm (periscope telephoto), 1/3.52", 1.12µm, dual pixel PDAF, OIS, 10x optical zoom, 10 MP, f/2.4, 70mm (telephoto), 1/3.52", 1.12µm, dual pixel PDAF, OIS, 3x optical zoom, depan 12 MP, f/2.2, 25mm (wide), PDAF</li>
                        <li>SIM: Dual SIM (Nano-SIM)</li>
                        <li>Baterai: Non-removable Li-Ion 5000 mAh</li>
                        <li>Berat: 233 gram</li>
                        <li>Garansi Resmi</li>
                    </ul>
                </div>`,
    price: 21_999_000,
    weight: 500,
    discount: 0.07,
    createdAt: new Date(2023, 6, 1),
    updatedAt: new Date(2023, 6, 1),
    categories: [8],
    images: require('./product-2'),
    warehouses: [
      { warehouseId: 1, stock: 19 },
      { warehouseId: 2, stock: 38 },
      { warehouseId: 3, stock: 39 },
      { warehouseId: 4, stock: 43 },
      { warehouseId: 5, stock: 93 },
    ],
  },
  {
    id: 3,
    name: 'GoPro Hero 12 - Black',
    description: `<div>
                    <ul>
                        <li>Resolusi video 5.3K60 + 4K120</li>
                        <li>Stabilisasi video HyperSmooth 6.0</li>
                        <li>Foto dan video HDR</li>
                        <li>Rasio aspek 8:7</li>
                        <li>Tahan air hingga kedalaman 33 meter</li>
                    </ul>
                </div>`,
    price: 7_299_000,
    weight: 300,
    discount: 0,
    createdAt: new Date(2023, 6, 1),
    updatedAt: new Date(2023, 6, 1),
    categories: [1],
    images: require('./product-3'),
    warehouses: [
      { warehouseId: 1, stock: 47 },
      { warehouseId: 2, stock: 27 },
      { warehouseId: 3, stock: 48 },
      { warehouseId: 4, stock: 22 },
      { warehouseId: 5, stock: 80 },
    ],
  },
  {
    id: 4,
    name: 'DJI Mini 3 Pro (DJI RC)',
    description: `<div>
                    <ul>
                        <li>Fitur Active track 4.0, Spotlight 2.0, Point of Interest 3.0</li>
                        <li>Teknologi Adcance Pilot Assistance System (APAS 4.0)</li>
                        <li>Sensor Tri-directional dengan baling-baling yang kokoh</li>
                        <li>Zoom Digital &amp; Panorama</li>
                        <li>Master Shot, Time-Lapse, &amp; Quick Transfer</li>
                        <li>Bobot hanya 249 gram</li>
                        <li>Waktu pemakaian hingga 34 menit</li>
                        <li>Termasuk remote control DJI RC</li>
                    </ul>
                </div>`,
    price: 14_700_000,
    weight: 1000,
    discount: 0.2,
    createdAt: new Date(2023, 6, 1),
    updatedAt: new Date(2023, 6, 1),
    categories: [1, 3],
    images: require('./product-4'),
    warehouses: [
      { warehouseId: 1, stock: 39 },
      { warehouseId: 2, stock: 97 },
      { warehouseId: 3, stock: 48 },
      { warehouseId: 4, stock: 82 },
      { warehouseId: 5, stock: 13 },
    ],
  },
  {
    id: 5,
    name: 'Mi Curved Gaming Monitor 34" - Black',
    description: `<div>
                    <ul>
                      <li>Layar 34 inch curved</li>
                      <li>Resolusi 3440 × 1440 pixel (WQHD)</li>
                      <li>Dilengkapi Mode Cahaya Biru Rendah</li>
                      <li>Tampilan panorama ultra lebar 21:9</li>
                      <li>Tingkat kecerahan 300 nit</li>
                      <li>Refresh rate tinggi 144 Hz</li>
                      <li>AMD FreeSync Premium</li>
                      <li>Desain semua hitam, tekstur tidak mencolok yang halus</li>
                    </ul>
                  </div>`,
    price: 5_599_000,
    weight: 2000,
    discount: 0,
    createdAt: new Date(2023, 6, 1),
    updatedAt: new Date(2023, 6, 1),
    categories: [2],
    images: require('./product-5'),
    warehouses: [
      { warehouseId: 1, stock: 64 },
      { warehouseId: 2, stock: 26 },
      { warehouseId: 3, stock: 1 },
      { warehouseId: 4, stock: 83 },
      { warehouseId: 5, stock: 74 },
    ],
  },
  {
    id: 6,
    name: 'Samsung Galaxy Tab S9 FE+ 12/256GB - Light Green',
    description: `<div>
                    <ul>
                      <li>Ukuran layar: 12.4 inci, 1600 x 2560 pixels (WQXGA+)</li>
                      <li>Memori: RAM 12 GB, ROM 256 GB</li>
                      <li>Sistem operasi: Android 13, One UI 5.1</li>
                      <li>CPU: Exynos 1380 (5 nm), Octa-core (4x2.4 GHz Cortex-A78 &amp; 4x2.0 GHz Cortex-A55)</li>
                      <li>GPU: Mali-G68 MP5</li>
                      <li>Kamera: Dual 8 MP (wide), 8 MP (ultrawide), depan 12 MP (ultrawide)</li>
                      <li>SIM: Dual SIM (Nano-SIM)</li>
                      <li>Baterai: Non-removable Li-Po 10.090 mAh</li>
                      <li>Berat: 610 gram</li>
                      <li>Garansi Resmi</li>
                    </ul>
                  </div>`,
    price: 10_999_000,
    weight: 800,
    discount: 0,
    createdAt: new Date(2023, 6, 1),
    updatedAt: new Date(2023, 6, 1),
    categories: [10],
    images: require('./product-6'),
    warehouses: [
      { warehouseId: 1, stock: 96 },
      { warehouseId: 2, stock: 14 },
      { warehouseId: 3, stock: 42 },
      { warehouseId: 4, stock: 67 },
      { warehouseId: 5, stock: 89 },
    ],
  },
  {
    id: 7,
    name: 'Apple MacBook Pro (13.3 inci, M2, 2022) 8C CPU, 10C GPU, 512GB, Silver',
    description: `<div>
                    <ul>
                      <li>Chip M2 dengan performa CPU, GPU, dan pembelajaran mesin generasi berikutnya</li>
                      <li>CPU 8-core dan GPU 10-core yang lebih cepat untuk menyelesaikan berbagai alur kerja yang intens(3)</li>
                      <li>Neural Engine 16-core untuk berbagai tugas pembelajaran mesin canggih</li>
                      <li>Memori terintegrasi lebih cepat hingga 24 GB menjadikan segala yang Anda lakukan terasa lancar</li>
                      <li>Penggabungan gambar ke dalam panorama hingga 43 persen lebih cepat2</li>
                      <li>Performa bermain game hingga 39 persen lebih cepat2</li>
                      <li>Sistem pendingin aktif menopang performa luar biasa</li>
                      <li>Lakukan banyak hal sepanjang hari dengan kekuatan baterai hingga 20 jam(2)</li>
                      <li>Layar Retina 13,3 inci dengan kecerahan 500 nit dan warna luas P3 untuk gambar yang cemerlang dan detail luar biasa(4)</li>
                      <li>Kamera FaceTime HD dengan prosesor sinyal gambar canggih agar Anda tampil menawan dalam panggilan video</li>
                      <li>Deretan tiga mikrofon berkualitas studio menangkap suara Anda dengan lebih jernih</li>
                      <li>Koneksi nirkabel Wi-Fi 6 yang kencang</li>
                      <li>Dua port Thunderbolt untuk pengisian daya dan aksesori</li>
                      <li>Magic Keyboard berlampu latar dengan Touch Bar dan Touch ID untuk membuka kunci dan melakukan pembayaran dengan aman</li>
                      <li>Penyimpanan SSD super cepat membuka aplikasi dan file dalam sekejap</li>
                      <li>macOS Monterey memungkinkan Anda terhubung, berbagi, dan berkreasi dengan cara yang benar-benar baru — di semua perangkat Apple Anda</li>
                      <li>Tersedia dalam warna abu-abu dan perak</li>
                    </ul>
                  </div>`,
    price: 25_499_000,
    weight: 2000,
    discount: 0,
    createdAt: new Date(2023, 6, 1),
    updatedAt: new Date(2023, 6, 1),
    categories: [5],
    images: require('./product-7'),
    warehouses: [
      { warehouseId: 1, stock: 58 },
      { warehouseId: 2, stock: 3 },
      { warehouseId: 3, stock: 60 },
      { warehouseId: 4, stock: 51 },
      { warehouseId: 5, stock: 27 },
    ],
  },
  {
    id: 8,
    name: 'Garmin MARQ Captain Gen 2 - Silver',
    description: `<div>
                    <ul>
                      <li>Layar AMOLED 1.2 inch, 390 x 390 piksel</li>
                      <li>Material casing dari Titanium Grade 5</li>
                      <li>Lensa Domed Sapphire Crystal</li>
                      <li>Dilengkapi fitur-fitur yang mendukung kegiatan Anda</li>
                      <li>Kapasitas penyimpanan 32GB</li>
                      <li>Masa pakai baterai hingga 16 hari</li>
                    </ul>
                  </div>`,
    price: 37_799_000,
    weight: 200,
    discount: 0,
    createdAt: new Date(2023, 6, 1),
    updatedAt: new Date(2023, 6, 1),
    categories: [9],
    images: require('./product-8'),
    warehouses: [
      { warehouseId: 1, stock: 90 },
      { warehouseId: 2, stock: 72 },
      { warehouseId: 3, stock: 82 },
      { warehouseId: 4, stock: 100 },
      { warehouseId: 5, stock: 35 },
    ],
  },
  {
    id: 9,
    name: 'Xiaomi Smart Band 7 - Black',
    description: `<div>
                    <ul>
                      <li>Layar 1.62 Inch AMOLED</li>
                      <li>Pemantauan SpO₂ sepanjang hari</li>
                      <li>Pemantauan tidur</li>
                      <li>Analisis latihan profesional VO₂ max</li>
                      <li>Pemantauan detak jantung</li>
                      <li>100+ custom band faces</li>
                      <li>110+ Mode Olahraga</li>
                      <li>Resistansi air hingga 50m</li>
                      <li>Daya baterai hingga 14 hari</li>
                    </ul>
                  </div>`,
    price: 499_000,
    weight: 200,
    discount: 0,
    createdAt: new Date(2023, 6, 1),
    updatedAt: new Date(2023, 6, 1),
    categories: [7],
    images: require('./product-9'),
    warehouses: [
      { warehouseId: 1, stock: 56 },
      { warehouseId: 2, stock: 100 },
      { warehouseId: 3, stock: 70 },
      { warehouseId: 4, stock: 92 },
      { warehouseId: 5, stock: 33 },
    ],
  },
  {
    id: 10,
    name: 'Ayaneo Geek 512 GB AMD Ryzen7 - Fantasy Black',
    description: `<div>
                    <ul>
                      <li>Prosesor AMD Ryzen 7 6800U</li>
                      <li>Konektivitas menggunakan WiFi 6 &amp; Bluetooth 5.2</li>
                      <li>Mendukung SSD dua sisi dengan kapasitas besar</li>
                      <li>Dilengkapi modul fingerprint</li>
                      <li>Kapasitas baterai besar 4350mAh</li>
                      <li>Sistem operasi Windows 11/AYANEO OS</li>
                    </ul>
                  </div>`,
    price: 20_999_000,
    weight: 500,
    discount: 0.46,
    createdAt: new Date(2023, 6, 1),
    updatedAt: new Date(2023, 6, 1),
    categories: [4],
    images: require('./product-10'),
    warehouses: [
      { warehouseId: 1, stock: 61 },
      { warehouseId: 2, stock: 25 },
      { warehouseId: 3, stock: 29 },
      { warehouseId: 4, stock: 63 },
      { warehouseId: 5, stock: 80 },
    ],
  },
  {
    id: 11,
    name: 'realme Book Prime i5 8/512GB - Blue',
    description: `<div>
                    <ul>
                      <li>Ukuran Layar: 14 inci, 2160 × 1440 pixel, IPS, Up to 400 nits</li>
                      <li>Prosesor: Intel® Core™ i5-11320H generasi ke-11</li>
                      <li>Grafis: Intel® Iris X<sup>e</sup> Graphics</li>
                      <li>Memori: 8 GB LPDDR4x 4266 MHz , 512 GB PCIe SSD</li>
                      <li>Sistem Operasi: Microsoft Windows 11</li>
                    </ul>
                  </div>`,
    price: 11_499_000,
    weight: 2000,
    discount: 0.19,
    createdAt: new Date(2023, 6, 1),
    updatedAt: new Date(2023, 6, 1),
    categories: [5],
    images: require('./product-11'),
    warehouses: [
      { warehouseId: 1, stock: 25 },
      { warehouseId: 2, stock: 9 },
      { warehouseId: 3, stock: 52 },
      { warehouseId: 4, stock: 100 },
      { warehouseId: 5, stock: 52 },
    ],
  },
  {
    id: 12,
    name: 'Sony PlayStation 5 - White',
    description: `<div>
                    <ul>
                      <li>BlueRay Disc</li>
                      <li>CPU: x86-64-AMD Ryzen™ “Zen 2”</li>
                      <li>GPU: AMD Radeon™ RDNA 2-based graphics engine</li>
                      <li>Ray Tracing Acceleration</li>
                      <li>SSD Storage System</li>
                      <li>"Tempest" 3D AudioTech</li>
                      <li>Backwards compatibility with PS4 games and PSVR hardware</li>
                      <li>Support of 4K 120Hz TVs, 8K TVs, VRR (specified by HDMI ver.2.1)</li>
                      <li>Haptic Technology</li>
                      <li>Adaptive Triggers</li>
                    </ul>
                  </div>`,
    price: 9_699_000,
    weight: 2500,
    discount: 0,
    createdAt: new Date(2023, 6, 1),
    updatedAt: new Date(2023, 6, 1),
    categories: [4],
    images: require('./product-12'),
    warehouses: [
      { warehouseId: 1, stock: 85 },
      { warehouseId: 2, stock: 84 },
      { warehouseId: 3, stock: 61 },
      { warehouseId: 4, stock: 74 },
      { warehouseId: 5, stock: 89 },
    ],
  },
];
