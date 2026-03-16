import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clean existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.prebuiltBuild.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // Categories
  const categories = await Promise.all([
    prisma.category.create({ data: { name: "CPUs", slug: "cpus", description: "Processors", image: "/products/cpus/ryzen-7-7800x3d.png" } }),
    prisma.category.create({ data: { name: "GPUs", slug: "gpus", description: "Graphics Cards", image: "/products/gpus/rtx-4070-ti-super.png" } }),
    prisma.category.create({ data: { name: "Motherboards", slug: "motherboards", description: "Motherboards", image: "/products/motherboards/asus-b650e-f.png" } }),
    prisma.category.create({ data: { name: "RAM", slug: "ram", description: "Memory", image: "/products/ram/corsair-vengeance-32gb.png" } }),
    prisma.category.create({ data: { name: "Storage", slug: "storage", description: "SSDs & HDDs", image: "/products/storage/samsung-990-pro-1tb.png" } }),
    prisma.category.create({ data: { name: "PSUs", slug: "psus", description: "Power Supplies", image: "/products/psus/corsair-rm750x.png" } }),
    prisma.category.create({ data: { name: "Cases", slug: "cases", description: "PC Cases", image: "/products/cases/nzxt-h5-flow.png" } }),
    prisma.category.create({ data: { name: "Coolers", slug: "coolers", description: "CPU Coolers", image: "/products/coolers/noctua-nh-d15.png" } }),
  ]);

  const [cpus, gpus, mobos, ram, storage, psus, cases, coolers] = categories;

  // CPUs (6)
  const cpuProducts = await Promise.all([
    prisma.product.create({ data: {
      name: "AMD Ryzen 5 7600X", slug: "amd-ryzen-5-7600x", description: "6-core, 12-thread desktop processor with AMD 3D V-Cache technology for ultimate gaming performance.", price: 11490, salePrice: 9990, images: ["/products/cpus/ryzen-5-7600x.png"], categoryId: cpus.id, brand: "AMD", componentType: "CPU", socketType: "AM5", wattage: 105, isFeatured: true, isFlashDeal: true, rating: 4.7, reviewCount: 342, specs: { Cores: "6", Threads: "12", "Base Clock": "4.7 GHz", "Boost Clock": "5.3 GHz", TDP: "105W" },
    }}),
    prisma.product.create({ data: {
      name: "AMD Ryzen 7 7800X3D", slug: "amd-ryzen-7-7800x3d", description: "8-core gaming processor with 3D V-Cache for the best gaming performance.", price: 24990, images: ["/products/cpus/ryzen-7-7800x3d.png"], categoryId: cpus.id, brand: "AMD", componentType: "CPU", socketType: "AM5", wattage: 120, isFeatured: true, rating: 4.9, reviewCount: 567, specs: { Cores: "8", Threads: "16", "Base Clock": "4.2 GHz", "Boost Clock": "5.0 GHz", TDP: "120W", "L3 Cache": "96MB" },
    }}),
    prisma.product.create({ data: {
      name: "AMD Ryzen 9 7950X", slug: "amd-ryzen-9-7950x", description: "16-core, 32-thread flagship processor for content creators and enthusiasts.", price: 30990, salePrice: 27990, images: ["/products/cpus/ryzen-9-7950x.png"], categoryId: cpus.id, brand: "AMD", componentType: "CPU", socketType: "AM5", wattage: 170, isFlashDeal: true, rating: 4.8, reviewCount: 289, specs: { Cores: "16", Threads: "32", "Base Clock": "4.5 GHz", "Boost Clock": "5.7 GHz", TDP: "170W" },
    }}),
    prisma.product.create({ data: {
      name: "Intel Core i5-14600K", slug: "intel-core-i5-14600k", description: "14-core (6P+8E) unlocked desktop processor for gaming and productivity.", price: 17490, salePrice: 15490, images: ["/products/cpus/i5-14600k.png"], categoryId: cpus.id, brand: "Intel", componentType: "CPU", socketType: "LGA1700", wattage: 125, isFlashDeal: true, rating: 4.6, reviewCount: 456, specs: { Cores: "14 (6P+8E)", Threads: "20", "Base Clock": "3.5 GHz", "Boost Clock": "5.3 GHz", TDP: "125W" },
    }}),
    prisma.product.create({ data: {
      name: "Intel Core i7-14700K", slug: "intel-core-i7-14700k", description: "20-core unlocked processor delivering exceptional multi-threaded performance.", price: 23490, images: ["/products/cpus/i7-14700k.png"], categoryId: cpus.id, brand: "Intel", componentType: "CPU", socketType: "LGA1700", wattage: 125, isFeatured: true, rating: 4.7, reviewCount: 312, specs: { Cores: "20 (8P+12E)", Threads: "28", "Base Clock": "3.4 GHz", "Boost Clock": "5.6 GHz", TDP: "125W" },
    }}),
    prisma.product.create({ data: {
      name: "Intel Core i9-14900K", slug: "intel-core-i9-14900k", description: "24-core flagship desktop processor with the highest clock speeds.", price: 32990, images: ["/products/cpus/i9-14900k.png"], categoryId: cpus.id, brand: "Intel", componentType: "CPU", socketType: "LGA1700", wattage: 125, isNewArrival: true, rating: 4.8, reviewCount: 198, specs: { Cores: "24 (8P+16E)", Threads: "32", "Base Clock": "3.2 GHz", "Boost Clock": "6.0 GHz", TDP: "125W" },
    }}),
  ]);

  // GPUs (5)
  const gpuProducts = await Promise.all([
    prisma.product.create({ data: {
      name: "NVIDIA GeForce RTX 4060 Ti", slug: "nvidia-rtx-4060-ti", description: "Excellent 1080p and 1440p gaming with DLSS 3 and ray tracing support.", price: 22990, salePrice: 20490, images: ["/products/gpus/rtx-4060-ti.png"], categoryId: gpus.id, brand: "NVIDIA", componentType: "GPU", wattage: 160, isFlashDeal: true, rating: 4.5, reviewCount: 523, specs: { VRAM: "8GB GDDR6X", "Boost Clock": "2535 MHz", "CUDA Cores": "4352", TDP: "160W" },
    }}),
    prisma.product.create({ data: {
      name: "NVIDIA GeForce RTX 4070 Ti Super", slug: "nvidia-rtx-4070-ti-super", description: "Premium 1440p and entry 4K gaming GPU with 16GB VRAM and DLSS 3.", price: 44990, salePrice: 36990, images: ["/products/gpus/rtx-4070-ti-super.png"], categoryId: gpus.id, brand: "NVIDIA", componentType: "GPU", wattage: 285, isFeatured: true, isFlashDeal: true, isNewArrival: true, rating: 4.8, reviewCount: 387, specs: { VRAM: "16GB GDDR6X", "Boost Clock": "2610 MHz", "CUDA Cores": "8448", TDP: "285W" },
    }}),
    prisma.product.create({ data: {
      name: "NVIDIA GeForce RTX 4080 Super", slug: "nvidia-rtx-4080-super", description: "High-end 4K gaming GPU delivering outstanding performance in all titles.", price: 56990, images: ["/products/gpus/rtx-4080-super.png"], categoryId: gpus.id, brand: "NVIDIA", componentType: "GPU", wattage: 320, isNewArrival: true, rating: 4.9, reviewCount: 201, specs: { VRAM: "16GB GDDR6X", "Boost Clock": "2550 MHz", "CUDA Cores": "10240", TDP: "320W" },
    }}),
    prisma.product.create({ data: {
      name: "AMD Radeon RX 7800 XT", slug: "amd-rx-7800-xt", description: "Powerful 1440p gaming GPU with 16GB VRAM at an excellent price-to-performance.", price: 28990, salePrice: 25990, images: ["/products/gpus/rx-7800-xt.png"], categoryId: gpus.id, brand: "AMD", componentType: "GPU", wattage: 263, isFeatured: true, isFlashDeal: true, rating: 4.6, reviewCount: 445, specs: { VRAM: "16GB GDDR6", "Boost Clock": "2430 MHz", "Stream Processors": "3840", TDP: "263W" },
    }}),
    prisma.product.create({ data: {
      name: "AMD Radeon RX 7900 XTX", slug: "amd-rx-7900-xtx", description: "AMD's flagship GPU for 4K gaming with 24GB of VRAM.", price: 52990, images: ["/products/gpus/rx-7900-xtx.png"], categoryId: gpus.id, brand: "AMD", componentType: "GPU", wattage: 355, rating: 4.7, reviewCount: 278, specs: { VRAM: "24GB GDDR6", "Boost Clock": "2500 MHz", "Stream Processors": "6144", TDP: "355W" },
    }}),
  ]);

  // Motherboards (5)
  await Promise.all([
    prisma.product.create({ data: {
      name: "ASUS ROG Strix B650E-F", slug: "asus-rog-strix-b650e-f", description: "ATX AM5 motherboard with PCIe 5.0, DDR5, and robust power delivery.", price: 15490, images: ["/products/motherboards/asus-b650e-f.png"], categoryId: mobos.id, brand: "ASUS", componentType: "MOTHERBOARD", socketType: "AM5", memoryType: "DDR5", formFactor: "ATX", wattage: 0, isFeatured: true, rating: 4.7, reviewCount: 234, specs: { Socket: "AM5", Chipset: "B650E", "Memory Slots": "4x DDR5", "M.2 Slots": "3" },
    }}),
    prisma.product.create({ data: {
      name: "MSI MAG B650 Tomahawk", slug: "msi-mag-b650-tomahawk", description: "Feature-rich ATX AM5 motherboard with excellent VRM and connectivity.", price: 12490, salePrice: 10490, images: ["/products/motherboards/msi-b650-tomahawk.png"], categoryId: mobos.id, brand: "MSI", componentType: "MOTHERBOARD", socketType: "AM5", memoryType: "DDR5", formFactor: "ATX", wattage: 0, isFlashDeal: true, rating: 4.6, reviewCount: 312, specs: { Socket: "AM5", Chipset: "B650", "Memory Slots": "4x DDR5", "M.2 Slots": "2" },
    }}),
    prisma.product.create({ data: {
      name: "Gigabyte B650M Aorus Elite AX", slug: "gigabyte-b650m-aorus-elite-ax", description: "Compact mATX AM5 board with WiFi 6E and DDR5 support.", price: 9990, images: ["/products/motherboards/gigabyte-b650m-aorus.png"], categoryId: mobos.id, brand: "Gigabyte", componentType: "MOTHERBOARD", socketType: "AM5", memoryType: "DDR5", formFactor: "mATX", wattage: 0, rating: 4.5, reviewCount: 189, specs: { Socket: "AM5", Chipset: "B650", "Form Factor": "Micro-ATX", "Memory Slots": "2x DDR5" },
    }}),
    prisma.product.create({ data: {
      name: "MSI PRO Z790-A WiFi", slug: "msi-pro-z790-a-wifi", description: "Intel LGA1700 ATX motherboard with DDR5, PCIe 5.0 and WiFi 6E.", price: 12990, images: ["/products/motherboards/msi-z790-a.png"], categoryId: mobos.id, brand: "MSI", componentType: "MOTHERBOARD", socketType: "LGA1700", memoryType: "DDR5", formFactor: "ATX", wattage: 0, rating: 4.6, reviewCount: 267, specs: { Socket: "LGA1700", Chipset: "Z790", "Memory Slots": "4x DDR5", "M.2 Slots": "4" },
    }}),
    prisma.product.create({ data: {
      name: "ASUS ROG Strix Z790-E Gaming", slug: "asus-rog-strix-z790-e", description: "Premium Intel LGA1700 ATX motherboard with top-tier power delivery and connectivity.", price: 22490, images: ["/products/motherboards/asus-z790-e.png"], categoryId: mobos.id, brand: "ASUS", componentType: "MOTHERBOARD", socketType: "LGA1700", memoryType: "DDR5", formFactor: "ATX", wattage: 0, isNewArrival: true, rating: 4.8, reviewCount: 156, specs: { Socket: "LGA1700", Chipset: "Z790", "Memory Slots": "4x DDR5", "M.2 Slots": "5" },
    }}),
  ]);

  // RAM (4)
  await Promise.all([
    prisma.product.create({ data: {
      name: "Corsair Vengeance 16GB DDR5-5600", slug: "corsair-vengeance-16gb-ddr5-5600", description: "High-performance DDR5 memory kit optimized for Intel and AMD platforms.", price: 2990, images: ["/products/ram/corsair-vengeance-16gb.png"], categoryId: ram.id, brand: "Corsair", componentType: "RAM", memoryType: "DDR5", wattage: 5, rating: 4.5, reviewCount: 412, specs: { Capacity: "16GB (2x8GB)", Speed: "DDR5-5600", Latency: "CL36", Voltage: "1.25V" },
    }}),
    prisma.product.create({ data: {
      name: "Corsair Vengeance 32GB DDR5-6000", slug: "corsair-vengeance-32gb-ddr5-6000", description: "32GB dual-channel DDR5 kit at 6000MT/s for demanding workloads.", price: 4990, salePrice: 4490, images: ["/products/ram/corsair-vengeance-32gb.png"], categoryId: ram.id, brand: "Corsair", componentType: "RAM", memoryType: "DDR5", wattage: 5, isFeatured: true, isFlashDeal: true, rating: 4.7, reviewCount: 567, specs: { Capacity: "32GB (2x16GB)", Speed: "DDR5-6000", Latency: "CL36", Voltage: "1.35V" },
    }}),
    prisma.product.create({ data: {
      name: "G.Skill Trident Z5 RGB 32GB DDR5-6400", slug: "gskill-trident-z5-rgb-32gb", description: "Premium RGB DDR5 memory with tight timings for enthusiast builds.", price: 6990, images: ["/products/ram/gskill-trident-z5-32gb.png"], categoryId: ram.id, brand: "G.Skill", componentType: "RAM", memoryType: "DDR5", wattage: 5, isNewArrival: true, rating: 4.8, reviewCount: 234, specs: { Capacity: "32GB (2x16GB)", Speed: "DDR5-6400", Latency: "CL32", Voltage: "1.35V" },
    }}),
    prisma.product.create({ data: {
      name: "G.Skill Trident Z5 64GB DDR5-6000", slug: "gskill-trident-z5-64gb", description: "Massive 64GB DDR5 kit for workstation and content creation builds.", price: 10990, images: ["/products/ram/gskill-trident-z5-64gb.png"], categoryId: ram.id, brand: "G.Skill", componentType: "RAM", memoryType: "DDR5", wattage: 5, rating: 4.6, reviewCount: 98, specs: { Capacity: "64GB (2x32GB)", Speed: "DDR5-6000", Latency: "CL36", Voltage: "1.35V" },
    }}),
  ]);

  // Storage (4)
  await Promise.all([
    prisma.product.create({ data: {
      name: "Samsung 990 Pro 500GB NVMe", slug: "samsung-990-pro-500gb", description: "High-speed PCIe 4.0 NVMe SSD with up to 7,450 MB/s read speeds.", price: 3490, images: ["/products/storage/samsung-990-pro-500gb.png"], categoryId: storage.id, brand: "Samsung", componentType: "STORAGE", wattage: 5, rating: 4.6, reviewCount: 312, specs: { Capacity: "500GB", Interface: "PCIe 4.0 NVMe", "Read Speed": "7,450 MB/s", "Write Speed": "5,000 MB/s" },
    }}),
    prisma.product.create({ data: {
      name: "Samsung 990 Pro 1TB NVMe", slug: "samsung-990-pro-1tb", description: "Premium 1TB NVMe SSD delivering outstanding sequential and random performance.", price: 5990, salePrice: 5490, images: ["/products/storage/samsung-990-pro-1tb.png"], categoryId: storage.id, brand: "Samsung", componentType: "STORAGE", wattage: 5, isFeatured: true, isFlashDeal: true, rating: 4.8, reviewCount: 567, specs: { Capacity: "1TB", Interface: "PCIe 4.0 NVMe", "Read Speed": "7,450 MB/s", "Write Speed": "6,900 MB/s" },
    }}),
    prisma.product.create({ data: {
      name: "Samsung 990 Pro 2TB NVMe", slug: "samsung-990-pro-2tb", description: "2TB NVMe SSD for users who need ample high-speed storage.", price: 9990, images: ["/products/storage/samsung-990-pro-2tb.png"], categoryId: storage.id, brand: "Samsung", componentType: "STORAGE", wattage: 5, rating: 4.7, reviewCount: 234, specs: { Capacity: "2TB", Interface: "PCIe 4.0 NVMe", "Read Speed": "7,450 MB/s", "Write Speed": "6,900 MB/s" },
    }}),
    prisma.product.create({ data: {
      name: "Seagate Barracuda 2TB HDD", slug: "seagate-barracuda-2tb", description: "Reliable 2TB 7200RPM hard drive for mass storage and backups.", price: 2990, images: ["/products/storage/seagate-barracuda-2tb.png"], categoryId: storage.id, brand: "Seagate", componentType: "STORAGE", wattage: 10, rating: 4.3, reviewCount: 890, specs: { Capacity: "2TB", Interface: "SATA III", RPM: "7200", Cache: "256MB" },
    }}),
  ]);

  // PSUs (4)
  await Promise.all([
    prisma.product.create({ data: {
      name: "Corsair RM550x 550W 80+ Gold", slug: "corsair-rm550x-550w", description: "Fully modular 550W PSU with 80+ Gold efficiency and silent operation.", price: 4990, images: ["/products/psus/corsair-rm550x.png"], categoryId: psus.id, brand: "Corsair", componentType: "PSU", wattage: 550, rating: 4.6, reviewCount: 345, specs: { Wattage: "550W", Efficiency: "80+ Gold", Modular: "Fully", Fan: "120mm" },
    }}),
    prisma.product.create({ data: {
      name: "Corsair RM750x 750W 80+ Gold", slug: "corsair-rm750x-750w", description: "750W fully modular PSU ideal for mid-range to high-end gaming builds.", price: 5990, salePrice: 5490, images: ["/products/psus/corsair-rm750x.png"], categoryId: psus.id, brand: "Corsair", componentType: "PSU", wattage: 750, isFeatured: true, isFlashDeal: true, rating: 4.8, reviewCount: 678, specs: { Wattage: "750W", Efficiency: "80+ Gold", Modular: "Fully", Fan: "135mm" },
    }}),
    prisma.product.create({ data: {
      name: "EVGA SuperNOVA 650 G7 650W", slug: "evga-supernova-650-g7", description: "Compact 650W 80+ Gold fully modular PSU with 10-year warranty.", price: 4990, images: ["/products/psus/evga-supernova-650.png"], categoryId: psus.id, brand: "EVGA", componentType: "PSU", wattage: 650, rating: 4.5, reviewCount: 234, specs: { Wattage: "650W", Efficiency: "80+ Gold", Modular: "Fully", Fan: "120mm" },
    }}),
    prisma.product.create({ data: {
      name: "Corsair RM850x 850W 80+ Gold", slug: "corsair-rm850x-850w", description: "850W powerhouse for high-end builds with RTX 4080/4090 GPUs.", price: 7990, images: ["/products/psus/corsair-rm850x.png"], categoryId: psus.id, brand: "Corsair", componentType: "PSU", wattage: 850, isNewArrival: true, rating: 4.9, reviewCount: 432, specs: { Wattage: "850W", Efficiency: "80+ Gold", Modular: "Fully", Fan: "135mm" },
    }}),
  ]);

  // Cases (4)
  await Promise.all([
    prisma.product.create({ data: {
      name: "NZXT H5 Flow", slug: "nzxt-h5-flow", description: "ATX mid-tower case with excellent airflow and clean cable management.", price: 5290, images: ["/products/cases/nzxt-h5-flow.png"], categoryId: cases.id, brand: "NZXT", componentType: "CASE", formFactor: "ATX", wattage: 0, isFeatured: true, rating: 4.6, reviewCount: 456, specs: { "Form Factor": "ATX Mid-Tower", "GPU Clearance": "365mm", "CPU Cooler": "165mm", "Drive Bays": "2x 3.5\", 2x 2.5\"" },
    }}),
    prisma.product.create({ data: {
      name: "Corsair 4000D Airflow", slug: "corsair-4000d-airflow", description: "High-airflow ATX mid-tower with tempered glass and spacious interior.", price: 5790, images: ["/products/cases/corsair-4000d.png"], categoryId: cases.id, brand: "Corsair", componentType: "CASE", formFactor: "ATX", wattage: 0, rating: 4.7, reviewCount: 789, specs: { "Form Factor": "ATX Mid-Tower", "GPU Clearance": "360mm", "CPU Cooler": "170mm", "Included Fans": "2x 120mm" },
    }}),
    prisma.product.create({ data: {
      name: "Lian Li Lancool III", slug: "lian-li-lancool-iii", description: "Premium ATX case with reversible layout and superior airflow design.", price: 8490, images: ["/products/cases/lian-li-lancool-iii.png"], categoryId: cases.id, brand: "Lian Li", componentType: "CASE", formFactor: "ATX", wattage: 0, isNewArrival: true, rating: 4.8, reviewCount: 321, specs: { "Form Factor": "ATX Full-Tower", "GPU Clearance": "420mm", "CPU Cooler": "187mm", "Included Fans": "3x 140mm" },
    }}),
    prisma.product.create({ data: {
      name: "Cooler Master NR200P Max", slug: "cooler-master-nr200p-max", description: "Compact mATX/ITX case with included AIO and PSU for SFF builds.", price: 10990, images: ["/products/cases/cooler-master-nr200p.png"], categoryId: cases.id, brand: "Cooler Master", componentType: "CASE", formFactor: "mATX", wattage: 0, rating: 4.5, reviewCount: 167, specs: { "Form Factor": "Mini-ITX / mATX", "GPU Clearance": "336mm", "Included": "280mm AIO + 850W PSU" },
    }}),
  ]);

  // Coolers (3)
  await Promise.all([
    prisma.product.create({ data: {
      name: "Noctua NH-D15", slug: "noctua-nh-d15", description: "Premium dual-tower air cooler with near-silent operation and top-tier cooling.", price: 6490, images: ["/products/coolers/noctua-nh-d15.png"], categoryId: coolers.id, brand: "Noctua", componentType: "COOLER", socketType: "AM5, LGA1700", wattage: 0, isFeatured: true, rating: 4.9, reviewCount: 1234, specs: { Type: "Air Cooler", Fans: "2x 140mm", Height: "165mm", TDP: "250W+" },
    }}),
    prisma.product.create({ data: {
      name: "Corsair iCUE H150i Elite", slug: "corsair-icue-h150i-elite", description: "360mm AIO liquid cooler with RGB fans and excellent thermal performance.", price: 10490, salePrice: 9490, images: ["/products/coolers/corsair-h150i.png"], categoryId: coolers.id, brand: "Corsair", componentType: "COOLER", socketType: "AM5, LGA1700", wattage: 0, isFlashDeal: true, rating: 4.7, reviewCount: 567, specs: { Type: "AIO Liquid Cooler", Radiator: "360mm", Fans: "3x 120mm", TDP: "300W+" },
    }}),
    prisma.product.create({ data: {
      name: "be quiet! Dark Rock Pro 5", slug: "be-quiet-dark-rock-pro-5", description: "High-performance dual-tower air cooler with virtually silent operation.", price: 4990, images: ["/products/coolers/be-quiet-dark-rock-pro-5.png"], categoryId: coolers.id, brand: "be quiet!", componentType: "COOLER", socketType: "AM5, LGA1700", wattage: 0, rating: 4.8, reviewCount: 345, specs: { Type: "Air Cooler", Fans: "2x 120mm", Height: "168mm", TDP: "270W" },
    }}),
  ]);

  // Coupons
  await prisma.coupon.create({
    data: { code: "WELCOME10", discountPercent: 10, isActive: true },
  });
  await prisma.coupon.create({
    data: { code: "BUILD15", discountPercent: 15, isActive: true },
  });

  // Prebuilt Builds
  await prisma.prebuiltBuild.create({
    data: {
      name: "Budget Build",
      description: "Great entry-level gaming PC for 1080p gaming on a budget.",
      price: 39990,
      tier: "BUDGET",
      products: { connect: [{ id: cpuProducts[0].id }, { id: gpuProducts[0].id }] },
    },
  });
  await prisma.prebuiltBuild.create({
    data: {
      name: "The Sweet Spot",
      description: "Our recommended build. Excellent 1440p performance for most gamers.",
      price: 79990,
      tier: "MIDRANGE",
      products: { connect: [{ id: cpuProducts[1].id }, { id: gpuProducts[1].id }] },
    },
  });
  await prisma.prebuiltBuild.create({
    data: {
      name: "High-End Build",
      description: "Premium 4K gaming rig for enthusiasts who want the best.",
      price: 184990,
      tier: "HIGHEND",
      products: { connect: [{ id: cpuProducts[2].id }, { id: gpuProducts[2].id }] },
    },
  });

  console.log("Seed complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
