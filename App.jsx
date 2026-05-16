import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bus,
  CalendarDays,
  Gauge,
  Handshake,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Pencil,
  Phone,
  Search,
  Trash2,
  Upload,
  Users,
  X,
} from "lucide-react";

const API_BASE =
  import.meta.env.VITE_API_BASE ||
  (typeof window !== "undefined" && window.location.port === "5173" ? "http://localhost:4000" : "");

const CONTACT = {
  company: "Gourmet Travel s.r.o.",
  street: "Jiráskova 241/41",
  city: "602 00 Brno-Veveří",
  ico: "08004358",
  dic: "CZ08004358",
  bank: "CZ 123-9586570297/0100",
  email: "sikola@ck-kobra.cz",
  phone: "+420 608 251 067",
  phoneHref: "tel:+420608251067",
};

const GDPR_CONSENT_VERSION = "autobusy-cz-lead-form-v1";
const NEWSLETTER_CONSENT_VERSION = "autobusy-cz-new-listing-alerts-v1";
const WHATSAPP_MESSAGE = "Dobrý den, mám zájem o prodej nebo koupi autobusu přes Autobusy.cz.";
const WHATSAPP_LINK = `https://wa.me/420608251067?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

const fallbackListings = [
  {
    id: "demo-1",
    title: "Mercedes-Benz Tourismo RHD",
    subtitle: "Zájezdový autobus • Euro 6",
    year: "2019",
    mileage: "245 000 km",
    seats: "49 míst",
    price: "2 490 000 Kč",
    imageUrl: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1200&q=82",
  },
  {
    id: "demo-2",
    title: "Scania Touring HD",
    subtitle: "Coach • automat",
    year: "2018",
    mileage: "312 000 km",
    seats: "53 míst",
    price: "2 190 000 Kč",
    imageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=82",
  },
  {
    id: "demo-3",
    title: "MAN Lion's Coach",
    subtitle: "Zájezdový autobus • ověřeno",
    year: "2016",
    mileage: "420 000 km",
    seats: "61 míst",
    price: "1 890 000 Kč",
    imageUrl: "https://images.unsplash.com/photo-1581262177000-8139a463e531?auto=format&fit=crop&w=1200&q=82",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.06 } } };

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function apiUrl(path) {
  return `${API_BASE}${path}`;
}

async function apiFetch(path, options = {}) {
  const res = await fetch(apiUrl(path), {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Požadavek se nepodařil.");
  return data;
}

function assetUrl(url) {
  if (!url) return "";
  if (url.startsWith("/uploads/")) return `${API_BASE}${url}`;
  return url;
}

function Logo({ dark = true }) {
  return (
    <div className="flex items-baseline gap-1 tracking-[-0.055em]">
      <span className={cn("text-2xl font-black", dark ? "text-[#0a1020]" : "text-white")}>Autobusy</span>
      <span className="text-2xl font-black text-[#e65a26]">.cz</span>
    </div>
  );
}

function Button({ children, href, variant = "primary", className = "", type = "button", disabled = false, ...props }) {
  const variants = {
    primary: "bg-[#e65a26] text-white hover:bg-[#ce4e20] shadow-[0_20px_50px_rgba(230,90,38,0.26)]",
    dark: "bg-[#0a1020] text-white hover:bg-black shadow-[0_20px_50px_rgba(10,16,32,0.20)]",
    light: "bg-white text-[#0a1020] hover:bg-[#f8f4ed] ring-1 ring-black/10 shadow-sm",
    ghost: "bg-transparent text-[#0a1020] hover:bg-black/[0.04] ring-1 ring-black/10",
    whatsapp: "bg-[#25D366] text-white hover:bg-[#1fb85a] shadow-[0_16px_42px_rgba(37,211,102,0.22)]",
  };

  const inner = (
    <motion.span
      whileHover={disabled ? undefined : { y: -2 }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-black transition duration-300",
        variants[variant],
        disabled && "cursor-not-allowed opacity-60",
        className
      )}
    >
      {children}
    </motion.span>
  );

  if (href) return <a href={href} {...props}>{inner}</a>;
  return <button type={type} disabled={disabled} {...props}>{inner}</button>;
}

function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const nav = [
    ["Nabídka", "#nabidka"],
    ["Odběr", "#odber"],
    ["Služby", "#sluzby"],
    ["Kontakt", "#kontakt"],
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
      <motion.div
        animate={{
          backgroundColor: scrolled ? "rgba(255,252,247,0.94)" : "rgba(255,252,247,0.76)",
          boxShadow: scrolled ? "0 24px 80px rgba(10,16,32,0.14)" : "0 16px 50px rgba(10,16,32,0.07)",
        }}
        transition={{ duration: 0.24 }}
        className="mx-auto flex max-w-7xl items-center justify-between rounded-[1.6rem] border border-white/80 px-4 py-3 backdrop-blur-2xl"
      >
        <a href="/" aria-label="Autobusy.cz úvod" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0a1020] text-white">
            <Bus className="h-5 w-5" />
          </div>
          <Logo />
        </a>

        <nav className="hidden items-center gap-8 lg:flex">
          {nav.map(([label, href]) => (
            <a key={label} href={href} className="text-sm font-black text-[#0a1020]/60 transition hover:text-[#0a1020]">
              {label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a href={CONTACT.phoneHref} className="text-sm font-black text-[#0a1020]">{CONTACT.phone}</a>
          <Button href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" variant="whatsapp" className="px-4 py-3">
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </Button>
          <Button href="#kontakt" className="px-5 py-3">Nezávazně poptat</Button>
        </div>

        <button onClick={() => setOpen(!open)} className="rounded-full bg-black/[0.05] p-3 lg:hidden" aria-label="Menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </motion.div>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="mx-auto mt-3 max-w-7xl rounded-[1.5rem] bg-[#fffcf7]/96 p-3 shadow-2xl shadow-black/10 backdrop-blur-2xl lg:hidden"
        >
          <div className="grid gap-2">
            {nav.map(([label, href]) => (
              <a key={label} href={href} onClick={() => setOpen(false)} className="rounded-2xl bg-black/[0.04] px-4 py-3 text-sm font-black text-[#0a1020]/70">
                {label}
              </a>
            ))}
            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="rounded-2xl bg-[#25D366] px-4 py-3 text-center text-sm font-black text-white">
              WhatsApp zpráva
            </a>
          </div>
        </motion.div>
      )}
    </header>
  );
}

function RouteBusIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 138 82" className={className} fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="routeBusBody" x1="16" y1="12" x2="122" y2="68" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" />
          <stop offset="1" stopColor="#eef3fb" />
        </linearGradient>
        <linearGradient id="routeBusGlass" x1="24" y1="18" x2="106" y2="46" gradientUnits="userSpaceOnUse">
          <stop stopColor="#dff0ff" />
          <stop offset="1" stopColor="#b8d7ff" />
        </linearGradient>
      </defs>
      <rect x="10" y="18" width="108" height="38" rx="14" fill="url(#routeBusBody)" stroke="#0a1020" strokeWidth="4" />
      <path d="M118 28 H124 C128 28 131 31 131 35 V47 C131 51 128 54 124 54 H118" stroke="#0a1020" strokeWidth="4" strokeLinecap="round" />
      <path d="M10 30 H4" stroke="#0a1020" strokeWidth="4" strokeLinecap="round" />
      <path d="M24 26 H48 V43 H20 V31 C20 28 21.8 26 24 26Z" fill="url(#routeBusGlass)" stroke="#0a1020" strokeWidth="3" />
      <path d="M55 26 H82 V43 H55 Z" fill="url(#routeBusGlass)" stroke="#0a1020" strokeWidth="3" />
      <path d="M89 26 H100 C106 26 111 30.5 113 36.5L115 43H89V26Z" fill="url(#routeBusGlass)" stroke="#0a1020" strokeWidth="3" />
      <path d="M18 50 H111" stroke="#e65a26" strokeWidth="4" strokeLinecap="round" />
      <circle cx="34" cy="60" r="10" fill="#0a1020" />
      <circle cx="96" cy="60" r="10" fill="#0a1020" />
      <circle cx="34" cy="60" r="4" fill="#fff" />
      <circle cx="96" cy="60" r="4" fill="#fff" />
      <circle cx="16" cy="48" r="3" fill="#fff0b8" />
      <circle cx="112" cy="48" r="3" fill="#ffd7c2" />
    </svg>
  );
}

function AnimatedHeroPanel() {
  return (
    <motion.div variants={fadeUp} className="relative">
      <div className="absolute inset-0 rounded-[3rem] bg-[#0a1020]/10 blur-2xl" />

      <div className="relative overflow-hidden rounded-[3rem] bg-white p-5 shadow-[0_36px_120px_rgba(10,16,32,0.14)] ring-1 ring-black/5 sm:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_18%,rgba(230,90,38,0.12),transparent_25%),radial-gradient(circle_at_84%_24%,rgba(37,99,235,0.10),transparent_28%),linear-gradient(180deg,#ffffff_0%,#f8fbff_58%,#fff7f1_100%)]" />
        <div className="absolute inset-0 opacity-[0.14] bg-[linear-gradient(rgba(10,16,32,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(10,16,32,0.10)_1px,transparent_1px)] bg-[size:36px_36px]" />

        <div className="relative z-20">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-xs font-black uppercase tracking-[0.22em] text-[#e65a26]">Autobusy.cz jako prostředník</div>
              <div className="mt-2 text-2xl font-black tracking-[-0.04em] text-[#0a1020] sm:text-3xl">
                Jedna služba pro prodej i nákup.
              </div>
            </div>
            <div className="rounded-full bg-white/82 px-4 py-2 text-xs font-black text-[#0a1020]/50 ring-1 ring-black/5 backdrop-blur-xl">
              prodávající ↔ Autobusy.cz ↔ kupující
            </div>
          </div>

          <div className="grid gap-5">
            <ProcessRoad
              label="Chci prodat autobus"
              title="Z nabídky uděláme prodej"
              left="Prodávající"
              mid="Autobusy.cz"
              right="Kupující"
              from="autobus k prodeji"
              center="najdeme kupce"
              to="prodaný autobus"
              direction="ltr"
              cta="#kontakt"
              ctaText="Chci prodat"
              color="orange"
            />
            <ProcessRoad
              label="Chci koupit autobus"
              title="Z poptávky najdeme vhodné možnosti"
              left="Možnosti"
              mid="Autobusy.cz"
              right="Kupující"
              from="nabídneme vozy"
              center="vyhledáme"
              to="poptávka"
              direction="rtl"
              cta="#nabidka"
              ctaText="Chci koupit"
              color="dark"
            />

            <div className="rounded-[1.8rem] bg-[#0a1020] p-5 text-white shadow-[0_26px_70px_rgba(10,16,32,0.24)] sm:p-6">
              <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
                <div>
                  <div className="text-xs font-black uppercase tracking-[0.18em] text-white/36">Jedna služba pro obě strany</div>
                  <div className="mt-2 text-lg font-black leading-7 sm:text-xl">
                    Prodávajícím najdeme kupce. Kupujícím najdeme vhodný autobus.
                  </div>
                  <div className="mt-2 text-sm font-semibold text-white/58">
                    Zpracujeme nabídku, vyhledáme protistranu a obchod dovedeme do cíle.
                  </div>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <a href="#kontakt" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#e65a26] px-5 py-3 text-sm font-black text-white transition hover:bg-[#ce4e20]">
                    Chci prodat <ArrowRight className="h-4 w-4" />
                  </a>
                  <a href="#nabidka" className="inline-flex items-center justify-center gap-2 rounded-full bg-white/10 px-5 py-3 text-sm font-black text-white ring-1 ring-white/15 transition hover:bg-white/16">
                    Chci koupit <Search className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ProcessRoad({ label, title, left, mid, right, from, center, to, direction, cta, ctaText, color }) {
  const isRtl = direction === "rtl";
  const barColor = color === "orange" ? "bg-[#e65a26]" : "bg-[#0a1020]";
  const iconClass = color === "orange" ? "bg-white text-[#0a1020]" : "bg-[#0a1020] text-white";

  return (
    <div className="rounded-[2rem] bg-white/92 p-5 shadow-[0_22px_74px_rgba(10,16,32,0.10)] ring-1 ring-black/5 backdrop-blur-2xl">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <div className={cn("text-xs font-black uppercase tracking-[0.18em]", color === "orange" ? "text-[#e65a26]" : "text-[#0a1020]/45")}>
            {label}
          </div>
          <div className="mt-1 text-lg font-black text-[#0a1020]">{title}</div>
        </div>
        <a href={cta} className={cn("hidden rounded-full px-4 py-2 text-xs font-black text-white sm:inline-flex", color === "orange" ? "bg-[#e65a26]" : "bg-[#0a1020]")}>
          {ctaText}
        </a>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center text-[11px] font-black text-[#0a1020]/50">
        <div className="rounded-2xl bg-[#f8f4ed] px-2 py-3">{left}</div>
        <div className="rounded-2xl bg-[#fff1e9] px-2 py-3 text-[#e65a26]">{mid}</div>
        <div className="rounded-2xl bg-[#f8f4ed] px-2 py-3">{right}</div>
      </div>

      <div className="relative mt-4 h-24">
        <div className="absolute left-0 right-0 top-8 h-4 rounded-full bg-[#ebe7df] ring-1 ring-black/5" />
        <div className="absolute left-3 right-3 top-[37px] h-[2px] rounded-full bg-white/80" />
        <motion.div
          className={cn("absolute top-8 h-4 rounded-full", barColor, isRtl ? "right-0" : "left-0")}
          animate={{ width: ["0%", "50%", "50%", "100%", "0%"] }}
          transition={{ duration: isRtl ? 8.8 : 8.4, times: [0, 0.42, 0.58, 0.92, 1], repeat: Infinity, ease: "easeInOut", delay: isRtl ? 0.7 : 0 }}
        />
        <div className="absolute left-0 top-5 h-10 w-10 rounded-full border-4 border-white bg-[#0a1020] shadow-md" />
        <div className="absolute left-1/2 top-4 h-12 w-12 -translate-x-1/2 rounded-full border-4 border-white bg-[#e65a26] shadow-md" />
        <div className="absolute right-0 top-5 h-10 w-10 rounded-full border-4 border-white bg-[#0a1020] shadow-md" />

        <motion.div
          className={cn("absolute top-0 z-20 flex h-16 w-16 items-center justify-center rounded-[1.35rem] shadow-[0_20px_56px_rgba(10,16,32,0.18)] ring-1 ring-black/8", iconClass, isRtl ? "right-0" : "left-0")}
          animate={isRtl
            ? { right: ["0%", "calc(50% - 32px)", "calc(50% - 32px)", "calc(100% - 64px)", "0%"], y: [0, 7, 0, 7, 0] }
            : { left: ["0%", "calc(50% - 32px)", "calc(50% - 32px)", "calc(100% - 64px)", "0%"], y: [0, -7, 0, -7, 0] }}
          transition={{ duration: isRtl ? 8.8 : 8.4, times: [0, 0.42, 0.58, 0.92, 1], repeat: Infinity, ease: "easeInOut", delay: isRtl ? 0.7 : 0 }}
        >
          {isRtl ? <Search className="h-7 w-7 text-[#f1a37f]" /> : <RouteBusIcon className="h-11 w-14" />}
        </motion.div>

        <div className="absolute left-0 top-[72px] text-[11px] font-black text-[#0a1020]/45">{from}</div>
        <div className="absolute left-1/2 top-[72px] -translate-x-1/2 text-[11px] font-black text-[#e65a26]">{center}</div>
        <div className="absolute right-0 top-[72px] text-right text-[11px] font-black text-[#0a1020]/45">{to}</div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-[#fffcf7] text-[#0a1020]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_22%,rgba(230,90,38,0.12),transparent_28%),radial-gradient(circle_at_84%_28%,rgba(18,42,82,0.10),transparent_32%)]" />
      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-white to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-32 sm:px-6 lg:px-8 lg:pb-24 lg:pt-36">
        <motion.div initial="hidden" animate="show" variants={stagger} className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <motion.div variants={fadeUp} className="text-xs font-black uppercase tracking-[0.28em] text-[#e65a26]">
              Prodej • nákup • zprostředkování autobusů
            </motion.div>
            <motion.h1 variants={fadeUp} className="mt-6 max-w-4xl text-5xl font-black leading-[0.9] tracking-[-0.075em] sm:text-7xl xl:text-[7rem]">
              Váš autobus prodáme.
              <span className="block text-[#e65a26]">Kupce najdeme.</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-7 max-w-2xl text-lg leading-8 text-[#0a1020]/62 sm:text-xl">
              Najdeme vhodného kupce pro váš autobus nebo vhodný autobus pro vaši poptávku. Nabídku zpracujeme, prověříme zájemce a obchod zprostředkujeme férově a přehledně.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-10 grid gap-3 sm:grid-cols-2">
              <a href="#kontakt" className="group rounded-[1.6rem] bg-[#0a1020] p-5 text-white transition hover:-translate-y-1">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-2xl font-black tracking-tight">Chci prodat</div>
                    <div className="mt-1 text-sm font-bold text-white/52">Nabídnout autobus k prodeji</div>
                  </div>
                  <Upload className="h-6 w-6 text-[#f1a37f]" />
                </div>
              </a>
              <a href="#nabidka" className="group rounded-[1.6rem] bg-white p-5 text-[#0a1020] shadow-[0_20px_60px_rgba(10,16,32,0.10)] ring-1 ring-black/10 transition hover:-translate-y-1">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-2xl font-black tracking-tight">Chci koupit</div>
                    <div className="mt-1 text-sm font-bold text-[#0a1020]/48">Najít vhodný autobus</div>
                  </div>
                  <Search className="h-6 w-6 text-[#e65a26]" />
                </div>
              </a>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button href={CONTACT.phoneHref} variant="light" className="px-5 py-3.5">
                <Phone className="h-4 w-4 text-[#e65a26]" /> {CONTACT.phone}
              </Button>
              <Button href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" variant="whatsapp" className="px-5 py-3.5">
                <MessageCircle className="h-4 w-4" /> Napsat WhatsApp
              </Button>
              <div className="text-sm font-bold text-[#0a1020]/45">Rychlá reakce • ČR i zahraničí • prověřené nabídky</div>
            </motion.div>
          </div>

          <AnimatedHeroPanel />
        </motion.div>
      </div>
    </section>
  );
}

function StatCard({ icon: Icon, value, suffix = "+", label, text, delay = 0 }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let frame;
    const duration = 1200;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    const timeout = setTimeout(() => { frame = requestAnimationFrame(tick); }, delay * 1000);
    return () => {
      clearTimeout(timeout);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [value, delay]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 22, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, delay }}
      whileHover={{ y: -5 }}
      className="group relative overflow-hidden rounded-[2rem] bg-white p-6 shadow-[0_18px_60px_rgba(10,16,32,0.08)] ring-1 ring-black/5"
    >
      <motion.div
        aria-hidden="true"
        animate={{ scale: [1, 1.18, 1], opacity: [0.08, 0.16, 0.08] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay }}
        className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#e65a26] blur-3xl"
      />
      <div className="relative flex items-start gap-5">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#fff1e9] text-[#e65a26] transition group-hover:bg-[#e65a26] group-hover:text-white">
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <div className="text-4xl font-black tracking-[-0.055em] text-[#0a1020] sm:text-5xl">{display}{suffix}</div>
          <div className="mt-2 text-base font-black text-[#0a1020]">{label}</div>
          <div className="mt-1 text-sm font-semibold leading-6 text-[#0a1020]/50">{text}</div>
        </div>
      </div>
    </motion.div>
  );
}

function StatsBand() {
  return (
    <section className="relative bg-white py-10 lg:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-3">
          <StatCard icon={CalendarDays} value={20} label="let zkušeností" text="Dlouhodobá praxe v prodeji a zprostředkování autobusů." delay={0} />
          <StatCard icon={Users} value={100} label="spokojených zákazníků" text="Osobní přístup, férové jednání a jasná komunikace." delay={0.12} />
          <StatCard icon={Bus} value={300} label="prodaných autobusů" text="Zkušenosti s autobusy z ČR i zahraničí." delay={0.24} />
        </div>
      </div>
    </section>
  );
}

function ListingCard({ vehicle, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay: index * 0.08, duration: 0.55 }}
      whileHover={{ y: -6 }}
      className="group overflow-hidden rounded-[1.6rem] bg-white shadow-sm ring-1 ring-black/10 transition hover:shadow-2xl hover:shadow-black/10"
    >
      <div className="relative h-56 overflow-hidden bg-[#f4efe7]">
        <img src={assetUrl(vehicle.imageUrl)} alt={vehicle.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" />
        {index === 0 && <div className="absolute left-4 top-4 rounded-full bg-[#e65a26] px-3 py-1.5 text-xs font-black uppercase tracking-wide text-white">Top nabídka</div>}
      </div>
      <div className="p-5">
        <div className="text-sm font-bold text-[#0a1020]/45">{vehicle.subtitle}</div>
        <h3 className="mt-1 text-xl font-black tracking-tight text-[#0a1020]">{vehicle.title}</h3>
        <div className="mt-4 flex flex-wrap gap-3 text-xs font-bold text-[#0a1020]/48">
          <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" /> {vehicle.year}</span>
          <span className="inline-flex items-center gap-1.5"><Gauge className="h-3.5 w-3.5" /> {vehicle.mileage}</span>
          <span className="inline-flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> {vehicle.seats}</span>
        </div>
        <div className="mt-5 text-2xl font-black text-[#e65a26]">{vehicle.price}</div>
        <a href="#kontakt" className="mt-5 flex items-center justify-between rounded-full border border-black/10 px-4 py-3 text-sm font-black text-[#0a1020] transition hover:border-[#e65a26] hover:text-[#e65a26]">
          Zobrazit detail <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </motion.article>
  );
}

function Listings() {
  const [listings, setListings] = useState(fallbackListings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/api/listings")
      .then((data) => setListings(data.listings?.length ? data.listings : fallbackListings))
      .catch(() => setListings(fallbackListings))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="nabidka" className="bg-white py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} variants={stagger} className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <motion.div variants={fadeUp} className="text-xs font-black uppercase tracking-[0.26em] text-[#e65a26]">Aktuální nabídka</motion.div>
            <motion.h2 variants={fadeUp} className="mt-3 text-4xl font-black tracking-[-0.055em] text-[#0a1020] sm:text-6xl">Vybrané autobusy</motion.h2>
            <motion.p variants={fadeUp} className="mt-3 max-w-2xl text-base font-semibold leading-7 text-[#0a1020]/55">
              {loading ? "Načítám nabídku..." : "Inzeráty se plní z administrace webu."}
            </motion.p>
          </div>
          <motion.div variants={fadeUp}>
            <Button href="#kontakt" variant="ghost">Poptat podobný autobus <ArrowRight className="h-4 w-4" /></Button>
          </motion.div>
        </motion.div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {listings.map((vehicle, index) => <ListingCard key={vehicle.id} vehicle={vehicle} index={index} />)}
        </div>
      </div>
    </section>
  );
}

function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState("idle");

  async function handleSubmit(event) {
    event.preventDefault();
    if (website) return;
    if (!consent) {
      setStatus("consent-error");
      return;
    }

    const payload = {
      email,
      website,
      source: "autobusy.cz-new-listing-alerts",
      purpose: "Upozornění na nové inzeráty autobusů",
      marketingConsent: true,
      consentVersion: NEWSLETTER_CONSENT_VERSION,
      consentText: "Souhlas se zasíláním upozornění na nové inzeráty autobusů a souvisejících obchodních sdělení.",
      consentAt: new Date().toISOString(),
      status: "pending_double_opt_in",
      doubleOptInRequired: true,
      unsubscribeRequired: true,
      pageUrl: window.location.href,
      userAgent: navigator.userAgent,
    };

    setStatus("sending");
    try {
      await apiFetch("/api/newsletter/subscribe", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setStatus("success");
      setEmail("");
      setConsent(false);
    } catch (error) {
      setStatus("error");
    }
  }

  return (
    <section id="odber" className="relative overflow-hidden bg-[#0a1020] py-16 text-white lg:py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(230,90,38,0.22),transparent_26%),radial-gradient(circle_at_86%_40%,rgba(37,99,235,0.14),transparent_30%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 rounded-[2.4rem] bg-white/8 p-5 ring-1 ring-white/10 backdrop-blur-2xl sm:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white/62 ring-1 ring-white/10">
              <Mail className="h-4 w-4 text-[#f1a37f]" /> Upozornění na nové inzeráty
            </div>
            <h2 className="mt-5 text-4xl font-black tracking-[-0.055em] sm:text-6xl">
              Hledáte autobus? Dejte si hlídat nové nabídky.
            </h2>
            <p className="mt-5 max-w-2xl text-base font-semibold leading-7 text-white/58">
              Pošleme vám e-mail, když přidáme nový inzerát. Odběr je dobrovolný a můžete jej kdykoliv odvolat.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="rounded-[2rem] bg-white p-5 text-[#0a1020] shadow-2xl shadow-black/20 sm:p-6">
            <div className="hidden" aria-hidden="true">
              <input value={website} onChange={(event) => setWebsite(event.target.value)} tabIndex={-1} autoComplete="off" />
            </div>
            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <input
                required
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Váš e-mail"
                className="rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm font-bold outline-none transition focus:border-[#e65a26] focus:ring-4 focus:ring-[#e65a26]/10"
              />
              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#e65a26] px-6 py-4 text-sm font-black text-white shadow-[0_18px_45px_rgba(230,90,38,0.24)] transition hover:bg-[#ce4e20] disabled:cursor-wait disabled:opacity-60"
              >
                {status === "sending" ? "Odesílám..." : "Přihlásit odběr"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <label className="mt-4 flex items-start gap-3 text-xs font-bold leading-5 text-[#0a1020]/58">
              <input
                type="checkbox"
                checked={consent}
                onChange={(event) => setConsent(event.target.checked)}
                className="mt-1 h-4 w-4 rounded border-black/20 text-[#e65a26] focus:ring-[#e65a26]"
              />
              <span>
                Souhlasím se zasíláním upozornění na nové inzeráty autobusů a souvisejících obchodních sdělení. Souhlas mohu kdykoliv odvolat odhlašovacím odkazem v každém e-mailu. Po odeslání proběhne potvrzení e-mailu metodou double opt-in. Více v{" "}
                <a href="/ochrana-osobnich-udaju" className="text-[#e65a26] underline underline-offset-2">zásadách ochrany osobních údajů</a>.
              </span>
            </label>

            {status === "consent-error" && <div className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">Pro odběr je potřeba samostatný souhlas.</div>}
            {status === "success" && <div className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">Odběr je připravený. Zkontrolujte e-mail pro potvrzení.</div>}
            {status === "error" && <div className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">Odběr se nepodařilo uložit. Zkuste to prosím znovu.</div>}
          </form>
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section id="sluzby" className="bg-[#f4efe7] py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} className="text-xs font-black uppercase tracking-[0.26em] text-[#e65a26]">Jednoduchý postup</motion.div>
            <motion.h2 variants={fadeUp} className="mt-3 text-4xl font-black tracking-[-0.055em] text-[#0a1020] sm:text-6xl">Méně klikání. Více obchodu.</motion.h2>
          </motion.div>
          <div className="grid gap-4">
            {[
              ["01", "Pošlete nám autobus nebo poptávku", "Stačí základní údaje, kontakt a stručný popis."],
              ["02", "Připravíme správnou prezentaci", "Pomůžeme s nabídkou, cenou a oslovením vhodných zájemců."],
              ["03", "Propojíme prodávajícího a kupujícího", "Cílem je rychlý, přehledný a férový obchod."],
            ].map(([num, title, text], index) => (
              <motion.div
                key={num}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.5 }}
                className="rounded-[1.6rem] bg-white p-6 shadow-sm ring-1 ring-black/10"
              >
                <div className="flex gap-5">
                  <div className="text-sm font-black text-[#e65a26]">{num}</div>
                  <div>
                    <div className="text-xl font-black text-[#0a1020]">{title}</div>
                    <p className="mt-2 text-sm font-semibold leading-6 text-[#0a1020]/55">{text}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function LeadForm() {
  const [leadType, setLeadType] = useState("sell");
  const [status, setStatus] = useState("idle");
  const [form, setForm] = useState({ name: "", phone: "", email: "", busInfo: "", message: "", gdpr: false, website: "" });
  const isSell = leadType === "sell";
  const inputClass = "w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-bold outline-none transition focus:border-[#e65a26] focus:ring-4 focus:ring-[#e65a26]/10";

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (form.website) return;
    if (!form.gdpr) {
      setStatus("gdpr-error");
      return;
    }

    const payload = {
      leadType,
      source: "autobusy.cz-onepage",
      ...form,
      gdprConsent: true,
      gdprConsentVersion: GDPR_CONSENT_VERSION,
      gdprConsentAt: new Date().toISOString(),
      pageUrl: window.location.href,
      userAgent: navigator.userAgent,
    };

    setStatus("sending");
    try {
      await apiFetch("/api/leads", { method: "POST", body: JSON.stringify(payload) });
      setStatus("success");
      setForm({ name: "", phone: "", email: "", busInfo: "", message: "", gdpr: false, website: "" });
    } catch (error) {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-[1.8rem] bg-white p-5 shadow-sm ring-1 ring-black/10 sm:p-6">
      <div className="mb-5 grid grid-cols-2 rounded-full bg-[#f4efe7] p-1">
        <button type="button" onClick={() => setLeadType("sell")} className={cn("rounded-full px-4 py-3 text-sm font-black transition", isSell ? "bg-[#0a1020] text-white" : "text-[#0a1020]/55")}>Chci prodat</button>
        <button type="button" onClick={() => setLeadType("buy")} className={cn("rounded-full px-4 py-3 text-sm font-black transition", !isSell ? "bg-[#0a1020] text-white" : "text-[#0a1020]/55")}>Chci koupit</button>
      </div>

      <div className="hidden" aria-hidden="true"><input value={form.website} onChange={(e) => update("website", e.target.value)} tabIndex={-1} autoComplete="off" /></div>

      <div className="grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <input required className={inputClass} placeholder="Jméno a příjmení" value={form.name} onChange={(e) => update("name", e.target.value)} />
          <input required className={inputClass} placeholder="Telefon" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
        </div>
        <input required type="email" className={inputClass} placeholder="E-mail" value={form.email} onChange={(e) => update("email", e.target.value)} />
        <input required className={inputClass} placeholder={isSell ? "Jaký autobus chcete prodat?" : "Jaký autobus hledáte?"} value={form.busInfo} onChange={(e) => update("busInfo", e.target.value)} />
        <textarea className={cn(inputClass, "min-h-32 resize-none")} placeholder="Doplňující informace" value={form.message} onChange={(e) => update("message", e.target.value)} />

        <label className="flex items-start gap-3 text-xs font-bold leading-5 text-[#0a1020]/55">
          <input type="checkbox" checked={form.gdpr} onChange={(e) => update("gdpr", e.target.checked)} className="mt-1 h-4 w-4 rounded border-black/20 text-[#e65a26] focus:ring-[#e65a26]" />
          <span>Souhlasím se zpracováním osobních údajů dle zásad <a href="/ochrana-osobnich-udaju" className="text-[#e65a26] underline underline-offset-2">ochrany osobních údajů</a>.</span>
        </label>

        {status === "gdpr-error" && <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">Pro odeslání je nutné potvrdit souhlas se zpracováním osobních údajů.</div>}
        {status === "success" && <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">Poptávka byla uložena. Brzy se vám ozveme.</div>}
        {status === "error" && <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">Odeslání se nepodařilo. Zkuste to prosím znovu.</div>}

        <button type="submit" disabled={status === "sending"} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#e65a26] px-6 py-4 text-sm font-black text-white shadow-[0_18px_45px_rgba(230,90,38,0.24)] transition hover:bg-[#ce4e20] disabled:cursor-wait disabled:opacity-60">
          {status === "sending" ? "Odesílám..." : "Odeslat poptávku"} <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}

function Contact() {
  return (
    <section id="kontakt" className="bg-white py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 rounded-[2.4rem] bg-[#0a1020] p-5 text-white shadow-[0_34px_110px_rgba(10,16,32,0.18)] lg:grid-cols-[0.85fr_1.15fr] lg:p-8">
          <div className="p-4 sm:p-6">
            <div className="text-xs font-black uppercase tracking-[0.26em] text-[#f1a37f]">Kontakt</div>
            <h2 className="mt-4 text-4xl font-black tracking-[-0.055em] sm:text-6xl">Ozvěte se. Najdeme cestu.</h2>
            <p className="mt-5 text-lg font-semibold leading-8 text-white/58">Prodej, nákup nebo inzerce autobusu. Stačí krátká zpráva nebo telefonát.</p>
            <div className="mt-8 grid gap-4 text-sm font-bold text-white/72">
              <a href={CONTACT.phoneHref} className="flex items-center gap-3"><Phone className="h-5 w-5 text-[#f1a37f]" /> {CONTACT.phone}</a>
              <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3"><MessageCircle className="h-5 w-5 text-[#25D366]" /> WhatsApp zpráva</a>
              <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-3"><Mail className="h-5 w-5 text-[#f1a37f]" /> {CONTACT.email}</a>
              <div className="flex items-start gap-3"><MapPin className="mt-0.5 h-5 w-5 text-[#f1a37f]" /> <span>{CONTACT.company}<br />{CONTACT.street}<br />{CONTACT.city}</span></div>
            </div>
          </div>
          <LeadForm />
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#fffcf7] py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 border-t border-black/10 pt-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo />
            <p className="mt-4 text-sm font-semibold leading-6 text-[#0a1020]/50">Specializované zprostředkování prodeje a nákupu autobusů.</p>
          </div>
          <div><div className="font-black">Rychlé odkazy</div><div className="mt-4 grid gap-2 text-sm font-semibold text-[#0a1020]/50"><a href="#nabidka">Nabídka</a><a href="#odber">Odběr inzerátů</a><a href="#sluzby">Služby</a><a href="#kontakt">Kontakt</a></div></div>
          <div><div className="font-black">Kontakt</div><div className="mt-4 grid gap-2 text-sm font-semibold text-[#0a1020]/50"><a href={CONTACT.phoneHref}>{CONTACT.phone}</a><a href={WHATSAPP_LINK}>WhatsApp</a><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a><span>{CONTACT.street}<br />{CONTACT.city}</span></div></div>
          <div><div className="font-black">Společnost</div><div className="mt-4 grid gap-2 text-sm font-semibold text-[#0a1020]/50"><span>{CONTACT.company}</span><span>IČO: {CONTACT.ico}</span><span>DIČ: {CONTACT.dic}</span><span>{CONTACT.bank}</span></div></div>
        </div>
        <div className="mt-8 flex flex-col gap-3 border-t border-black/10 pt-6 text-xs font-bold text-[#0a1020]/40 sm:flex-row sm:items-center sm:justify-between">
          <div>© 2026 Autobusy.cz</div>
          <div className="flex gap-4">
            <a href="/ochrana-osobnich-udaju" className="text-[#e65a26]">Ochrana osobních údajů</a>
            <a href="/admin" className="text-[#0a1020]/40">Administrace</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function MobileBar() {
  return (
    <motion.div initial={{ y: 80 }} animate={{ y: 0 }} transition={{ delay: 0.8, duration: 0.4 }} className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-4 gap-2 border-t border-black/10 bg-[#fffcf7]/94 p-2 shadow-2xl backdrop-blur-2xl lg:hidden">
      <a href={CONTACT.phoneHref} className="flex flex-col items-center justify-center rounded-2xl bg-black/[0.04] px-2 py-2 text-[11px] font-black text-[#0a1020]"><Phone className="mb-1 h-5 w-5 text-[#e65a26]" /> Volat</a>
      <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center rounded-2xl bg-[#25D366] px-2 py-2 text-[11px] font-black text-white"><MessageCircle className="mb-1 h-5 w-5" /> WA</a>
      <a href="#kontakt" className="flex flex-col items-center justify-center rounded-2xl bg-[#0a1020] px-2 py-2 text-[11px] font-black text-white"><Upload className="mb-1 h-5 w-5 text-[#f1a37f]" /> Prodat</a>
      <a href="#nabidka" className="flex flex-col items-center justify-center rounded-2xl bg-[#e65a26] px-2 py-2 text-[11px] font-black text-white"><Search className="mb-1 h-5 w-5" /> Koupit</a>
    </motion.div>
  );
}

function HomePage() {
  return (
    <main className="min-h-screen bg-white pb-20 font-sans text-[#0a1020] antialiased selection:bg-[#e65a26] selection:text-white lg:pb-0">
      <Header />
      <Hero />
      <StatsBand />
      <Listings />
      <NewsletterSignup />
      <Services />
      <Contact />
      <Footer />
      <MobileBar />
    </main>
  );
}

const emptyListing = {
  id: null,
  status: "published",
  title: "",
  subtitle: "",
  price: "",
  year: "",
  mileage: "",
  seats: "",
  location: "",
  imageUrl: "",
  description: "",
  equipment: "",
};

function AdminApp() {
  const [session, setSession] = useState({ checked: false, isAdmin: false });
  const [login, setLogin] = useState({ username: "admin", password: "" });
  const [listings, setListings] = useState([]);
  const [leads, setLeads] = useState([]);
  const [newsletter, setNewsletter] = useState([]);
  const [form, setForm] = useState(emptyListing);
  const [imageFile, setImageFile] = useState(null);
  const [status, setStatus] = useState("");

  async function loadAdminData() {
    const [listingData, leadData, newsletterData] = await Promise.all([
      apiFetch("/api/admin/listings"),
      apiFetch("/api/admin/leads"),
      apiFetch("/api/admin/newsletter"),
    ]);
    setListings(listingData.listings || []);
    setLeads(leadData.leads || []);
    setNewsletter(newsletterData.subscribers || []);
  }

  useEffect(() => {
    apiFetch("/api/admin/session")
      .then((data) => {
        setSession({ checked: true, isAdmin: Boolean(data.isAdmin) });
        if (data.isAdmin) loadAdminData();
      })
      .catch(() => setSession({ checked: true, isAdmin: false }));
  }, []);

  async function handleLogin(event) {
    event.preventDefault();
    setStatus("Přihlašuji...");
    try {
      await apiFetch("/api/admin/login", { method: "POST", body: JSON.stringify(login) });
      setSession({ checked: true, isAdmin: true });
      setStatus("");
      await loadAdminData();
    } catch (error) {
      setStatus(error.message);
    }
  }

  async function handleLogout() {
    await apiFetch("/api/admin/logout", { method: "POST", body: JSON.stringify({}) }).catch(() => {});
    window.location.reload();
  }

  async function handleSave(event) {
    event.preventDefault();
    setStatus("Ukládám...");

    let imageUrl = form.imageUrl;
    if (imageFile) {
      const fd = new FormData();
      fd.append("image", imageFile);
      const res = await fetch(apiUrl("/api/admin/upload"), { method: "POST", credentials: "include", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Nahrání obrázku selhalo.");
      imageUrl = data.url;
    }

    const payload = { ...form, imageUrl };
    try {
      if (form.id) {
        await apiFetch(`/api/admin/listings/${form.id}`, { method: "PUT", body: JSON.stringify(payload) });
      } else {
        await apiFetch("/api/admin/listings", { method: "POST", body: JSON.stringify(payload) });
      }
      setForm(emptyListing);
      setImageFile(null);
      setStatus("Uloženo.");
      await loadAdminData();
    } catch (error) {
      setStatus(error.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Opravdu smazat inzerát?")) return;
    await apiFetch(`/api/admin/listings/${id}`, { method: "DELETE", body: JSON.stringify({}) });
    await loadAdminData();
  }

  function updateForm(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  if (!session.checked) {
    return <div className="flex min-h-screen items-center justify-center bg-[#fffcf7] text-lg font-black text-[#0a1020]">Načítám administraci...</div>;
  }

  if (!session.isAdmin) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fffcf7] px-4">
        <form onSubmit={handleLogin} className="w-full max-w-md rounded-[2rem] bg-white p-7 shadow-2xl shadow-black/10 ring-1 ring-black/5">
          <Logo />
          <h1 className="mt-8 text-3xl font-black text-[#0a1020]">Administrace</h1>
          <p className="mt-2 text-sm font-semibold text-[#0a1020]/50">Přihlášení pro správu inzerátů a poptávek.</p>
          <input className="mt-6 w-full rounded-2xl border border-black/10 px-4 py-3 font-bold" placeholder="Jméno" value={login.username} onChange={(e) => setLogin({ ...login, username: e.target.value })} />
          <input className="mt-3 w-full rounded-2xl border border-black/10 px-4 py-3 font-bold" placeholder="Heslo" type="password" value={login.password} onChange={(e) => setLogin({ ...login, password: e.target.value })} />
          {status && <div className="mt-3 rounded-2xl bg-red-50 p-3 text-sm font-bold text-red-700">{status}</div>}
          <button className="mt-5 w-full rounded-full bg-[#e65a26] px-5 py-4 text-sm font-black text-white">Přihlásit</button>
          <a href="/" className="mt-4 block text-center text-xs font-black text-[#0a1020]/40">Zpět na web</a>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fffcf7] px-4 py-8 text-[#0a1020] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-black/5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Logo />
            <h1 className="mt-3 text-3xl font-black">Administrace Autobusy.cz</h1>
            <p className="mt-1 text-sm font-semibold text-[#0a1020]/50">Správa inzerátů, poptávek a odběratelů.</p>
          </div>
          <div className="flex gap-2">
            <a href="/" className="rounded-full bg-[#f4efe7] px-5 py-3 text-sm font-black">Zobrazit web</a>
            <button onClick={handleLogout} className="rounded-full bg-[#0a1020] px-5 py-3 text-sm font-black text-white">Odhlásit</button>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <form onSubmit={handleSave} className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-black/5">
            <h2 className="text-2xl font-black">{form.id ? "Upravit inzerát" : "Nový inzerát"}</h2>
            <div className="mt-5 grid gap-3">
              {[
                ["title", "Název", true],
                ["subtitle", "Podtitulek", false],
                ["price", "Cena", false],
                ["year", "Rok", false],
                ["mileage", "Nájezd", false],
                ["seats", "Počet míst", false],
                ["location", "Lokalita", false],
                ["imageUrl", "URL obrázku", false],
              ].map(([field, label, required]) => (
                <input key={field} required={required} className="rounded-2xl border border-black/10 px-4 py-3 text-sm font-bold" placeholder={label} value={form[field] || ""} onChange={(e) => updateForm(field, e.target.value)} />
              ))}
              <input type="file" accept="image/*" className="rounded-2xl border border-black/10 px-4 py-3 text-sm font-bold" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
              <textarea className="min-h-28 rounded-2xl border border-black/10 px-4 py-3 text-sm font-bold" placeholder="Popis" value={form.description || ""} onChange={(e) => updateForm("description", e.target.value)} />
              <textarea className="min-h-20 rounded-2xl border border-black/10 px-4 py-3 text-sm font-bold" placeholder="Výbava" value={form.equipment || ""} onChange={(e) => updateForm("equipment", e.target.value)} />
              <select className="rounded-2xl border border-black/10 px-4 py-3 text-sm font-bold" value={form.status} onChange={(e) => updateForm("status", e.target.value)}>
                <option value="published">Publikováno</option>
                <option value="draft">Koncept</option>
              </select>
              <div className="flex flex-col gap-2 sm:flex-row">
                <button className="rounded-full bg-[#e65a26] px-5 py-3 text-sm font-black text-white">{form.id ? "Uložit změny" : "Vytvořit inzerát"}</button>
                <button type="button" onClick={() => { setForm(emptyListing); setImageFile(null); }} className="rounded-full bg-[#f4efe7] px-5 py-3 text-sm font-black">Vyčistit</button>
              </div>
              {status && <div className="rounded-2xl bg-[#f4efe7] p-3 text-sm font-bold">{status}</div>}
            </div>
          </form>

          <section className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-black/5">
            <h2 className="text-2xl font-black">Inzeráty</h2>
            <div className="mt-5 grid gap-3">
              {listings.map((item) => (
                <div key={item.id} className="grid gap-3 rounded-2xl border border-black/10 p-3 sm:grid-cols-[92px_1fr_auto] sm:items-center">
                  <img src={assetUrl(item.imageUrl)} alt="" className="h-20 w-full rounded-xl object-cover sm:w-24" />
                  <div>
                    <div className="font-black">{item.title}</div>
                    <div className="text-sm font-semibold text-[#0a1020]/50">{item.price} • {item.year} • {item.status === "published" ? "Publikováno" : "Koncept"}</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setForm(item)} className="rounded-full bg-[#f4efe7] p-3"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => handleDelete(item.id)} className="rounded-full bg-red-50 p-3 text-red-700"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <AdminList title="Poptávky" items={leads} fields={["type", "name", "phone", "email", "busInfo", "createdAt"]} />
          <AdminList title="Odběratelé inzerátů" items={newsletter} fields={["email", "status", "consentAt", "confirmedAt"]} />
        </div>
      </div>
    </main>
  );
}

function AdminList({ title, items, fields }) {
  return (
    <section className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-black/5">
      <h2 className="text-2xl font-black">{title}</h2>
      <div className="mt-5 max-h-[520px] overflow-auto">
        {items.length === 0 ? (
          <div className="rounded-2xl bg-[#f4efe7] p-4 text-sm font-bold text-[#0a1020]/55">Zatím žádné záznamy.</div>
        ) : (
          <div className="grid gap-3">
            {items.map((item) => (
              <div key={item.id || item.email} className="rounded-2xl border border-black/10 p-4">
                {fields.map((field) => (
                  <div key={field} className="grid gap-1 py-1 text-sm sm:grid-cols-[120px_1fr]">
                    <div className="font-black text-[#0a1020]/42">{field}</div>
                    <div className="font-semibold break-words">{String(item[field] || "-")}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#fffcf7] px-4 py-12 text-[#0a1020] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-black/5 sm:p-10">
        <Logo />
        <h1 className="mt-8 text-4xl font-black tracking-[-0.05em]">Ochrana osobních údajů</h1>
        <div className="mt-6 space-y-5 text-sm font-semibold leading-7 text-[#0a1020]/62">
          <p>Správcem osobních údajů je {CONTACT.company}, {CONTACT.street}, {CONTACT.city}, IČO {CONTACT.ico}, DIČ {CONTACT.dic}.</p>
          <p>Údaje z kontaktního formuláře zpracováváme za účelem vyřízení poptávky, prodeje, nákupu nebo inzerce autobusu. Typicky jde o jméno, telefon, e-mail a obsah zprávy.</p>
          <p>Samostatný odběr upozornění na nové inzeráty slouží k zasílání e-mailových upozornění a souvisejících obchodních sdělení. Odběr je založen na souhlasu, který lze kdykoliv odvolat odhlašovacím odkazem v každém e-mailu.</p>
          <p>U odběru doporučujeme technicky používat double opt-in, ukládat čas a verzi souhlasu, zdroj formuláře a odhlašovací token.</p>
          <p>Pro uplatnění práv nebo dotazy nás kontaktujte na e-mailu <a className="text-[#e65a26]" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.</p>
        </div>
        <a href="/" className="mt-8 inline-flex rounded-full bg-[#0a1020] px-5 py-3 text-sm font-black text-white">Zpět na web</a>
      </div>
    </main>
  );
}

export default function App() {
  const path = window.location.pathname;
  if (path.startsWith("/admin")) return <AdminApp />;
  if (path.startsWith("/ochrana-osobnich-udaju")) return <PrivacyPage />;
  return <HomePage />;
}
