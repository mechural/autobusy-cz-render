import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  Bus,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Gauge,
  Mail,
  Menu,
  MessageCircle,
  Phone,
  PhoneCall,
  ClipboardList,
  Camera,
  Handshake,
  Search,
  Upload,
  Users,
  X,
} from "lucide-react";

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

const WHATSAPP_MESSAGE = "Dobrý den, mám zájem o prodej nebo koupi autobusu přes Autobusy.cz.";
const WHATSAPP_LINK = `https://wa.me/420608251067?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

const ADMIN_LOGIN = {
  username: "admin",
  password: "bus2bus2",
};

const LEGAL_LINKS = {
  terms: "Podmínky zprostředkování",
  privacy: "Ochrana osobních údajů",
  cookies: "Cookies",
};

const LEGAL_CONTENT = {
  terms: {
    title: "Podmínky zprostředkování",
    paragraphs: [
      "Provozovatel webu poskytuje službu spočívající ve zprostředkování kontaktu mezi prodávajícím a zájemcem o koupi autobusu nebo jiného vozidla.",
      "Provozovatel webu není prodávajícím vozidel uvedených v nabídce, pokud není u konkrétní nabídky výslovně uvedeno jinak. Vozidla jsou nabízena na základě informací poskytnutých prodávajícími.",
      "Kupní smlouva je uzavírána přímo mezi prodávajícím a kupujícím. Provozovatel webu neodpovídá za technický stav vozidla, skryté vady, úplnost dokumentace ani pravdivost údajů poskytnutých prodávajícím, pokud tyto informace pouze zprostředkovává.",
      "Provozovatel webu může zprostředkovat komunikaci mezi stranami, předání kontaktu, sjednání prohlídky vozidla nebo další související služby.",
      "Případná odměna, provize nebo podmínky spolupráce jsou řešeny individuálně podle dohody mezi provozovatelem webu a příslušnou stranou.",
      "Zájemci doporučujeme před uzavřením kupní smlouvy provést vlastní kontrolu technického stavu vozidla, dokumentace, původu vozidla a dalších rozhodných skutečností.",
    ],
  },
  privacy: {
    title: "Ochrana osobních údajů",
    paragraphs: [
      "Provozovatel webu zpracovává osobní údaje poskytnuté prostřednictvím kontaktních formulářů, e-mailové komunikace, telefonického kontaktu nebo jiných komunikačních kanálů.",
      "Zpracovávanými údaji mohou být zejména jméno, příjmení, název firmy, e-mail, telefonní číslo, obsah zprávy a případně další údaje sdělené uživatelem.",
      "Údaje jsou zpracovávány za účelem vyřízení poptávky, zprostředkování kontaktu mezi prodávajícím a zájemcem, komunikace se zákazníkem a ochrany právních nároků provozovatele.",
      "Osobní údaje mohou být v nezbytném rozsahu předány prodávajícímu nebo kupujícímu, pokud je to nutné pro zprostředkování obchodu.",
      "Osobní údaje nejsou prodávány třetím stranám.",
      "Uživatel má právo požadovat přístup ke svým osobním údajům, jejich opravu, výmaz, omezení zpracování a může vznést námitku proti zpracování.",
    ],
    operator: true,
  },
  cookies: {
    title: "Cookies",
    paragraphs: [
      "Tento web v této podobě používá pouze technické cookies a lokální uložení nezbytné pro správné fungování webu, administrace, formulářů a uživatelského nastavení.",
      "Pokud budou do ostré verze doplněny analytické nebo marketingové nástroje, bude doplněna cookie lišta se souhlasem uživatele, včetně možnosti přijmout, odmítnout nebo upravit nastavení cookies.",
    ],
  },
};

const BROKERAGE_NOTICE = "Zprostředkovaná nabídka. Údaje o vozidle byly poskytnuty prodávajícím. Provozovatel webu není vlastníkem vozidla, pokud není výslovně uvedeno jinak.";

function openLegalModal(type) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("autobusy-open-legal", { detail: { type } }));
}

const vehicles = [
  {
    id: 1,
    title: "Mercedes-Benz Tourismo RHD",
    subtitle: "Coach • Euro 6",
    brand: "Mercedes-Benz",
    type: "Zájezdový",
    year: "2019",
    yearNumber: 2019,
    mileage: "245 000 km",
    seats: "49 míst",
    seatsNumber: 49,
    price: "2 490 000 Kč",
    priceNumber: 2490000,
    image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1200&q=82",
    location: "Česká republika",
    availability: "Ihned / dle dohody",
    description: "Zájezdový autobus ve velmi dobré konfiguraci pro mezinárodní i vnitrostátní dopravu. Vhodné pro dopravce, cestovní kanceláře i firemní flotilu.",
    equipment: ["klimatizace", "WC", "polohovatelná sedadla", "audio/video", "velký zavazadlový prostor", "servisní historie"],
  },
  {
    id: 2,
    title: "Scania Touring HD",
    subtitle: "Coach • automat",
    brand: "Scania",
    type: "Zájezdový",
    year: "2018",
    yearNumber: 2018,
    mileage: "312 000 km",
    seats: "53 míst",
    seatsNumber: 53,
    price: "2 190 000 Kč",
    priceNumber: 2190000,
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=82",
    location: "EU",
    availability: "Po ověření dostupnosti",
    description: "Komfortní dálkový autobus s automatickou převodovkou. Nabídka je vhodná pro klienty hledající prověřený vůz s dobrým poměrem ceny a výbavy.",
    equipment: ["automat", "klimatizace", "komfortní sedadla", "tempomat", "zavazadlový prostor", "možnost financování"],
  },
  {
    id: 3,
    title: "MAN Lion's Coach",
    subtitle: "Zájezdový autobus • ověřeno",
    brand: "MAN",
    type: "Zájezdový",
    year: "2016",
    yearNumber: 2016,
    mileage: "420 000 km",
    seats: "61 míst",
    seatsNumber: 61,
    price: "1 890 000 Kč",
    priceNumber: 1890000,
    image: "https://images.unsplash.com/photo-1581262177000-8139a463e531?auto=format&fit=crop&w=1200&q=82",
    location: "ČR / EU",
    availability: "Na dotaz",
    description: "Prostorný zájezdový autobus s vyšší kapacitou míst. Vhodný pro dopravce, kteří hledají větší vůz pro pravidelné linky nebo zájezdy.",
    equipment: ["61 míst", "klimatizace", "dálkové provedení", "velký prostor pro zavazadla", "ověření stavu před prodejem"],
  },
  {
    id: 4,
    title: "SETRA S 515 HD",
    subtitle: "Coach • komfortní výbava",
    brand: "SETRA",
    type: "Zájezdový",
    year: "2017",
    yearNumber: 2017,
    mileage: "398 000 km",
    seats: "55 míst",
    seatsNumber: 55,
    price: "2 390 000 Kč",
    priceNumber: 2390000,
    image: "https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?auto=format&fit=crop&w=1200&q=82",
    location: "Německo",
    availability: "Na dotaz",
    description: "Prémiový zájezdový autobus vhodný pro náročnější provoz. Detailní technický stav a dostupnost budou ověřeny před prohlídkou.",
    equipment: ["klimatizace", "WC", "komfortní sedadla", "Euro 6", "retardér", "servisní dokumentace"],
  },
  {
    id: 5,
    title: "Iveco Crossway Line",
    subtitle: "Linkový autobus • Euro 6",
    brand: "Iveco",
    type: "Linkový",
    year: "2020",
    yearNumber: 2020,
    mileage: "186 000 km",
    seats: "45 míst",
    seatsNumber: 45,
    price: "Cena na dotaz",
    priceNumber: 0,
    image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1200&q=82",
    location: "Česká republika",
    availability: "Po dohodě",
    description: "Linkový autobus vhodný pro regionální dopravu. Možnost doplnit detailní parametry podle konkrétního kusu.",
    equipment: ["nízké provozní náklady", "Euro 6", "linkové provedení", "dobrá dostupnost servisu"],
  },
  {
    id: 6,
    title: "Mercedes-Benz Sprinter Minibus",
    subtitle: "Minibus • 20 míst",
    brand: "Mercedes-Benz",
    type: "Minibus",
    year: "2021",
    yearNumber: 2021,
    mileage: "92 000 km",
    seats: "20 míst",
    seatsNumber: 20,
    price: "1 250 000 Kč",
    priceNumber: 1250000,
    image: "https://images.unsplash.com/photo-1534670007418-fbb7f6cf32c3?auto=format&fit=crop&w=1200&q=82",
    location: "ČR",
    availability: "Ihned",
    description: "Minibus vhodný pro menší skupiny, transfery a firemní dopravu. Kompaktní vůz s dobrou využitelností.",
    equipment: ["20 míst", "klimatizace", "komfortní sedadla", "nízký nájezd", "flexibilní využití"],
  },
  {
    id: 7,
    title: "VDL Futura FHD2",
    subtitle: "Coach • dálkové provedení",
    brand: "VDL",
    type: "Zájezdový",
    year: "2018",
    yearNumber: 2018,
    mileage: "360 000 km",
    seats: "57 míst",
    seatsNumber: 57,
    price: "2 090 000 Kč",
    priceNumber: 2090000,
    image: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1200&q=82",
    location: "EU",
    availability: "Na dotaz",
    description: "Dálkový autobus s prostorným interiérem a vhodnou konfigurací pro zájezdovou dopravu.",
    equipment: ["57 míst", "klimatizace", "WC", "dálková výbava", "ověření dostupnosti"],
  },
  {
    id: 8,
    title: "SOR CN 12",
    subtitle: "Městský / linkový autobus",
    brand: "SOR",
    model: "CN 12",
    type: "Linkový",
    year: "2015",
    yearNumber: 2015,
    firstRegistration: "05/2015",
    emission: "Euro 5",
    mileage: "510 000 km",
    seats: "37 míst",
    seatsNumber: 37,
    standingPlaces: "42",
    doors: "2 dveře",
    length: "12 m",
    engine: "Iveco Tector",
    power: "210 kW",
    gearbox: "Automatická",
    fuel: "Nafta",
    price: "790 000 Kč",
    priceNumber: 790000,
    image: "https://images.unsplash.com/photo-1509749837427-ac94a2553d0e?auto=format&fit=crop&w=1200&q=82",
    location: "Česká republika",
    availability: "Na dotaz",
    condition: "provozuschopný, vhodný pro další linkový provoz",
    stk: "na dotaz",
    serviceHistory: "částečná servisní historie",
    description: "Autobus pro městský nebo linkový provoz. Vhodný pro dopravce hledající cenově dostupné řešení.",
    equipment: ["linkové provedení", "více dveří", "dostupný servis", "ekonomický provoz"],
  },
  {
    id: 9,
    title: "Solaris Urbino 12 Electric",
    subtitle: "Městský elektrobus • nízkopodlažní",
    brand: "Solaris",
    model: "Urbino 12 Electric",
    type: "Městský",
    year: "2019",
    yearNumber: 2019,
    firstRegistration: "09/2019",
    emission: "BEV / elektrický pohon",
    mileage: "168 000 km",
    seats: "31 míst",
    seatsNumber: 31,
    standingPlaces: "55",
    doors: "3 dveře",
    length: "12 m",
    engine: "elektromotor",
    power: "160 kW",
    gearbox: "přímý pohon",
    fuel: "Elektřina",
    price: "Cena na dotaz",
    priceNumber: 0,
    image: "https://images.unsplash.com/photo-1556122071-e404eaedb77f?auto=format&fit=crop&w=1200&q=82",
    location: "EU",
    availability: "po ověření dostupnosti",
    condition: "městský provoz, baterie a nabíjecí systém k ověření",
    stk: "na dotaz",
    serviceHistory: "servisní záznamy dle provozovatele",
    description: "Nízkopodlažní elektrobus pro městskou dopravu. Vhodný pro dopravce řešící bezemisní provoz a modernizaci flotily.",
    equipment: ["elektrický pohon", "nízkopodlažní", "klimatizace", "informační systém", "3 dveře"],
  },
  {
    id: 10,
    title: "Irisbus Crossway LE",
    subtitle: "Příměstský autobus • LE",
    brand: "Irisbus",
    model: "Crossway LE",
    type: "Příměstský",
    year: "2014",
    yearNumber: 2014,
    firstRegistration: "03/2014",
    emission: "Euro 5 EEV",
    mileage: "620 000 km",
    seats: "43 míst",
    seatsNumber: 43,
    standingPlaces: "35",
    doors: "2 dveře",
    length: "12 m",
    engine: "Iveco Cursor",
    power: "243 kW",
    gearbox: "Automatická",
    fuel: "Nafta",
    price: "690 000 Kč",
    priceNumber: 690000,
    image: "https://images.unsplash.com/photo-1570125909517-53cb21c89ff2?auto=format&fit=crop&w=1200&q=82",
    location: "Česká republika",
    availability: "ihned po dohodě",
    condition: "běžné opotřebení z linkového provozu",
    stk: "platnost k ověření",
    serviceHistory: "servisní historie dle dopravce",
    description: "Příměstský nízkovstupový autobus vhodný pro regionální linkovou dopravu.",
    equipment: ["nízkovstupové provedení", "automat", "klimatizace řidiče", "linková výbava"],
  },
  {
    id: 11,
    title: "Neoplan Cityliner P16",
    subtitle: "Luxusní zájezdový autobus • Euro 6",
    brand: "Neoplan",
    model: "Cityliner P16",
    type: "Zájezdový",
    year: "2020",
    yearNumber: 2020,
    firstRegistration: "06/2020",
    emission: "Euro 6",
    mileage: "210 000 km",
    seats: "52 míst",
    seatsNumber: 52,
    standingPlaces: "0",
    doors: "2 dveře",
    length: "13,1 m",
    engine: "MAN D26",
    power: "338 kW",
    gearbox: "Automatická",
    fuel: "Nafta",
    price: "3 290 000 Kč",
    priceNumber: 3290000,
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=82",
    location: "Německo",
    availability: "na dotaz",
    condition: "velmi dobrý stav, dálkový provoz",
    stk: "na dotaz",
    serviceHistory: "servisní kniha k dispozici",
    description: "Komfortní dálkový autobus s prémiovou výbavou pro cestovní kanceláře a dálkovou dopravu.",
    equipment: ["WC", "klimatizace", "retardér", "polohovatelná sedadla", "audio/video", "lednice"],
  },
  {
    id: 12,
    title: "Temsa MD9 LE",
    subtitle: "Midibus • linkový provoz",
    brand: "Temsa",
    model: "MD9 LE",
    type: "Midibus",
    year: "2018",
    yearNumber: 2018,
    firstRegistration: "11/2018",
    emission: "Euro 6",
    mileage: "280 000 km",
    seats: "34 míst",
    seatsNumber: 34,
    standingPlaces: "20",
    doors: "2 dveře",
    length: "9,5 m",
    engine: "Cummins",
    power: "186 kW",
    gearbox: "Automatická",
    fuel: "Nafta",
    price: "1 150 000 Kč",
    priceNumber: 1150000,
    image: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1200&q=82",
    location: "Slovensko",
    availability: "do 30 dnů",
    condition: "dobrý stav, vhodné pro regionální dopravu",
    stk: "na dotaz",
    serviceHistory: "servisní historie k prověření",
    description: "Kompaktní linkový midibus vhodný pro méně vytížené linky, firemní přepravu nebo regionální dopravu.",
    equipment: ["automat", "klimatizace", "nízkovstupové provedení", "informační panel"],
  },
];

const COPY = {
  cs: {
    path: "/",
    nav: ["Nabídka", "Nové nabídky", "Služby", "Kontakt"],
    brokerageNav: "Jak to funguje",
    heroEyebrow: "Prodej i nákup autobusů bez zbytečného hledání",
    heroTitle: "Prodáváte autobus?",
    heroAccent: "Pomůžeme vám.",
    heroText:
      "A když autobus hledáte, najdeme vhodné možnosti podle vaší poptávky. Autobusy.cz propojuje obě strany, připraví nabídku a pomůže dovést obchod do cíle.",
    sellCta: "Chci prodat",
    sellCtaSub: "Pošlete nám základní údaje, ozveme se vám.",
    buyCta: "Chci koupit",
    buyCtaSub: "Napište, co hledáte, nabídneme možnosti.",
    call: "Zavolejte nám",
    whatsapp: "Napsat WhatsApp",
    fast: "Rychlá reakce • ČR i zahraničí • prověřené nabídky",
    panelEyebrow: "Autobusy.cz jako prostředník",
    panelTitle: "Jedna služba pro prodej i nákup.",
    sellProcess: {
      label: "Chci prodat autobus",
      title: "Z nabídky uděláme prodej",
      left: "Prodávající",
      mid: "Autobusy.cz",
      right: "Kupující",
      from: "autobus k prodeji",
      center: "pomůžeme vám",
      to: "prodaný autobus",
    },
    buyProcess: {
      label: "Chci koupit autobus",
      title: "Z poptávky najdeme vhodné možnosti",
      left: "Nabídka vozů",
      mid: "Autobusy.cz",
      right: "Poptávka",
      from: "nabídka vozů",
      center: "vyhledáme",
      to: "poptávka",
    },
    stats: ["let zkušeností", "spokojených zákazníků", "prodaných autobusů"],
    brokerage: {
      eyebrow: "Jak funguje prodej přes Autobusy.cz",
      title: "Postaráme se o celý proces prodeje.",
      text: "Začneme krátkou domluvou – probereme typ autobusu, technický stav, dostupné podklady, fotografie a vaši představu o ceně. Poté připravíme nabídku, zajistíme prezentaci, inzerci a zprostředkujeme jednání s vážnými zájemci.",
      items: [
        ["01", "Nejdříve se spojíme", "Domluvíme základní informace, typ autobusu, lokalitu, termín prodeje, dostupné podklady a vaši představu o ceně."],
        ["02", "Připravíme podklady", "Doplníme technický stav, výbavu, servisní historii, nájezd, počet míst a další informace důležité pro kupující."],
        ["03", "Autobus nafotíme a nainzerujeme", "Nabídku zpracujeme tak, aby působila důvěryhodně, přehledně a oslovila relevantní kupující."],
        ["04", "Pomůžeme vám", "Oslovíme vhodné zájemce, prověříme poptávky a předáváme pouze smysluplné kontakty s reálným zájmem."],
        ["05", "Zprostředkujeme prodej", "Pomůžeme s komunikací, vyjednáním podmínek a dotažením obchodu do úspěšného konce."],
      ],
    },
    why: {
      eyebrow: "Proč přes Autobusy.cz",
      title: "Prodávající šetří čas. Kupující dostane relevantní možnosti.",
      text: "Autobusy.cz funguje jako praktický prostředník mezi lidmi, kteří autobus prodávají, a těmi, kteří jej opravdu hledají.",
      items: [
        ["Pomoc s cenou", "Pomůžeme nastavit realistickou představu o ceně podle typu, roku, nájezdu a stavu vozidla."],
        ["Lepší prezentace", "Připravíme inzerát tak, aby působil důvěryhodně, přehledně a obchodně."],
        ["Relevantní zájemci", "Neřešíme nahodilé dotazy, ale smysluplné poptávky a konkrétní kupující."],
        ["Diskrétní postup", "Prodej lze řešit citlivě bez zbytečného zatížení prodávajícího."],
      ],
    },
    listingsEyebrow: "Aktuální nabídka",
    listingsTitle: "Aktuální nabídka autobusů k prodeji",
    listingsText: "Inzeráty se v ostré verzi plní z administrace webu.",
    detail: "Zobrazit detail",
    similar: "Nenašli jste vhodný autobus? Poptejte nás",
    viewAllListings: "Zobrazit všechny inzeráty",
    allListingsTitle: "Všechny autobusy v nabídce",
    allListingsText: "Projděte kompletní nabídku autobusů a použijte filtr podle značky, typu, roku nebo počtu míst.",
    filterSearch: "Hledat autobus",
    filterBrand: "Značka",
    filterType: "Typ",
    filterYear: "Rok od",
    filterSeats: "Míst od",
    filterAll: "Vše",
    newsletterTitle: "Hledáte autobus? Dejte si hlídat nové nabídky.",
    newsletterText: "Pošleme vám e-mail, když přidáme nový inzerát. Odběr je dobrovolný a můžete jej kdykoliv odvolat.",
    newsletterButton: "Přihlásit odběr",
    emailPlaceholder: "Váš e-mail",
    servicesEyebrow: "Jednoduchý postup",
    servicesTitle: "Méně klikání. Více obchodu.",
    steps: [
      ["01", "Pošlete nám autobus nebo poptávku", "Stačí základní údaje, kontakt a stručný popis."],
      ["02", "Připravíme správnou prezentaci", "Pomůžeme s nabídkou, cenou a oslovením vhodných zájemců."],
      ["03", "Propojíme prodávajícího a kupujícího", "Cílem je rychlý, přehledný a férový obchod."],
    ],
    contactEyebrow: "Kontakt",
    contactTitle: "Ozvěte se. Najdeme cestu.",
    contactText: "Prodej, nákup nebo inzerce autobusu. Stačí krátká zpráva nebo telefonát.",
    form: {
      name: "Jméno a příjmení",
      nameHint: "Vyplňte jméno a příjmení kontaktní osoby.",
      phone: "Telefon",
      phoneHint: "Vyplňte telefonní číslo, na kterém vás můžeme zastihnout.",
      email: "E-mail",
      emailHint: "Vyplňte e-mail pro zaslání doplňujících informací.",
      sellModel: "Značka a model autobusu",
      sellModelHint: "Vyplňte přesnou značku a model autobusu.",
      year: "Rok výroby",
      yearHint: "Vyplňte rok výroby podle technického průkazu nebo odhadem.",
      mileage: "Nájezd km",
      mileageHint: "Vyplňte aktuální nájezd v kilometrech.",
      seats: "Počet míst",
      seatsHint: "Vyplňte počet sedadel pro cestující, případně včetně řidiče/průvodce.",
      price: "Představa o ceně",
      priceHint: "Vyplňte požadovanou cenu nebo uveďte, že je cena k jednání.",
      sellNote: "Výbava, technický stav, lokalita, dostupnost fotografií",
      sellNoteHint: "Popište výbavu, technický stav, servisní historii, STK, závady a kde se autobus nachází.",
      buyType: "Typ hledaného autobusu",
      buyTypeHint: "Vyplňte typ autobusu, který hledáte.",
      budget: "Rozpočet",
      budgetHint: "Vyplňte maximální cenu nebo cenové rozmezí.",
      emission: "Rok / emisní norma",
      emissionHint: "Vyplňte minimální rok výroby nebo požadovanou emisní normu.",
      term: "Termín koupě",
      termHint: "Vyplňte, kdy chcete autobus koupit nebo převzít.",
      buyNote: "Požadovaná výbava, využití, lokalita nebo další preference",
      buyNoteHint: "Popište požadovanou výbavu, účel využití, preferovanou lokalitu, financování nebo další podmínky.",
      consent: "Souhlasím se zpracováním osobních údajů pro vyřízení nabídky nebo poptávky.",
      submitSell: "Odeslat nabídku autobusu",
      submitBuy: "Odeslat poptávku",
      success: "Poptávka byla uložena. Brzy se vám ozveme.",
    },
    footerText: "Specializované zprostředkování prodeje a nákupu autobusů.",
    detailModal: {
      close: "Zavřít",
      specs: "Základní informace",
      equipment: "Výbava a poznámky",
      location: "Lokalita",
      availability: "Dostupnost",
      ask: "Poptat tento autobus",
      call: "Zavolat k autobusu",
    },
  },
};

// Pro jazykové verze EN/DE v ostré maketě použijeme českou strukturu s přepsanými hlavními texty.
COPY.en = {
  ...COPY.cs,
  path: "/en",
  nav: ["Listings", "New offers", "Services", "Contact"],
  brokerageNav: "How it works",
  heroEyebrow: "Bus sales and sourcing without unnecessary searching",
  heroTitle: "Selling a bus?",
  heroAccent: "We help you.",
  heroText: "And if you are looking for a bus, we find suitable options based on your request. Autobusy.cz connects both sides, prepares the offer and helps bring the deal to completion.",
  sellCta: "I want to sell",
  sellCtaSub: "Send us the basic details and we will get back to you.",
  buyCta: "I want to buy",
  buyCtaSub: "Tell us what you need and we will offer options.",
  listingsTitle: "Current buses for sale",
  contactTitle: "Get in touch. We will find the way.",
  footerText: "Specialized brokerage for bus sales and purchases.",
  detail: "View detail",
  similar: "Didn’t find a suitable bus? Contact us",
  viewAllListings: "View all listings",
};
COPY.de = {
  ...COPY.cs,
  path: "/de",
  nav: ["Angebot", "Neue Angebote", "Leistungen", "Kontakt"],
  brokerageNav: "So funktioniert es",
  heroEyebrow: "Busverkauf und Bussuche ohne unnötiges Suchen",
  heroTitle: "Verkaufen Sie einen Bus?",
  heroAccent: "Wir helfen Ihnen.",
  heroText: "Und wenn Sie einen Bus suchen, finden wir passende Möglichkeiten nach Ihrer Anfrage. Autobusy.cz verbindet beide Seiten, bereitet das Angebot vor und begleitet den Abschluss.",
  sellCta: "Ich möchte verkaufen",
  sellCtaSub: "Senden Sie uns die Grunddaten, wir melden uns.",
  buyCta: "Ich möchte kaufen",
  buyCtaSub: "Sagen Sie uns, was Sie suchen – wir bieten Optionen.",
  listingsTitle: "Aktuelles Angebot an Bussen zum Verkauf",
  contactTitle: "Melden Sie sich. Wir finden den Weg.",
  footerText: "Spezialisierte Vermittlung beim Verkauf und Kauf von Bussen.",
  detail: "Detail anzeigen",
  similar: "Keinen passenden Bus gefunden? Anfrage senden",
  viewAllListings: "Alle Inserate anzeigen",
};

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.72, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.06 } },
};

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function getLang() {
  if (typeof window === "undefined") return "cs";
  if (window.location.pathname.startsWith("/en")) return "en";
  if (window.location.pathname.startsWith("/de")) return "de";
  return "cs";
}

function getPage() {
  if (typeof window === "undefined") return "home";
  if (window.location.pathname.includes("/admin")) return "admin";
  if (window.location.pathname.includes("/nabidka-autobusu")) return "listings";
  return "home";
}

function LogoBusMark({ className = "" }) {
  return (
    <div className={cn("flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0a1020] shadow-[0_14px_34px_rgba(10,16,32,0.18)]", className)}>
      <svg viewBox="0 0 64 64" className="h-9 w-9" fill="none" aria-hidden="true">
        <path d="M10 34V24C10 19.6 13.6 16 18 16H42C48.2 16 53.2 20.1 55 26L58 35.5V39C58 43.4 54.4 47 50 47H18C13.6 47 10 43.4 10 39V34Z" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M17 24H28V31H17V24Z" fill="white" />
        <path d="M31 24H42V31H31V24Z" fill="white" />
        <path d="M45 24H51L54 31H45V24Z" fill="white" />
        <path d="M15 37H54" stroke="white" strokeWidth="4" strokeLinecap="round" />
        <circle cx="22" cy="48" r="5" fill="white" />
        <circle cx="47" cy="48" r="5" fill="white" />
        <circle cx="22" cy="48" r="2" fill="#0a1020" />
        <circle cx="47" cy="48" r="2" fill="#0a1020" />
      </svg>
    </div>
  );
}

function Logo({ dark = true }) {
  return (
    <div className="flex items-center gap-3">
      <LogoBusMark />
      <div className="flex items-baseline gap-0 tracking-[-0.055em] whitespace-nowrap">
        <span className={cn("text-2xl font-black", dark ? "text-[#0a1020]" : "text-white")}>Autobusy</span>
        <span className="-ml-px text-2xl font-black text-[#e65a26]">.cz</span>
      </div>
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
    <motion.span whileHover={disabled ? undefined : { y: -2 }} whileTap={disabled ? undefined : { scale: 0.98 }} className={cn("inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-black transition duration-300", variants[variant], disabled && "cursor-not-allowed opacity-60", className)}>
      {children}
    </motion.span>
  );

  if (href) return <a href={href} {...props}>{inner}</a>;
  return <button type={type} disabled={disabled} {...props}>{inner}</button>;
}

function Header({ t, lang, onLanguageChange }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navItems = [[t.nav[0], "#nabidka"], [t.brokerageNav, "#jak-to-funguje"], [t.nav[1], "#odber"], [t.nav[3], "#kontakt"]];
  const languages = [["CZ", "cs", "/"], ["EN", "en", "/en"], ["DE", "de", "/de"]];
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
      <motion.div animate={{ backgroundColor: scrolled ? "rgba(255,252,247,0.94)" : "rgba(255,252,247,0.76)", boxShadow: scrolled ? "0 24px 80px rgba(10,16,32,0.14)" : "0 16px 50px rgba(10,16,32,0.07)" }} transition={{ duration: 0.24 }} className="mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-[1.6rem] border border-white/80 px-4 py-3 backdrop-blur-2xl">
        <a href="#top" aria-label="Autobusy.cz" className="shrink-0" onClick={(event) => { event.preventDefault(); window.history.pushState({}, "", COPY[lang].path); document.getElementById("top")?.scrollIntoView({ behavior: "smooth", block: "start" }); }}><Logo /></a>
        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map(([label, href]) => <a key={label} href={href} className="text-sm font-black text-[#0a1020]/60 transition hover:text-[#0a1020]">{label}</a>)}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <a href={CONTACT.phoneHref} className="text-sm font-black text-[#0a1020]">{CONTACT.phone}</a>
          <Button href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" variant="whatsapp" className="px-4 py-3"><MessageCircle className="h-4 w-4" /> WhatsApp</Button>
          <div className="ml-1 flex items-center gap-1 border-l border-black/10 pl-3">
            <span className="text-sm text-[#0a1020]/35">🌐</span>
            {languages.map(([label, code, href]) => <a key={label} href={href} onClick={(event) => { event.preventDefault(); onLanguageChange(code); window.history.pushState({}, "", href); }} className={cn("rounded-full px-2.5 py-1.5 text-xs font-black ring-1 ring-black/10 transition", lang === code ? "bg-[#0a1020] text-white ring-[#0a1020]" : "text-[#0a1020]/45 hover:text-[#0a1020]")}>{label}</a>)}
          </div>
        </div>
        <button onClick={() => setOpen(!open)} className="rounded-full bg-black/[0.05] p-3 lg:hidden" aria-label="Menu">{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
      </motion.div>
      {open && <motion.div initial={{ opacity: 0, y: -8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="mx-auto mt-3 max-w-7xl rounded-[1.5rem] bg-[#fffcf7]/96 p-3 shadow-2xl shadow-black/10 backdrop-blur-2xl lg:hidden"><div className="grid gap-2">{navItems.map(([label, href]) => <a key={label} href={href} onClick={() => setOpen(false)} className="rounded-2xl bg-black/[0.04] px-4 py-3 text-sm font-black text-[#0a1020]/70">{label}</a>)}<div className="grid grid-cols-3 gap-2">{languages.map(([label, code, href]) => <a key={label} href={href} onClick={(event) => { event.preventDefault(); onLanguageChange(code); window.history.pushState({}, "", href); setOpen(false); }} className={cn("rounded-2xl px-4 py-3 text-center text-sm font-black", lang === code ? "bg-[#0a1020] text-white" : "bg-black/[0.04] text-[#0a1020]/70")}>{label}</a>)}</div><a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="rounded-2xl bg-[#25D366] px-4 py-3 text-center text-sm font-black text-white">WhatsApp</a></div></motion.div>}
    </header>
  );
}

function RouteBusIcon({ className = "", success = false }) {
  const bodyFill = success ? "#dcfce7" : "#ffffff";
  const glassFill = success ? "#bbf7d0" : "#dcecff";
  const accent = success ? "#16a34a" : "#e65a26";
  return (
    <svg viewBox="0 0 160 86" className={className} fill="none" aria-hidden="true">
      <path d="M18 31C18 20.5 26.5 12 37 12H103C120.5 12 135.9 23.6 140.7 40.4L145 55.5V63C145 68.5 140.5 73 135 73H25C19.5 73 15 68.5 15 63V34C15 32.3 16.3 31 18 31Z" fill={bodyFill} stroke="#0a1020" strokeWidth="4" strokeLinejoin="round" />
      <path d="M34 23H60V44H28V31C28 26.6 31.6 23 34 23Z" fill={glassFill} stroke="#0a1020" strokeWidth="3" />
      <path d="M67 23H95V44H67V23Z" fill={glassFill} stroke="#0a1020" strokeWidth="3" />
      <path d="M102 23H112C123 23 132 30.2 135 40.7L136 44H102V23Z" fill={glassFill} stroke="#0a1020" strokeWidth="3" />
      <path d="M23 53H138" stroke={accent} strokeWidth="5" strokeLinecap="round" />
      <circle cx="42" cy="73" r="10" fill="#0a1020" /><circle cx="115" cy="73" r="10" fill="#0a1020" /><circle cx="42" cy="73" r="4" fill="#ffffff" /><circle cx="115" cy="73" r="4" fill="#ffffff" />
    </svg>
  );
}

function AnimatedBusIcon({ duration, delay = 0, className = "" }) {
  const transition = { duration, times: [0, 0.74, 0.75, 0.9, 1], repeat: Infinity, ease: "linear", delay };
  return <div className={cn("relative flex items-center justify-center", className)}><motion.div className="absolute inset-0 flex items-center justify-center" animate={{ opacity: [1, 1, 0, 0, 1] }} transition={transition}><RouteBusIcon className="h-full w-full" /></motion.div><motion.div className="absolute inset-0 flex items-center justify-center" animate={{ opacity: [0, 0, 1, 1, 0] }} transition={transition}><RouteBusIcon success className="h-full w-full" /></motion.div></div>;
}

function ProcessRoad({ data, direction, color }) {
  const isRtl = direction === "rtl";
  const duration = 13.4;
  const delay = isRtl ? 0.25 : 0;
  const barColor = color === "orange" ? "bg-[#e65a26]" : "bg-[#0a1020]";
  const times = [0, 0.35, 0.75, 0.9, 1];
  const transition = { duration, times, repeat: Infinity, ease: "easeInOut", delay };
  const instantSwitch = { duration, times: [0, 0.349, 0.35, 0.9, 1], repeat: Infinity, ease: "linear", delay };
  const finalBackground = ["#ffffff", "#ffffff", "#dcfce7", "#dcfce7", "#ffffff"];
  const finalGlow = ["0 20px 56px rgba(10,16,32,0.18)", "0 20px 56px rgba(10,16,32,0.18)", "0 24px 68px rgba(22,163,74,0.30)", "0 24px 68px rgba(22,163,74,0.30)", "0 20px 56px rgba(10,16,32,0.18)"];
  const progressAnimation = { scaleX: [0, 0.5, 1, 1, 0] };
  const sellCardAnimation = { left: ["0%", "calc(50% - 40px)", "calc(100% - 80px)", "calc(100% - 80px)", "0%"], y: [0, -6, -6, 0, 0], backgroundColor: finalBackground, boxShadow: finalGlow };
  const buyCardAnimation = { right: ["0%", "calc(50% - 40px)", "calc(100% - 80px)", "calc(100% - 80px)", "0%"], y: [0, 6, 6, 0, 0], backgroundColor: ["#0a1020", "#0a1020", "#dcfce7", "#dcfce7", "#0a1020"], boxShadow: finalGlow };
  return (
    <div className="rounded-[2rem] bg-white/92 p-5 shadow-[0_22px_74px_rgba(10,16,32,0.10)] ring-1 ring-black/5 backdrop-blur-2xl">
      <div className="mb-5"><div className={cn("text-xs font-black uppercase tracking-[0.18em]", color === "orange" ? "text-[#e65a26]" : "text-[#0a1020]/45")}>{data.label}</div><div className="mt-1 text-lg font-black text-[#0a1020]">{data.title}</div></div>
      <div className="grid grid-cols-3 gap-3 text-center text-[11px] font-black text-[#0a1020]/50"><div className="rounded-2xl bg-[#f8f4ed] px-2 py-3">{data.left}</div><div className="rounded-2xl bg-[#fff1e9] px-2 py-3 text-[#e65a26]">{data.mid}</div><div className="rounded-2xl bg-[#f8f4ed] px-2 py-3">{data.right}</div></div>
      <div className="relative mt-4 h-32 overflow-visible">
        <div className="absolute left-10 right-10 top-10 h-4 rounded-full bg-[#ebe7df] ring-1 ring-black/5" />
        <div className="absolute left-0 top-7 h-10 w-10 rounded-full border-4 border-white bg-[#0a1020] shadow-md" />
        <motion.div className={cn("absolute left-1/2 top-6 h-12 w-12 -translate-x-1/2 rounded-full border-4 border-white shadow-md", isRtl ? "bg-[#0a1020]" : "bg-[#e65a26]")} animate={{ scale: [1, 1.1, 1.04, 1, 1] }} transition={transition} />
        <div className="absolute right-0 top-7 h-10 w-10 rounded-full border-4 border-white bg-[#0a1020] shadow-md" />
        <div className="absolute left-10 right-10 top-10 h-4 overflow-hidden rounded-full"><motion.div className={cn("absolute inset-y-0 w-full rounded-full", barColor, isRtl ? "right-0" : "left-0")} style={{ transformOrigin: isRtl ? "right center" : "left center" }} animate={progressAnimation} transition={transition} /></div>
        {!isRtl && <motion.div className="absolute left-0 top-1 z-20 flex h-20 w-20 items-center justify-center rounded-[1.55rem] bg-white ring-1 ring-black/8" animate={sellCardAnimation} transition={transition}><AnimatedBusIcon duration={duration} delay={delay} className="h-14 w-[4.8rem]" /></motion.div>}
        {isRtl && <motion.div className="absolute right-0 top-1 z-20 flex h-20 w-20 items-center justify-center rounded-[1.55rem] bg-[#0a1020] ring-1 ring-black/8" animate={buyCardAnimation} transition={transition}><motion.div className="absolute inset-0 flex items-center justify-center" animate={{ opacity: [1, 1, 0, 0, 1] }} transition={instantSwitch}><Search className="h-8 w-8 text-[#f1a37f]" /></motion.div><motion.div className="absolute inset-0 flex items-center justify-center" animate={{ opacity: [0, 0, 1, 1, 0] }} transition={instantSwitch}><div className="scale-x-[-1]"><AnimatedBusIcon duration={duration} delay={delay} className="h-14 w-[4.8rem]" /></div></motion.div></motion.div>}
        <motion.div className={cn("absolute top-7 z-10 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-[#dcfce7] text-[#16a34a] shadow-[0_18px_48px_rgba(22,163,74,0.24)]", color === "orange" ? "right-0" : "left-0")} animate={{ scale: [0.82, 0.82, 1.12, 1, 0.82], opacity: [0, 0, 1, 0.9, 0] }} transition={transition}><span className="text-lg font-black leading-none">✓</span></motion.div>
        <div className="absolute left-0 top-[90px] w-32 text-left text-[11px] font-black text-[#0a1020]/45">{data.from}</div><div className="absolute left-1/2 top-[90px] -translate-x-1/2 text-center text-[11px] font-black text-[#e65a26]">{data.center}</div><div className="absolute right-0 top-[90px] w-32 text-right text-[11px] font-black text-[#0a1020]/45">{data.to}</div>
      </div>
    </div>
  );
}

function AnimatedHeroPanel({ t }) {
  return <motion.div variants={fadeUp} className="relative"><div className="absolute inset-0 rounded-[3rem] bg-[#0a1020]/10 blur-2xl" /><div className="relative overflow-hidden rounded-[3rem] bg-white p-5 shadow-[0_36px_120px_rgba(10,16,32,0.14)] ring-1 ring-black/5 sm:p-8"><div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_18%,rgba(230,90,38,0.12),transparent_25%),radial-gradient(circle_at_84%_24%,rgba(37,99,235,0.10),transparent_28%),linear-gradient(180deg,#ffffff_0%,#f8fbff_58%,#fff7f1_100%)]" /><div className="relative z-20"><div className="mb-5"><div className="text-xs font-black uppercase tracking-[0.22em] text-[#e65a26]">{t.panelEyebrow}</div><div className="mt-2 text-2xl font-black tracking-[-0.04em] text-[#0a1020] sm:text-3xl">{t.panelTitle}</div></div><div className="grid gap-5"><ProcessRoad data={t.sellProcess} direction="ltr" color="orange" /><ProcessRoad data={t.buyProcess} direction="rtl" color="dark" /></div></div></div></motion.div>;
}

function MobileProcessPreview({ t }) {
  const items = [[t.sellCta, t.sellCtaSub, Upload], [t.buyCta, t.buyCtaSub, Search], [t.detailModal.ask, "Hotovo", Handshake]];
  return <motion.div variants={fadeUp} className="grid gap-3 lg:hidden">{items.map(([title, text, Icon], index) => <div key={title} className="flex items-center gap-4 rounded-[1.5rem] bg-white/90 p-4 shadow-sm ring-1 ring-black/5"><div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white", index === 1 ? "bg-[#0a1020]" : "bg-[#e65a26]")}><Icon className="h-5 w-5" /></div><div><div className="text-sm font-black text-[#0a1020]">{title}</div><div className="mt-1 text-xs font-bold leading-5 text-[#0a1020]/48">{text}</div></div></div>)}</motion.div>;
}

function Hero({ t }) {
  const [activeCta, setActiveCta] = useState(null);
  const openLeadForm = (type) => { window.dispatchEvent(new CustomEvent("autobusy-open-lead", { detail: { type } })); document.getElementById("kontakt")?.scrollIntoView({ behavior: "smooth", block: "start" }); };
  const CtaSubPanel = ({ type }) => <motion.div initial={{ opacity: 0, y: -8, height: 0 }} animate={{ opacity: 1, y: 0, height: "auto" }} className="mt-3 overflow-hidden rounded-[1.6rem] bg-white p-3 shadow-[0_20px_60px_rgba(10,16,32,0.12)] ring-1 ring-black/10"><div className="grid gap-2 sm:grid-cols-2"><button type="button" onClick={() => openLeadForm(type)} className="rounded-full bg-[#e65a26] px-5 py-4 text-sm font-black text-white shadow-[0_16px_40px_rgba(230,90,38,0.22)] transition hover:bg-[#ce4e20]">Vyplnit formulář</button><a href={CONTACT.phoneHref} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0a1020] px-5 py-4 text-sm font-black text-white transition hover:bg-black"><Phone className="h-4 w-4" /> Rovnou zavolat</a></div></motion.div>;
  return (
    <section id="top" className="relative overflow-hidden bg-[#fffcf7] text-[#0a1020]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_22%,rgba(230,90,38,0.12),transparent_28%),radial-gradient(circle_at_84%_28%,rgba(18,42,82,0.10),transparent_32%)]" />
      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-white to-transparent" />
      <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-24 sm:px-6 sm:pt-28 lg:px-8 lg:pb-20 lg:pt-32">
        <motion.div initial="hidden" animate="show" variants={stagger} className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="lg:-mt-8 xl:-mt-10">
            <motion.div variants={fadeUp} className="text-xs font-black uppercase tracking-[0.28em] text-[#e65a26]">{t.heroEyebrow}</motion.div>
            <motion.h1 variants={fadeUp} className="mt-4 max-w-4xl text-4xl font-black leading-[0.9] tracking-[-0.075em] sm:mt-5 sm:text-6xl xl:text-[6.5rem]">{t.heroTitle}<span className="block text-[#e65a26]">{t.heroAccent}</span></motion.h1>
            <motion.p variants={fadeUp} className="mt-4 max-w-2xl text-base leading-7 text-[#0a1020]/62 sm:mt-6 sm:text-lg lg:text-xl">{t.heroText}</motion.p>
            <motion.div variants={fadeUp} className="mt-6 grid gap-4 sm:grid-cols-2 lg:mt-8">
              <button type="button" onClick={() => setActiveCta(activeCta === "sell" ? null : "sell")} className="group relative min-h-[112px] overflow-hidden rounded-[2rem] bg-[#0a1020] p-6 text-left text-white shadow-[0_24px_70px_rgba(10,16,32,0.26)] ring-1 ring-white/10 transition-all duration-500 hover:-translate-y-2 hover:bg-[#e65a26] hover:shadow-[0_32px_90px_rgba(230,90,38,0.34)] sm:p-8"><div className="relative flex h-full items-center justify-between gap-5"><div><div className="text-3xl font-black tracking-[-0.045em] sm:text-4xl">{t.sellCta}</div><div className="mt-2 max-w-[15rem] text-base font-bold leading-6 text-white/56 group-hover:text-white/82">{t.sellCtaSub}</div></div><span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/10 text-2xl font-black text-[#f1a37f] group-hover:bg-white group-hover:text-[#e65a26]">→</span></div></button>
              <button type="button" onClick={() => setActiveCta(activeCta === "buy" ? null : "buy")} className="group relative min-h-[112px] overflow-hidden rounded-[2rem] bg-white p-6 text-left text-[#0a1020] shadow-[0_24px_70px_rgba(10,16,32,0.12)] ring-1 ring-black/10 transition-all duration-500 hover:-translate-y-2 hover:bg-[#e65a26] hover:text-white hover:shadow-[0_32px_90px_rgba(230,90,38,0.34)] sm:p-8"><div className="relative flex h-full items-center justify-between gap-5"><div><div className="text-3xl font-black tracking-[-0.045em] sm:text-4xl">{t.buyCta}</div><div className="mt-2 max-w-[15rem] text-base font-bold leading-6 text-[#0a1020]/48 group-hover:text-white/72">{t.buyCtaSub}</div></div><span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#fff1e9] text-2xl font-black text-[#e65a26] group-hover:bg-[#e65a26] group-hover:text-white">→</span></div></button>
            </motion.div>
            {activeCta && <motion.div variants={fadeUp}><CtaSubPanel type={activeCta} /></motion.div>}
          </div>
          <div className="hidden lg:block"><AnimatedHeroPanel t={t} /></div>
          <MobileProcessPreview t={t} />
        </motion.div>
      </div>
    </section>
  );
}

function StatCard({ icon: Icon, value, suffix = "+", label, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [display, setDisplay] = useState(0);
  useEffect(() => { if (!inView) return; let frame; const duration = 1200; const timeout = setTimeout(() => { const start = performance.now(); const tick = (now) => { const p = Math.min((now - start) / duration, 1); const eased = 1 - Math.pow(1 - p, 3); setDisplay(Math.round(value * eased)); if (p < 1) frame = requestAnimationFrame(tick); }; frame = requestAnimationFrame(tick); }, delay * 1000); return () => { clearTimeout(timeout); if (frame) cancelAnimationFrame(frame); }; }, [inView, value, delay]);
  return <motion.div ref={ref} initial={{ opacity: 0, y: 22, scale: 0.97 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.55, delay }} whileHover={{ y: -5 }} className="group relative overflow-hidden rounded-[2rem] bg-white p-6 shadow-[0_18px_60px_rgba(10,16,32,0.08)] ring-1 ring-black/5"><div className="relative flex items-start gap-5"><div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#fff1e9] text-[#e65a26] transition group-hover:bg-[#e65a26] group-hover:text-white"><Icon className="h-6 w-6" /></div><div><div className="text-4xl font-black tracking-[-0.055em] text-[#0a1020] sm:text-5xl">{display}{suffix}</div><div className="mt-2 text-base font-black text-[#0a1020]">{label}</div></div></div></motion.div>;
}
function StatsBand({ t }) { return <section className="relative bg-white py-10 lg:py-14"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div className="grid gap-5 md:grid-cols-3"><StatCard icon={CalendarDays} value={26} label={t.stats[0]} delay={0} /><StatCard icon={Users} value={300} label={t.stats[1]} delay={0.12} /><StatCard icon={Bus} value={500} label={t.stats[2]} delay={0.24} /></div></div></section>; }

function BrokerageSection({ t }) {
  const icons = [PhoneCall, ClipboardList, Camera, Search, Handshake];
  return <section id="jak-to-funguje" className="relative overflow-hidden bg-white py-12 lg:py-20"><div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_20%,rgba(230,90,38,0.08),transparent_28%),radial-gradient(circle_at_86%_18%,rgba(10,16,32,0.06),transparent_24%)]" /><div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} variants={stagger} className="overflow-hidden rounded-[2.8rem] bg-[#fffcf7] shadow-[0_28px_90px_rgba(10,16,32,0.09)] ring-1 ring-black/5"><div className="grid gap-0 lg:grid-cols-[0.78fr_1.22fr]"><div className="relative bg-[#0a1020] p-7 text-white sm:p-10 lg:p-12"><div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(230,90,38,0.38),transparent_28%),radial-gradient(circle_at_88%_88%,rgba(255,255,255,0.10),transparent_30%)]" /><div className="relative"><motion.div variants={fadeUp} className="text-xs font-black uppercase tracking-[0.26em] text-[#f1a37f]">{t.brokerage.eyebrow}</motion.div><motion.h2 variants={fadeUp} className="mt-5 text-4xl font-black leading-[0.95] tracking-[-0.06em] sm:text-6xl">{t.brokerage.title}</motion.h2><motion.p variants={fadeUp} className="mt-6 max-w-xl text-base font-semibold leading-8 text-white/62 sm:text-lg">{t.brokerage.text}</motion.p><motion.div variants={fadeUp} className="mt-8 rounded-[1.6rem] bg-white/8 p-5 ring-1 ring-white/10 backdrop-blur-xl"><div className="text-sm font-black text-white">Autobusy.cz</div><div className="mt-1 text-sm font-semibold leading-6 text-white/55">{t.brokerageNote || "Jeden kontakt, jasný postup a průběžná komunikace od prvního zavolání až po dokončení obchodu."}</div></motion.div></div></div><div className="p-5 sm:p-8 lg:p-10"><div className="grid gap-4">{t.brokerage.items.map(([num, title, text], index) => { const Icon = icons[index] || ClipboardList; return <motion.div key={num} variants={fadeUp} whileHover={{ y: -4 }} className="group relative rounded-[1.8rem] bg-white p-5 shadow-sm ring-1 ring-black/10 transition hover:shadow-[0_22px_70px_rgba(10,16,32,0.12)] sm:p-6"><div className="grid gap-4 sm:grid-cols-[3.5rem_1fr] sm:items-start"><div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff1e9] text-[#e65a26] shadow-sm ring-1 ring-[#e65a26]/10 transition-all duration-300 group-hover:bg-[#e65a26] group-hover:text-white"><Icon className="h-6 w-6" /></div><div><div className="flex items-center gap-3"><div className="text-xs font-black uppercase tracking-[0.22em] text-[#e65a26]">{num}</div>{index === t.brokerage.items.length - 1 && <div className="rounded-full bg-[#dcfce7] px-3 py-1 text-[11px] font-black uppercase tracking-wide text-[#16a34a]">hotovo</div>}</div><h3 className="mt-1 text-xl font-black tracking-[-0.035em] text-[#0a1020]">{title}</h3><p className="mt-2 text-sm font-semibold leading-6 text-[#0a1020]/56">{text}</p></div></div></motion.div>; })}</div></div></div></motion.div></div></section>;
}

function WhySection({ t }) {
  const icons = [Gauge, ClipboardList, Users, Handshake];
  return <section className="relative overflow-hidden bg-[#fffcf7] py-16 lg:py-20"><div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_22%,rgba(230,90,38,0.10),transparent_28%),radial-gradient(circle_at_85%_18%,rgba(10,16,32,0.06),transparent_24%)]" /><div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} variants={stagger} className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end"><div><motion.div variants={fadeUp} className="text-xs font-black uppercase tracking-[0.26em] text-[#e65a26]">{t.why.eyebrow}</motion.div><motion.h2 variants={fadeUp} className="mt-4 text-4xl font-black leading-[0.98] tracking-[-0.06em] text-[#0a1020] sm:text-6xl">{t.why.title}</motion.h2><motion.p variants={fadeUp} className="mt-5 max-w-2xl text-base font-semibold leading-8 text-[#0a1020]/58">{t.why.text}</motion.p></div><div className="grid gap-4 sm:grid-cols-2">{t.why.items.map(([title, text], index) => { const Icon = icons[index] || ClipboardList; return <motion.div key={title} variants={fadeUp} whileHover={{ y: -4 }} className="rounded-[1.8rem] bg-white p-6 shadow-[0_18px_60px_rgba(10,16,32,0.08)] ring-1 ring-black/5"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff1e9] text-[#e65a26]"><Icon className="h-5 w-5" /></div><h3 className="mt-4 text-xl font-black tracking-[-0.035em] text-[#0a1020]">{title}</h3><p className="mt-2 text-sm font-semibold leading-6 text-[#0a1020]/55">{text}</p></motion.div>; })}</div></motion.div></div></section>;
}

function getVehicleStatusLabel(vehicle, index = 0) {
  if (vehicle.status === "sold") return "Prodáno";
  if (vehicle.status === "reserved") return "Rezervováno";
  if (vehicle.status === "draft" || vehicle.visible === false) return "Skryto";
  if (vehicle.featured || index === 0) return "Top nabídka";
  if (vehicle.priceNumber === 0 || String(vehicle.price || "").toLowerCase().includes("dotaz")) return "Cena na dotaz";
  return "Novinka";
}
function getVehicleStatusClass(vehicle, index = 0) {
  if (vehicle.status === "sold") return "bg-[#0a1020] text-white";
  if (vehicle.status === "reserved") return "bg-amber-100 text-amber-800";
  if (vehicle.status === "draft" || vehicle.visible === false) return "bg-red-50 text-red-700";
  if (vehicle.featured || index === 0) return "bg-[#e65a26] text-white";
  return "bg-white/92 text-[#0a1020]";
}

function VehicleDetailModal({ vehicle, t, onClose }) {
  useEffect(() => { if (!vehicle) return; const onKeyDown = (event) => { if (event.key === "Escape") onClose(); }; document.addEventListener("keydown", onKeyDown); return () => document.removeEventListener("keydown", onKeyDown); }, [vehicle, onClose]);
  if (!vehicle) return null;
  const specs = [["Značka", vehicle.brand], ["Model", vehicle.model], ["Typ", vehicle.type], ["Rok", vehicle.year], ["1. registrace", vehicle.firstRegistration], ["Nájezd", vehicle.mileage], ["Míst k sezení", vehicle.seats], ["Míst ke stání", vehicle.standingPlaces], ["Emisní norma", vehicle.emission], ["Převodovka", vehicle.gearbox], ["Palivo", vehicle.fuel], ["Motor", vehicle.engine], ["Výkon", vehicle.power], ["Délka", vehicle.length], ["Počet dveří", vehicle.doors], ["STK", vehicle.stk], ["Servisní historie", vehicle.serviceHistory], ["Technický stav", vehicle.condition], [t.detailModal.location, vehicle.location], [t.detailModal.availability, vehicle.availability]].filter(([, value]) => value);
  return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[80] flex items-end justify-center bg-[#0a1020]/62 p-3 backdrop-blur-sm sm:items-center sm:p-6" onClick={onClose}><motion.div initial={{ opacity: 0, y: 28, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.28 }} className="max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-[0_40px_140px_rgba(0,0,0,0.35)]" onClick={(event) => event.stopPropagation()}><div className="grid lg:grid-cols-[1.05fr_0.95fr]"><div className="relative min-h-[280px] bg-[#f4efe7] lg:min-h-[620px]">{vehicle.image ? <img src={vehicle.image} alt={vehicle.title} className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center bg-[#f4efe7]"><RouteBusIcon className="h-40 w-72 opacity-80" /></div>}<button type="button" onClick={onClose} className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-[#0a1020] shadow-lg backdrop-blur-xl transition hover:bg-white" aria-label={t.detailModal.close}><X className="h-5 w-5" /></button><div className="absolute bottom-4 left-4 rounded-full bg-[#e65a26] px-4 py-2 text-xs font-black uppercase tracking-wide text-white shadow-lg">{vehicle.price}</div><div className={cn("absolute left-4 top-4 rounded-full px-4 py-2 text-xs font-black uppercase tracking-wide shadow-lg", getVehicleStatusClass(vehicle))}>{getVehicleStatusLabel(vehicle)}</div></div><div className="max-h-[92vh] overflow-y-auto p-5 sm:p-8 lg:p-10"><div className="text-sm font-black uppercase tracking-[0.22em] text-[#e65a26]">{vehicle.subtitle}</div><h3 className="mt-3 text-3xl font-black leading-[1.02] tracking-[-0.055em] text-[#0a1020] sm:text-5xl">{vehicle.title}</h3><p className="mt-5 text-base font-semibold leading-8 text-[#0a1020]/58">{vehicle.description}</p><div className="mt-5 rounded-2xl bg-[#fffcf7] px-4 py-3 text-xs font-bold leading-5 text-[#0a1020]/48 ring-1 ring-black/5"><span className="mr-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#0a1020]/8 text-[11px] font-black text-[#0a1020]/55">i</span>{BROKERAGE_NOTICE}</div><div className="mt-7 rounded-[1.6rem] bg-[#fffcf7] p-5 ring-1 ring-black/5"><div className="text-sm font-black text-[#0a1020]">{t.detailModal.specs}</div><div className="mt-4 grid gap-3 sm:grid-cols-2">{specs.map(([label, value]) => <div key={label} className="rounded-2xl bg-white px-4 py-3 ring-1 ring-black/5"><div className="text-[11px] font-black uppercase tracking-wide text-[#0a1020]/36">{label}</div><div className="mt-1 text-sm font-black text-[#0a1020]">{value}</div></div>)}</div></div><div className="mt-6"><div className="text-sm font-black text-[#0a1020]">{t.detailModal.equipment}</div><div className="mt-3 flex flex-wrap gap-2">{(vehicle.equipment || []).map((item) => <span key={item} className="rounded-full bg-[#fff1e9] px-3 py-2 text-xs font-black text-[#e65a26] ring-1 ring-[#e65a26]/10">{item}</span>)}</div></div><div className="mt-8 grid gap-3 sm:grid-cols-2"><a href="#kontakt" onClick={onClose} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#e65a26] px-5 py-4 text-sm font-black text-white shadow-[0_18px_45px_rgba(230,90,38,0.24)] transition hover:bg-[#ce4e20]">{t.detailModal.ask} <ArrowRight className="h-4 w-4" /></a><a href={CONTACT.phoneHref} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0a1020] px-5 py-4 text-sm font-black text-white transition hover:bg-black"><Phone className="h-4 w-4" /> {t.detailModal.call}</a></div></div></div></motion.div></motion.div>;
}

function ListingCard({ vehicle, index, t, onOpen }) {
  return <motion.article initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ delay: index * 0.08, duration: 0.55 }} whileHover={{ y: -6 }} className="group overflow-hidden rounded-[1.6rem] bg-white shadow-sm ring-1 ring-black/10 transition hover:shadow-2xl hover:shadow-black/10"><button type="button" onClick={() => onOpen(vehicle)} className="block w-full text-left"><div className="relative h-56 overflow-hidden bg-[#f4efe7]">{vehicle.image ? <img src={vehicle.image} alt={vehicle.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" /> : <div className="flex h-full w-full items-center justify-center"><RouteBusIcon className="h-28 w-56 opacity-75" /></div>}<div className={cn("absolute left-4 top-4 rounded-full px-3 py-1.5 text-xs font-black uppercase tracking-wide shadow-lg", getVehicleStatusClass(vehicle, index))}>{getVehicleStatusLabel(vehicle, index)}</div><div className="absolute inset-x-4 bottom-4 translate-y-4 rounded-2xl bg-white/92 px-4 py-3 text-sm font-black text-[#0a1020] opacity-0 shadow-lg backdrop-blur-xl transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">{t.detail} →</div></div><div className="p-5"><div className="text-sm font-bold text-[#0a1020]/45">{vehicle.subtitle}</div><h3 className="mt-1 text-xl font-black tracking-tight text-[#0a1020]">{vehicle.title}</h3><div className="mt-4 flex flex-wrap gap-3 text-xs font-bold text-[#0a1020]/48"><span className="inline-flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" /> {vehicle.year}</span><span className="inline-flex items-center gap-1.5"><Gauge className="h-3.5 w-3.5" /> {vehicle.mileage}</span><span className="inline-flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> {vehicle.seats}</span><span className="inline-flex items-center gap-1.5"><Bus className="h-3.5 w-3.5" /> {vehicle.type}</span></div><div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-[#0a1020]/42"><span>{vehicle.location}</span>{vehicle.emission && <span>• {vehicle.emission}</span>}</div><div className="mt-5 flex items-center justify-between gap-3"><div className="text-2xl font-black text-[#e65a26]">{vehicle.price}</div><span className={cn("shrink-0 rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-wide", getVehicleStatusClass(vehicle, index))}>{getVehicleStatusLabel(vehicle, index)}</span></div><div className="mt-5 flex items-center justify-between rounded-full border border-black/10 px-4 py-3 text-sm font-black text-[#0a1020] transition group-hover:border-[#e65a26] group-hover:text-[#e65a26]">{t.detail} <ArrowRight className="h-4 w-4" /></div></div></button></motion.article>;
}

function Listings({ t, onOpenAll, vehiclesData = vehicles }) {
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const carouselRef = useRef(null);
  const pausedRef = useRef(false);
  const visibleVehicles = vehiclesData.filter((vehicle) => vehicle.visible !== false && vehicle.status !== "draft");
  useEffect(() => { const carousel = carouselRef.current; if (!carousel) return; const interval = window.setInterval(() => { if (pausedRef.current || !carouselRef.current) return; const el = carouselRef.current; const maxScroll = el.scrollWidth - el.clientWidth; const step = Math.min(390, Math.max(280, el.clientWidth * 0.78)); if (el.scrollLeft + step >= maxScroll - 20) el.scrollTo({ left: 0, behavior: "smooth" }); else el.scrollBy({ left: step, behavior: "smooth" }); }, 3600); return () => window.clearInterval(interval); }, []);
  const scrollCarousel = (direction) => { const el = carouselRef.current; if (!el) return; pausedRef.current = true; const step = Math.min(420, Math.max(300, el.clientWidth * 0.82)); const maxScroll = el.scrollWidth - el.clientWidth; const nextLeft = direction === "next" ? Math.min(el.scrollLeft + step, maxScroll) : Math.max(el.scrollLeft - step, 0); el.scrollTo({ left: nextLeft, behavior: "smooth" }); window.setTimeout(() => { pausedRef.current = false; }, 1200); };
  return <section id="nabidka" className="bg-white py-20 lg:py-24"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} variants={stagger} className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><motion.div variants={fadeUp} className="text-xs font-black uppercase tracking-[0.26em] text-[#e65a26]">{t.listingsEyebrow}</motion.div><motion.h2 variants={fadeUp} className="mt-3 text-4xl font-black tracking-[-0.055em] text-[#0a1020] sm:text-6xl">{t.listingsTitle}</motion.h2><motion.p variants={fadeUp} className="mt-3 max-w-2xl text-base font-semibold leading-7 text-[#0a1020]/55">{t.listingsText}</motion.p></div><motion.div variants={fadeUp} className="flex flex-wrap gap-3"><Button type="button" variant="dark" onClick={onOpenAll}>{t.viewAllListings} <ArrowRight className="h-4 w-4" /></Button><Button href="#kontakt" variant="ghost">{t.similar} <ArrowRight className="h-4 w-4" /></Button></motion.div></motion.div><div className="group/carousel relative mt-10"><button type="button" onMouseEnter={() => scrollCarousel("prev")} onClick={() => scrollCarousel("prev")} aria-label="Předchozí autobusy" className="absolute bottom-6 left-0 top-0 z-20 hidden w-24 items-center justify-start bg-gradient-to-r from-white via-white/82 to-transparent pl-2 opacity-0 transition duration-300 group-hover/carousel:opacity-100 md:flex"><span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#0a1020] shadow-[0_16px_42px_rgba(10,16,32,0.18)] ring-1 ring-black/10 transition hover:scale-105 hover:bg-[#e65a26] hover:text-white"><ChevronLeft className="h-6 w-6" /></span></button><button type="button" onMouseEnter={() => scrollCarousel("next")} onClick={() => scrollCarousel("next")} aria-label="Další autobusy" className="absolute bottom-6 right-0 top-0 z-20 hidden w-24 items-center justify-end bg-gradient-to-l from-white via-white/82 to-transparent pr-2 opacity-0 transition duration-300 group-hover/carousel:opacity-100 md:flex"><span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#0a1020] shadow-[0_16px_42px_rgba(10,16,32,0.18)] ring-1 ring-black/10 transition hover:scale-105 hover:bg-[#e65a26] hover:text-white"><ChevronRight className="h-6 w-6" /></span></button><div ref={carouselRef} onMouseEnter={() => { pausedRef.current = true; }} onMouseLeave={() => { pausedRef.current = false; }} onTouchStart={() => { pausedRef.current = true; }} onTouchEnd={() => { pausedRef.current = false; }} className="flex snap-x gap-6 overflow-x-auto scroll-smooth pb-6 pr-8 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">{visibleVehicles.map((vehicle, index) => <div key={vehicle.id} className="w-[20rem] shrink-0 snap-start md:w-[23rem]"><ListingCard vehicle={vehicle} index={index} t={t} onOpen={setSelectedVehicle} /></div>)}</div></div></div><VehicleDetailModal vehicle={selectedVehicle} t={t} onClose={() => setSelectedVehicle(null)} /></section>;
}

function AllListingsPage({ t, onBack, vehiclesData = vehicles }) {
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [filters, setFilters] = useState({ search: "", brand: "", type: "", year: "", seats: "" });
  const visibleVehicles = vehiclesData.filter((vehicle) => vehicle.visible !== false && vehicle.status !== "draft");
  const brands = Array.from(new Set(visibleVehicles.map((vehicle) => vehicle.brand).filter(Boolean))).sort();
  const types = Array.from(new Set(visibleVehicles.map((vehicle) => vehicle.type).filter(Boolean))).sort();
  const filteredVehicles = visibleVehicles.filter((vehicle) => { const query = filters.search.trim().toLowerCase(); const matchesSearch = !query || [vehicle.title, vehicle.subtitle, vehicle.brand, vehicle.type, vehicle.description].join(" ").toLowerCase().includes(query); return matchesSearch && (!filters.brand || vehicle.brand === filters.brand) && (!filters.type || vehicle.type === filters.type) && (!filters.year || vehicle.yearNumber >= Number(filters.year)) && (!filters.seats || vehicle.seatsNumber >= Number(filters.seats)); });
  const inputClass = "w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-bold outline-none transition focus:border-[#e65a26] focus:ring-4 focus:ring-[#e65a26]/10";
  return <main className="min-h-screen bg-white pb-20 text-[#0a1020]"><div className="bg-[#fffcf7] px-4 pb-12 pt-8 sm:px-6 lg:px-8"><div className="mx-auto max-w-7xl"><div className="mb-8 flex flex-col gap-4 rounded-[2rem] bg-white p-5 shadow-[0_18px_60px_rgba(10,16,32,0.08)] ring-1 ring-black/5 sm:flex-row sm:items-center sm:justify-between"><Logo /><button type="button" onClick={onBack} className="rounded-full bg-[#0a1020] px-5 py-3 text-sm font-black text-white transition hover:bg-black">← Zpět na hlavní stránku</button></div><div className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr] lg:items-end"><div><div className="text-xs font-black uppercase tracking-[0.26em] text-[#e65a26]">{t.listingsEyebrow}</div><h1 className="mt-4 text-5xl font-black leading-[0.95] tracking-[-0.065em] sm:text-7xl">{t.allListingsTitle}</h1><p className="mt-5 max-w-2xl text-lg font-semibold leading-8 text-[#0a1020]/58">{t.allListingsText}</p></div><div className="rounded-[2rem] bg-white p-5 shadow-[0_18px_60px_rgba(10,16,32,0.08)] ring-1 ring-black/5"><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"><input className={cn(inputClass, "sm:col-span-2 lg:col-span-3")} placeholder={t.filterSearch} value={filters.search} onChange={(e) => setFilters((current) => ({ ...current, search: e.target.value }))} /><select className={inputClass} value={filters.brand} onChange={(e) => setFilters((current) => ({ ...current, brand: e.target.value }))}><option value="">{t.filterBrand}: {t.filterAll}</option>{brands.map((brand) => <option key={brand} value={brand}>{brand}</option>)}</select><select className={inputClass} value={filters.type} onChange={(e) => setFilters((current) => ({ ...current, type: e.target.value }))}><option value="">{t.filterType}: {t.filterAll}</option>{types.map((type) => <option key={type} value={type}>{type}</option>)}</select><div className="grid grid-cols-2 gap-3"><input className={inputClass} placeholder={t.filterYear} value={filters.year} onChange={(e) => setFilters((current) => ({ ...current, year: e.target.value }))} /><input className={inputClass} placeholder={t.filterSeats} value={filters.seats} onChange={(e) => setFilters((current) => ({ ...current, seats: e.target.value }))} /></div></div><div className="mt-4 text-sm font-black text-[#0a1020]/48">{filteredVehicles.length} / {visibleVehicles.length} inzerátů</div></div></div></div></div><section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"><div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{filteredVehicles.map((vehicle, index) => <ListingCard key={vehicle.id} vehicle={vehicle} index={index} t={t} onOpen={setSelectedVehicle} />)}</div></section><VehicleDetailModal vehicle={selectedVehicle} t={t} onClose={() => setSelectedVehicle(null)} /></main>;
}

function SuccessActions({ compact = false }) {
  return <div className={cn("grid gap-2", compact ? "mt-3 sm:grid-cols-2" : "mt-4 sm:grid-cols-2")}><a href={CONTACT.phoneHref} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0a1020] px-4 py-3 text-xs font-black text-white transition hover:bg-black"><Phone className="h-4 w-4" /> Zavolat</a><a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-xs font-black text-white transition hover:bg-[#1fb85a]"><MessageCircle className="h-4 w-4" /> WhatsApp</a></div>;
}

function NewsletterSignup({ t, onFormSubmit = () => {} }) {
  const [status, setStatus] = useState("idle");
  const [pending, setPending] = useState(false);
  const submitNewsletter = async (event) => { event.preventDefault(); setPending(true); setStatus("idle"); const payload = Object.fromEntries(new FormData(event.currentTarget).entries()); payload.type = "Odběr nových inzerátů"; payload.source = "Autobusy.cz"; payload.createdAt = new Date().toISOString(); payload.createdAtDisplay = new Date().toLocaleString("cs-CZ"); try { const response = await fetch("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }); if (!response.ok) throw new Error("Newsletter se nepodařilo uložit."); onFormSubmit({ ...payload, deliveryStatus: "odesláno backendem", category: "newsletter" }); setStatus("success"); event.currentTarget.reset(); } catch (error) { onFormSubmit({ ...payload, deliveryStatus: "fallback e-mail", category: "newsletter" }); setStatus("mailFallback"); } finally { setPending(false); } };
  return <section id="odber" className="relative overflow-hidden bg-[#0a1020] py-16 text-white lg:py-20"><div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(230,90,38,0.22),transparent_26%),radial-gradient(circle_at_86%_40%,rgba(37,99,235,0.14),transparent_30%)]" /><div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div className="grid gap-8 rounded-[2.4rem] bg-white/8 p-5 ring-1 ring-white/10 backdrop-blur-2xl sm:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center"><div><div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white/62 ring-1 ring-white/10"><Mail className="h-4 w-4 text-[#f1a37f]" /> Newsletter</div><h2 className="mt-5 text-4xl font-black tracking-[-0.055em] sm:text-6xl">{t.newsletterTitle}</h2><p className="mt-5 max-w-2xl text-base font-semibold leading-7 text-white/58">{t.newsletterText}</p></div><form onSubmit={submitNewsletter} className="rounded-[2rem] bg-white p-5 text-[#0a1020] shadow-2xl shadow-black/20 sm:p-6"><div className="grid gap-3 sm:grid-cols-[1fr_auto]"><input required name="email" type="email" placeholder={t.emailPlaceholder} className="rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm font-bold outline-none transition focus:border-[#e65a26] focus:ring-4 focus:ring-[#e65a26]/10" /><button type="submit" disabled={pending} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#e65a26] px-6 py-4 text-sm font-black text-white shadow-[0_18px_45px_rgba(230,90,38,0.24)] transition hover:bg-[#ce4e20] disabled:cursor-not-allowed disabled:opacity-60">{pending ? "Odesílám…" : t.newsletterButton} <ArrowRight className="h-4 w-4" /></button></div><label className="mt-4 flex items-start gap-3 text-xs font-bold leading-5 text-[#0a1020]/58"><input required name="consent" value="ano" type="checkbox" className="mt-1 h-4 w-4 rounded border-black/20 text-[#e65a26] focus:ring-[#e65a26]" /><span>{t.form.consent}</span></label>{status === "success" && <div className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">Odběr byl uložen. Nové nabídky vám pošleme na zadaný e-mail.<SuccessActions compact /></div>}{status === "mailFallback" && <div className="mt-4 rounded-2xl bg-orange-50 px-4 py-3 text-sm font-bold text-orange-700">Backend není dostupný, ale záznam je v náhledu evidovaný.</div>}<p className="mt-4 text-xs font-bold leading-5 text-[#0a1020]/42">Odesláním formuláře souhlasíte se zpracováním osobních údajů. <button type="button" onClick={() => openLegalModal("privacy")} className="font-black text-[#e65a26] underline-offset-4 hover:underline">Ochrana osobních údajů</button>.</p></form></div></div></section>;
}

function LeadForm({ t, onFormSubmit = () => {} }) {
  const [leadType, setLeadType] = useState("sell");
  const [status, setStatus] = useState("idle");
  const [pending, setPending] = useState(false);
  useEffect(() => { const handleOpenLead = (event) => { const type = event.detail?.type === "buy" ? "buy" : "sell"; setLeadType(type); setStatus("idle"); }; window.addEventListener("autobusy-open-lead", handleOpenLead); return () => window.removeEventListener("autobusy-open-lead", handleOpenLead); }, []);
  const isSell = leadType === "sell"; const f = t.form;
  const submitLead = async (event) => { event.preventDefault(); setPending(true); setStatus("idle"); const payload = Object.fromEntries(new FormData(event.currentTarget).entries()); payload.type = isSell ? "Prodej autobusu" : "Poptávka koupě"; payload.source = "Autobusy.cz"; payload.createdAt = new Date().toISOString(); payload.createdAtDisplay = new Date().toLocaleString("cs-CZ"); try { const response = await fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }); if (!response.ok) throw new Error("Formulář se nepodařilo odeslat."); onFormSubmit({ ...payload, deliveryStatus: "odesláno backendem", category: "lead" }); setStatus("success"); event.currentTarget.reset(); } catch (error) { onFormSubmit({ ...payload, deliveryStatus: "fallback e-mail", category: "lead" }); setStatus("mailFallback"); } finally { setPending(false); } };
  const inputClass = "w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-bold outline-none transition focus:border-[#e65a26] focus:ring-4 focus:ring-[#e65a26]/10"; const hintClass = "mt-1 text-xs font-bold text-[#0a1020]/38";
  return <form onSubmit={submitLead} className="rounded-[1.8rem] bg-white p-5 shadow-sm ring-1 ring-black/10 sm:p-6"><div className="mb-5 grid grid-cols-2 rounded-full bg-[#f4efe7] p-1"><button type="button" onClick={() => setLeadType("sell")} className={cn("rounded-full px-4 py-3 text-sm font-black transition", isSell ? "bg-[#0a1020] text-white" : "text-[#0a1020]/55")}>{t.sellCta}</button><button type="button" onClick={() => setLeadType("buy")} className={cn("rounded-full px-4 py-3 text-sm font-black transition", !isSell ? "bg-[#0a1020] text-white" : "text-[#0a1020]/55")}>{t.buyCta}</button></div><div className="grid gap-4"><div className="grid gap-4 sm:grid-cols-2"><div><input required name="name" className={inputClass} placeholder={f.name} /><div className={hintClass}>{f.nameHint || f.name}</div></div><div><input required name="phone" className={inputClass} placeholder={f.phone} /><div className={hintClass}>{f.phoneHint || f.phone}</div></div></div><div><input required name="email" type="email" className={inputClass} placeholder={f.email} /><div className={hintClass}>{f.emailHint || f.email}</div></div>{isSell ? <><div className="grid gap-4 sm:grid-cols-2"><div><input required name="sellModel" className={inputClass} placeholder={f.sellModel} /><div className={hintClass}>{f.sellModelHint}</div></div><div><input name="year" className={inputClass} placeholder={f.year} /><div className={hintClass}>{f.yearHint}</div></div></div><div className="grid gap-4 sm:grid-cols-3"><div><input name="mileage" className={inputClass} placeholder={f.mileage} /><div className={hintClass}>{f.mileageHint}</div></div><div><input name="seats" className={inputClass} placeholder={f.seats} /><div className={hintClass}>{f.seatsHint}</div></div><div><input name="price" className={inputClass} placeholder={f.price} /><div className={hintClass}>{f.priceHint}</div></div></div><div><textarea name="note" className={cn(inputClass, "min-h-32 resize-none")} placeholder={f.sellNote} /><div className={hintClass}>{f.sellNoteHint}</div></div></> : <><div className="grid gap-4 sm:grid-cols-2"><div><input required name="buyType" className={inputClass} placeholder={f.buyType} /><div className={hintClass}>{f.buyTypeHint}</div></div><div><input name="seatsWanted" className={inputClass} placeholder={f.seats} /><div className={hintClass}>{f.seatsHint}</div></div></div><div className="grid gap-4 sm:grid-cols-3"><div><input name="budget" className={inputClass} placeholder={f.budget} /><div className={hintClass}>{f.budgetHint}</div></div><div><input name="emissionRequest" className={inputClass} placeholder={f.emission} /><div className={hintClass}>{f.emissionHint}</div></div><div><input name="term" className={inputClass} placeholder={f.term} /><div className={hintClass}>{f.termHint}</div></div></div><div><textarea name="buyNote" className={cn(inputClass, "min-h-32 resize-none")} placeholder={f.buyNote} /><div className={hintClass}>{f.buyNoteHint}</div></div></>}<label className="flex items-start gap-3 text-xs font-bold leading-5 text-[#0a1020]/55"><input required name="consent" value="ano" type="checkbox" className="mt-1 h-4 w-4 rounded border-black/20 text-[#e65a26] focus:ring-[#e65a26]" /><span>{f.consent}</span></label>{status === "success" && <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">Děkujeme, zprávu jsme přijali. Ozveme se vám co nejdříve.<SuccessActions compact /></div>}{status === "mailFallback" && <div className="rounded-2xl bg-orange-50 px-4 py-3 text-sm font-bold text-orange-700">Backend není dostupný, ale záznam je v náhledu evidovaný.</div>}<button type="submit" disabled={pending} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#e65a26] px-6 py-4 text-sm font-black text-white shadow-[0_18px_45px_rgba(230,90,38,0.24)] transition hover:bg-[#ce4e20] disabled:cursor-not-allowed disabled:opacity-60">{pending ? "Odesílám…" : isSell ? f.submitSell : f.submitBuy} <ArrowRight className="h-4 w-4" /></button><p className="text-xs font-bold leading-5 text-[#0a1020]/42">Odesláním formuláře souhlasíte se zpracováním osobních údajů. <button type="button" onClick={() => openLegalModal("privacy")} className="font-black text-[#e65a26] underline-offset-4 hover:underline">Ochrana osobních údajů</button>.</p></div></form>;
}

function Contact({ t, onFormSubmit = () => {} }) {
  return <section id="kontakt" className="bg-white py-20 lg:py-24"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div className="grid gap-8 rounded-[2.4rem] bg-[#0a1020] p-5 text-white shadow-[0_34px_110px_rgba(10,16,32,0.18)] lg:grid-cols-[0.85fr_1.15fr] lg:p-8"><div className="p-4 sm:p-6"><div className="text-xs font-black uppercase tracking-[0.26em] text-[#f1a37f]">{t.contactEyebrow}</div><h2 className="mt-4 text-4xl font-black tracking-[-0.055em] sm:text-6xl">{t.contactTitle}</h2><p className="mt-5 text-lg font-semibold leading-8 text-white/58">{t.contactText}</p><div className="mt-6 rounded-2xl bg-white/8 px-5 py-4 text-lg font-black tracking-[-0.02em] text-white ring-1 ring-white/10">{t.contactCompany || CONTACT.company}</div><div className="mt-6 grid gap-4 font-bold text-white/72"><a href={CONTACT.phoneHref} className="group flex items-center gap-4 rounded-2xl bg-white/8 p-5 ring-1 ring-white/10 transition hover:bg-white/12"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-[#f1a37f] transition group-hover:bg-[#e65a26] group-hover:text-white"><Phone className="h-6 w-6" /></span><span className="text-2xl font-black tracking-[-0.035em] text-white sm:text-3xl">{CONTACT.phone}</span></a><a href={`mailto:${CONTACT.email}`} className="group flex items-center gap-4 rounded-2xl bg-white/8 p-5 ring-1 ring-white/10 transition hover:bg-white/12"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-[#f1a37f] transition group-hover:bg-[#e65a26] group-hover:text-white"><Mail className="h-6 w-6" /></span><span className="text-xl font-black tracking-[-0.03em] text-white sm:text-2xl">{CONTACT.email}</span></a><a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 rounded-2xl bg-white/8 p-5 ring-1 ring-white/10 transition hover:bg-white/12"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-[#25D366] transition group-hover:bg-[#25D366] group-hover:text-white"><MessageCircle className="h-6 w-6" /></span><span className="text-xl font-black tracking-[-0.03em] text-white sm:text-2xl">WhatsApp</span></a></div></div><LeadForm t={t} onFormSubmit={onFormSubmit} /></div></div></section>;
}

function LegalModal({ type, onClose, t = COPY.cs }) {
  useEffect(() => { if (!type) return; const onKeyDown = (event) => { if (event.key === "Escape") onClose(); }; document.addEventListener("keydown", onKeyDown); return () => document.removeEventListener("keydown", onKeyDown); }, [type, onClose]);
  if (!type) return null;
  const content = LEGAL_CONTENT[type] || LEGAL_CONTENT.terms;
  return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[90] flex items-end justify-center bg-[#0a1020]/62 p-3 backdrop-blur-sm sm:items-center sm:p-6" onClick={onClose}><motion.div initial={{ opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.24 }} className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] bg-white p-6 shadow-[0_40px_140px_rgba(0,0,0,0.35)] sm:p-8" onClick={(event) => event.stopPropagation()}><div className="flex items-start justify-between gap-5"><div><div className="text-xs font-black uppercase tracking-[0.26em] text-[#e65a26]">Autobusy.cz</div><h2 className="mt-3 text-3xl font-black tracking-[-0.05em] text-[#0a1020] sm:text-5xl">{content.title}</h2></div><button type="button" onClick={onClose} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f4efe7] text-[#0a1020] transition hover:bg-[#eee7dc]" aria-label="Zavřít"><X className="h-5 w-5" /></button></div><div className="mt-7 grid gap-4 text-sm font-semibold leading-7 text-[#0a1020]/62">{content.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>{content.operator && <div className="mt-7 rounded-[1.4rem] bg-[#fffcf7] p-5 text-sm font-bold leading-7 text-[#0a1020]/62 ring-1 ring-black/5"><div className="font-black text-[#0a1020]">Správce osobních údajů</div><div>{t.contactCompany || CONTACT.company}</div><div>Sídlo: {CONTACT.street}, {CONTACT.city}</div><div>IČO: {CONTACT.ico}</div><div>E-mail: <a href={`mailto:${CONTACT.email}`} className="text-[#e65a26] underline-offset-4 hover:underline">{CONTACT.email}</a></div></div>}</motion.div></motion.div>;
}

function Footer({ t, onAdminOpen, onLegalOpen }) {
  const [showOperatorInfo, setShowOperatorInfo] = useState(false);
  const operatorRef = useRef(null);
  const goTop = (event) => { event.preventDefault(); document.getElementById("top")?.scrollIntoView({ behavior: "smooth", block: "start" }); };
  const showContactInfo = (event) => { event?.preventDefault?.(); setShowOperatorInfo(true); window.setTimeout(() => operatorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 80); };
  const footerTitleClass = "text-sm font-black uppercase tracking-[0.12em] text-[#0a1020]/72";
  const footerTextClass = "text-sm font-semibold leading-6 text-[#0a1020]/52 transition hover:text-[#0a1020]";
  const footerGridClass = "mt-4 grid gap-2";
  const legalButtonClass = cn("text-left underline-offset-4 hover:underline", footerTextClass);
  return <footer className="bg-[#fffcf7] py-10"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div className="grid gap-8 border-t border-black/10 pt-8 sm:grid-cols-2 lg:grid-cols-4"><div><a href="#top" onClick={goTop} aria-label="Autobusy.cz - zpět nahoru"><Logo /></a><p className="mt-4 text-sm font-semibold leading-6 text-[#0a1020]/52">{t.footerText}</p></div><div><div className={footerTitleClass}>Menu</div><div className={footerGridClass}><a href="#nabidka" className={footerTextClass}>{t.nav[0]}</a><a href="#jak-to-funguje" className={footerTextClass}>{t.brokerageNav}</a><a href="#odber" className={footerTextClass}>{t.nav[1]}</a><a href="#kontakt" onClick={() => setShowOperatorInfo(true)} className={footerTextClass}>{t.nav[3]}</a></div></div><div><div className={footerTitleClass}>Právní informace</div><div className={footerGridClass}><button type="button" onClick={() => onLegalOpen("terms")} className={legalButtonClass}>{LEGAL_LINKS.terms}</button><button type="button" onClick={() => onLegalOpen("privacy")} className={legalButtonClass}>{LEGAL_LINKS.privacy}</button><button type="button" onClick={() => onLegalOpen("cookies")} className={legalButtonClass}>{LEGAL_LINKS.cookies}</button><button type="button" onClick={showContactInfo} className={legalButtonClass}>Kontakt</button></div></div><div><div className={footerTitleClass}>{t.nav[3]}</div><div className={footerGridClass}><span className={footerTextClass}>{t.contactCompany || CONTACT.company}</span><a href={CONTACT.phoneHref} className={footerTextClass}>{CONTACT.phone}</a><a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className={footerTextClass}>WhatsApp</a><a href={`mailto:${CONTACT.email}`} className={footerTextClass}>{CONTACT.email}</a></div></div></div>{showOperatorInfo && <motion.div ref={operatorRef} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-8 rounded-[1.4rem] bg-white/70 p-5 text-xs font-bold leading-6 text-[#0a1020]/48 ring-1 ring-black/5"><div className="font-black text-[#0a1020]/62">Provozovatel webu</div><div>{CONTACT.company}</div><div>Sídlo: {CONTACT.street}, {CONTACT.city}</div><div>IČO: {CONTACT.ico}</div><div>DIČ: {CONTACT.dic}</div><div>Zapsáno v: obchodní rejstřík / živnostenský rejstřík</div><div>E-mail: <a href={`mailto:${CONTACT.email}`} className="text-[#0a1020]/60 underline-offset-4 hover:underline">{CONTACT.email}</a></div><div>Telefon: <a href={CONTACT.phoneHref} className="text-[#0a1020]/60 underline-offset-4 hover:underline">{CONTACT.phone}</a></div></motion.div>}<div className="mt-6 flex flex-col gap-3 border-t border-black/10 pt-6 text-xs font-bold text-[#0a1020]/40 sm:flex-row sm:items-center sm:justify-between"><div>© 2026 Autobusy.cz</div><a href="/admin" onClick={(event) => { event.preventDefault(); onAdminOpen(); }} className="text-[#0a1020]/40 transition hover:text-[#0a1020]">Admin</a></div><p className="mt-6 border-t border-black/10 pt-5 text-[11px] font-bold leading-5 text-[#0a1020]/38">Provozovatel webu zajišťuje pouze zprostředkování kontaktu mezi prodávajícím a zájemcem o koupi vozidla. Vozidla uvedená v nabídce nejsou ve vlastnictví provozovatele webu, pokud není u konkrétní nabídky výslovně uvedeno jinak. Kupní smlouva je uzavírána přímo mezi prodávajícím a kupujícím.</p></div></footer>;
}

function AdminPanel({ onBack, listings = vehicles, onListingsChange = () => {}, contactsData = [], onContactsChange = () => {}, formSubmissions = [] }) {
  const [login, setLogin] = useState({ username: "admin", password: "" });
  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState("");
  const [adminTab, setAdminTab] = useState("listings");
  const [items, setItems] = useState(() => listings);
  const [contacts, setContacts] = useState(contactsData);
  useEffect(() => setContacts(contactsData), [contactsData]);
  const [form, setForm] = useState({ title: "", brand: "", model: "", type: "Zájezdový", year: "", mileage: "", seats: "", price: "", location: "", description: "", status: "published", visible: true, featured: false, image: "" });
  const [editingId, setEditingId] = useState(null);
  const fieldClass = "w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-bold outline-none transition focus:border-[#e65a26] focus:ring-4 focus:ring-[#e65a26]/10";
  const labelClass = "mb-1 block text-xs font-black uppercase tracking-[0.16em] text-[#0a1020]/42";
  const cardClass = "rounded-[2rem] bg-white p-5 shadow-[0_18px_60px_rgba(10,16,32,0.08)] ring-1 ring-black/5 sm:p-6";
  const syncItems = (next) => { setItems(next); onListingsChange(next); };
  const handleLogin = (event) => { event.preventDefault(); if (login.username === ADMIN_LOGIN.username && login.password === ADMIN_LOGIN.password) { setLoggedIn(true); setMessage(""); } else setMessage("Nesprávné přihlašovací údaje."); };
  const updateContact = (id, key, value) => { const next = contacts.map((contact) => contact.id === id ? { ...contact, [key]: value, updatedAtDisplay: new Date().toLocaleString("cs-CZ") } : contact); setContacts(next); onContactsChange(next); };
  const saveListing = (event) => { event.preventDefault(); const vehicle = { id: editingId || Date.now(), title: form.title || [form.brand, form.model].filter(Boolean).join(" ") || "Nový autobus", subtitle: [form.type, form.status === "sold" ? "prodáno" : ""].filter(Boolean).join(" • "), brand: form.brand, model: form.model, type: form.type, year: form.year || "neuvedeno", yearNumber: Number(form.year) || 0, mileage: form.mileage || "neuvedeno", seats: form.seats ? `${form.seats} míst` : "neuvedeno", seatsNumber: Number(form.seats) || 0, price: form.price || "Cena na dotaz", priceNumber: Number(String(form.price).replace(/[^0-9]/g, "")) || 0, location: form.location || "Na dotaz", description: form.description || "Popis bude doplněn.", equipment: ["výbava bude doplněna"], status: form.status, visible: form.visible, featured: form.featured, image: form.image || "" }; const next = editingId ? items.map((item) => item.id === editingId ? vehicle : item) : [vehicle, ...items]; syncItems(next); setEditingId(null); setForm({ title: "", brand: "", model: "", type: "Zájezdový", year: "", mileage: "", seats: "", price: "", location: "", description: "", status: "published", visible: true, featured: false, image: "" }); };
  const handleEdit = (item) => { setEditingId(item.id); setForm({ title: item.title || "", brand: item.brand || "", model: item.model || "", type: item.type || "Zájezdový", year: item.year === "neuvedeno" ? "" : item.year || "", mileage: item.mileage || "", seats: String(item.seatsNumber || ""), price: item.price === "Cena na dotaz" ? "" : item.price || "", location: item.location || "", description: item.description || "", status: item.status || "published", visible: item.visible !== false, featured: Boolean(item.featured), image: item.image || "" }); window.scrollTo({ top: 0, behavior: "smooth" }); };
  if (!loggedIn) return <main className="min-h-screen bg-[#fffcf7] px-4 py-8 text-[#0a1020]"><div className="mx-auto max-w-xl rounded-[2.4rem] bg-white p-6 shadow-[0_24px_80px_rgba(10,16,32,0.10)] ring-1 ring-black/5 sm:p-8"><Logo /><div className="mt-8 text-xs font-black uppercase tracking-[0.26em] text-[#e65a26]">Administrace</div><h1 className="mt-4 text-4xl font-black tracking-[-0.06em] sm:text-5xl">Přihlášení</h1><form onSubmit={handleLogin} className="mt-7 grid gap-4"><input className={fieldClass} placeholder="Přihlašovací jméno" value={login.username} onChange={(event) => setLogin((current) => ({ ...current, username: event.target.value }))} /><input className={fieldClass} placeholder="Heslo" type="password" value={login.password} onChange={(event) => setLogin((current) => ({ ...current, password: event.target.value }))} />{message && <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{message}</div>}<button className="rounded-full bg-[#e65a26] px-6 py-4 text-sm font-black text-white shadow-[0_18px_45px_rgba(230,90,38,0.24)] transition hover:bg-[#ce4e20]">Přihlásit</button></form><div className="mt-5 rounded-2xl bg-[#fff7ed] px-4 py-3 text-xs font-bold leading-5 text-orange-800 ring-1 ring-orange-200">Toto je prezentační prototyp administrace. Ostré zabezpečení musí řešit server.</div></div></main>;
  return <main className="min-h-screen bg-[#fffcf7] px-4 py-8 text-[#0a1020] sm:px-6 lg:px-8"><div className="mx-auto max-w-7xl"><div className="mb-8 flex flex-col gap-4 rounded-[2rem] bg-white p-5 shadow-[0_18px_60px_rgba(10,16,32,0.08)] ring-1 ring-black/5 sm:flex-row sm:items-center sm:justify-between"><Logo /><div className="flex flex-wrap gap-3"><button type="button" onClick={onBack} className="rounded-full bg-[#0a1020] px-5 py-3 text-sm font-black text-white transition hover:bg-black">Zpět na web</button><button type="button" onClick={() => setLoggedIn(false)} className="rounded-full bg-[#f4efe7] px-5 py-3 text-sm font-black text-[#0a1020]/70 transition hover:bg-[#eee7dc]">Odhlásit</button></div></div><div className="mb-6 grid gap-4 md:grid-cols-4"><div className={cardClass}><div className="text-xs font-black uppercase tracking-wide text-[#0a1020]/36">Celkem inzerátů</div><div className="mt-2 text-4xl font-black">{items.length}</div></div><div className={cardClass}><div className="text-xs font-black uppercase tracking-wide text-[#0a1020]/36">Publikováno</div><div className="mt-2 text-4xl font-black text-[#16a34a]">{items.filter((i) => i.status !== "draft" && i.visible !== false).length}</div></div><div className={cardClass}><div className="text-xs font-black uppercase tracking-wide text-[#0a1020]/36">Kontakty</div><div className="mt-2 text-4xl font-black">{contacts.length}</div></div><div className={cardClass}><div className="text-xs font-black uppercase tracking-wide text-[#0a1020]/36">Formuláře</div><div className="mt-2 text-4xl font-black">{formSubmissions.length}</div></div></div><div className="mb-6 flex flex-wrap gap-2 rounded-[1.6rem] bg-white p-2 shadow-sm ring-1 ring-black/5">{[["listings", "Inzeráty"], ["contacts", "Kontakty"], ["forms", "Vyplněné formuláře"], ["security", "Heslo"]].map(([key, label]) => <button key={key} type="button" onClick={() => setAdminTab(key)} className={cn("rounded-full px-5 py-3 text-sm font-black transition", adminTab === key ? "bg-[#0a1020] text-white" : "text-[#0a1020]/55 hover:bg-black/[0.04]")}>{label}</button>)}</div>{adminTab === "listings" && <div className="grid gap-6 xl:grid-cols-[1fr_1fr]"><section className={cardClass}><div className="text-xs font-black uppercase tracking-[0.26em] text-[#e65a26]">{editingId ? "Úprava inzerátu" : "Nový inzerát"}</div><h2 className="mt-3 text-3xl font-black tracking-[-0.05em]">{editingId ? "Upravit autobus" : "Přidat autobus"}</h2><form onSubmit={saveListing} className="mt-6 grid gap-4 md:grid-cols-2"><div><label className={labelClass}>Název</label><input className={fieldClass} value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} /></div><div><label className={labelClass}>Značka</label><input className={fieldClass} value={form.brand} onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))} /></div><div><label className={labelClass}>Model</label><input className={fieldClass} value={form.model} onChange={(e) => setForm((f) => ({ ...f, model: e.target.value }))} /></div><div><label className={labelClass}>Typ</label><select className={fieldClass} value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}><option>Zájezdový</option><option>Linkový</option><option>Městský</option><option>Minibus</option><option>Midibus</option></select></div><div><label className={labelClass}>Rok</label><input className={fieldClass} value={form.year} onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))} /></div><div><label className={labelClass}>Nájezd</label><input className={fieldClass} value={form.mileage} onChange={(e) => setForm((f) => ({ ...f, mileage: e.target.value }))} /></div><div><label className={labelClass}>Počet míst</label><input className={fieldClass} value={form.seats} onChange={(e) => setForm((f) => ({ ...f, seats: e.target.value }))} /></div><div><label className={labelClass}>Cena</label><input className={fieldClass} value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} /></div><div><label className={labelClass}>Lokalita</label><input className={fieldClass} value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} /></div><div><label className={labelClass}>URL obrázku</label><input className={fieldClass} value={form.image} onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))} /></div><div><label className={labelClass}>Stav</label><select className={fieldClass} value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}><option value="published">Publikováno</option><option value="draft">Koncept</option><option value="reserved">Rezervováno</option><option value="sold">Prodáno</option></select></div><label className="flex items-center gap-3 rounded-2xl bg-[#fffcf7] px-4 py-3 text-sm font-black ring-1 ring-black/5"><input type="checkbox" checked={form.visible} onChange={(e) => setForm((f) => ({ ...f, visible: e.target.checked }))} /> Zobrazit na webu</label><label className="flex items-center gap-3 rounded-2xl bg-[#fffcf7] px-4 py-3 text-sm font-black ring-1 ring-black/5"><input type="checkbox" checked={form.featured} onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))} /> Top nabídka</label><div className="md:col-span-2"><label className={labelClass}>Popis</label><textarea className={cn(fieldClass, "min-h-28")} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} /></div><button className="rounded-full bg-[#e65a26] px-6 py-4 text-sm font-black text-white shadow-[0_18px_45px_rgba(230,90,38,0.24)] transition hover:bg-[#ce4e20]">{editingId ? "Uložit změny" : "Přidat inzerát"}</button></form></section><section className={cardClass}><div className="text-xs font-black uppercase tracking-[0.26em] text-[#e65a26]">Správa nabídky</div><h2 className="mt-3 text-3xl font-black tracking-[-0.05em]">Inzeráty autobusů</h2><div className="mt-6 grid gap-4">{items.map((item, index) => <div key={item.id} className="grid gap-4 rounded-[1.6rem] bg-[#fffcf7] p-4 ring-1 ring-black/5 sm:grid-cols-[2rem_7rem_1fr] sm:items-center"><div className="text-center text-lg font-black text-[#0a1020]/28">☰<div className="text-[10px]">{index + 1}</div></div>{item.image ? <img src={item.image} alt={item.title} className="h-24 w-full rounded-2xl object-cover sm:w-28" /> : <div className="flex h-24 w-full items-center justify-center rounded-2xl bg-[#f4efe7] sm:w-28"><RouteBusIcon className="h-14 w-24 opacity-70" /></div>}<div><div className="flex flex-wrap items-center gap-2"><div className="text-lg font-black tracking-[-0.03em]">{item.title}</div><span className={cn("rounded-full px-2 py-1 text-[10px] font-black uppercase", item.visible !== false ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600")}>{item.visible !== false ? "viditelné" : "skryté"}</span><span className="rounded-full bg-white px-2 py-1 text-[10px] font-black uppercase text-[#0a1020]/45">{item.status || "published"}</span></div><div className="mt-1 flex flex-wrap gap-2 text-xs font-bold text-[#0a1020]/48"><span>{item.year}</span><span>•</span><span>{item.mileage}</span><span>•</span><span>{item.seats}</span><span>•</span><span>{item.location}</span></div><div className="mt-2 text-sm font-black text-[#e65a26]">{item.price}</div><div className="mt-3 flex flex-wrap gap-2"><button type="button" onClick={() => handleEdit(item)} className="rounded-full bg-[#0a1020] px-3 py-2 text-xs font-black text-white">Upravit</button><button type="button" onClick={() => syncItems(items.map((i) => i.id === item.id ? { ...i, visible: i.visible === false } : i))} className="rounded-full bg-white px-3 py-2 text-xs font-black text-[#0a1020] ring-1 ring-black/10">{item.visible !== false ? "Skrýt" : "Zobrazit"}</button><button type="button" onClick={() => syncItems(items.filter((i) => i.id !== item.id))} className="rounded-full bg-red-50 px-3 py-2 text-xs font-black text-red-600 ring-1 ring-red-100">Smazat</button></div></div></div>)}</div></section></div>}{adminTab === "contacts" && <section className={cardClass}><div className="text-xs font-black uppercase tracking-[0.26em] text-[#e65a26]">Evidence kontaktů</div><h2 className="mt-3 text-3xl font-black tracking-[-0.05em]">Kontakty, stav komunikace a interní evidence</h2><div className="mt-6 grid gap-4">{contacts.map((contact) => <div key={contact.id} className="rounded-[1.7rem] bg-[#fffcf7] p-5 ring-1 ring-black/5"><div className="grid gap-4 lg:grid-cols-[1fr_12rem_1.2fr]"><div><div className="text-xs font-black uppercase tracking-wide text-[#e65a26]">{contact.type}</div><div className="mt-1 text-xl font-black">{contact.name}</div><div className="mt-2 text-sm font-bold text-[#0a1020]/55">{contact.phone || "telefon neuveden"} • {contact.email}</div><div className="mt-1 text-sm font-bold text-[#0a1020]/45">{contact.vehicle}</div><div className="mt-1 text-xs font-bold text-[#0a1020]/35">{contact.createdAtDisplay}</div></div><div><label className={labelClass}>Stav kontaktu</label><select className={fieldClass} value={contact.status} onChange={(e) => updateContact(contact.id, "status", e.target.value)}><option>nové</option><option>rozpracováno</option><option>čeká na klienta</option><option>uzavřeno</option><option>archiv</option><option>aktivní</option></select></div><div><label className={labelClass}>Interní poznámka</label><textarea className={cn(fieldClass, "min-h-24")} value={contact.note || ""} onChange={(e) => updateContact(contact.id, "note", e.target.value)} /></div></div></div>)}</div></section>}{adminTab === "forms" && <section className={cardClass}><div className="text-xs font-black uppercase tracking-[0.26em] text-[#e65a26]">Vyplněné formuláře</div><h2 className="mt-3 text-3xl font-black tracking-[-0.05em]">Archiv formulářů z webu</h2><div className="mt-6 grid gap-4">{formSubmissions.map((formItem) => <div key={formItem.id} className="rounded-[1.7rem] bg-[#fffcf7] p-5 ring-1 ring-black/5"><div className="font-black">{formItem.type || "Formulář"}</div><div className="text-sm font-bold text-[#0a1020]/50">{formItem.createdAtDisplay || formItem.createdAt}</div><div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">{Object.entries(formItem).filter(([key]) => !["id", "category"].includes(key)).map(([key, value]) => <div key={key} className="rounded-2xl bg-white px-4 py-3 ring-1 ring-black/5"><div className="text-[11px] font-black uppercase tracking-wide text-[#0a1020]/36">{key}</div><div className="mt-1 break-words text-sm font-bold text-[#0a1020]/68">{String(value || "-")}</div></div>)}</div></div>)}{formSubmissions.length === 0 && <div className="rounded-[1.7rem] bg-[#fffcf7] p-6 text-sm font-bold text-[#0a1020]/55 ring-1 ring-black/5">Zatím nebyl v této relaci odeslán žádný formulář.</div>}</div></section>}{adminTab === "security" && <section className={cardClass}><div className="text-xs font-black uppercase tracking-[0.26em] text-[#e65a26]">Zabezpečení</div><h2 className="mt-3 text-3xl font-black tracking-[-0.05em]">Bezpečnostní poznámka</h2><div className="mt-5 rounded-[1.4rem] bg-orange-50 p-5 text-sm font-bold leading-6 text-orange-800 ring-1 ring-orange-200">Tento prototyp je funkční pro testování. V ostré verzi musí být přihlášení, hesla a práva řešeny výhradně backendem.</div></section>}</div></main>;
}

function MobileBar({ t }) {
  return <motion.div initial={{ y: 80 }} animate={{ y: 0 }} transition={{ delay: 0.8, duration: 0.4 }} className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-4 gap-2 border-t border-black/10 bg-[#fffcf7]/94 p-2 shadow-2xl backdrop-blur-2xl lg:hidden"><a href={CONTACT.phoneHref} className="flex flex-col items-center justify-center rounded-2xl bg-black/[0.04] px-2 py-2 text-[11px] font-black text-[#0a1020]"><Phone className="mb-1 h-5 w-5 text-[#e65a26]" /> Tel</a><a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center rounded-2xl bg-[#25D366] px-2 py-2 text-[11px] font-black text-white"><MessageCircle className="mb-1 h-5 w-5" /> WA</a><a href="#kontakt" className="flex flex-col items-center justify-center rounded-2xl bg-[#0a1020] px-2 py-2 text-[11px] font-black text-white"><Upload className="mb-1 h-5 w-5 text-[#f1a37f]" /> {t.sellCta}</a><a href="#nabidka" className="flex flex-col items-center justify-center rounded-2xl bg-[#e65a26] px-2 py-2 text-[11px] font-black text-white"><Search className="mb-1 h-5 w-5" /> {t.buyCta}</a></motion.div>;
}

export default function AutobusyOnePage() {
  const [lang, setLang] = useState(getLang());
  const [page, setPage] = useState(getPage());
  const [vehicleItems, setVehicleItems] = useState(vehicles);
  const [legalType, setLegalType] = useState(null);
  const [formSubmissions, setFormSubmissions] = useState([]);
  const [backendContacts, setBackendContacts] = useState([
    { id: 1, source: "demo", type: "Prodej autobusu", name: "Jan Novák", phone: "+420 777 111 222", email: "jan@example.cz", vehicle: "SETRA S 515 HD", status: "nové", priority: "běžná", owner: "nepřiřazeno", note: "Doplnit fotografie a představu ceny.", createdAt: "2026-05-16T09:10:00.000Z", createdAtDisplay: "16. 5. 2026 09:10", updatedAtDisplay: "16. 5. 2026 09:10", consent: "ano" },
    { id: 2, source: "demo", type: "Poptávka koupě", name: "Dopravce CZ", phone: "+420 608 000 000", email: "nakup@example.cz", vehicle: "zájezdový autobus Euro 6", status: "rozpracováno", priority: "vysoká", owner: "obchod", note: "Hledá 49–55 míst, rozpočet do 2,5 mil. Kč.", createdAt: "2026-05-15T13:35:00.000Z", createdAtDisplay: "15. 5. 2026 13:35", updatedAtDisplay: "16. 5. 2026 08:20", consent: "ano" },
  ]);
  const t = useMemo(() => COPY[lang] || COPY.cs, [lang]);
  const handleFormSubmit = (payload) => { const id = Date.now(); const submission = { id, ...payload, createdAt: payload.createdAt || new Date().toISOString(), createdAtDisplay: payload.createdAtDisplay || new Date().toLocaleString("cs-CZ"), status: "nové", note: "" }; setFormSubmissions((current) => [submission, ...current]); setBackendContacts((current) => [{ id, source: "formulář webu", type: payload.type || "Kontakt z webu", name: payload.name || (payload.email ? "Newsletter" : "Neuvedeno"), phone: payload.phone || "", email: payload.email || "", vehicle: payload.sellModel || payload.buyType || payload.type || "", status: "nové", priority: payload.category === "newsletter" ? "nízká" : "běžná", owner: "nepřiřazeno", note: payload.note || payload.buyNote || "", createdAt: submission.createdAt, createdAtDisplay: submission.createdAtDisplay, updatedAtDisplay: submission.createdAtDisplay, consent: "ano", deliveryStatus: payload.deliveryStatus || "nezjištěno" }, ...current]); };
  const openAdmin = () => { setPage("admin"); window.history.pushState({}, "", "/admin"); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const openWeb = () => { setPage("home"); window.history.pushState({}, "", COPY[lang]?.path || "/"); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const openAllListings = () => { setPage("listings"); window.history.pushState({}, "", "/nabidka-autobusu"); window.scrollTo({ top: 0, behavior: "smooth" }); };
  useEffect(() => { const onPopState = () => { setLang(getLang()); setPage(getPage()); }; const onLegalOpen = (event) => setLegalType(event.detail?.type || "terms"); window.addEventListener("popstate", onPopState); window.addEventListener("autobusy-open-legal", onLegalOpen); return () => { window.removeEventListener("popstate", onPopState); window.removeEventListener("autobusy-open-legal", onLegalOpen); }; }, []);
  if (page === "admin") return <AdminPanel onBack={openWeb} listings={vehicleItems} onListingsChange={setVehicleItems} contactsData={backendContacts} onContactsChange={setBackendContacts} formSubmissions={formSubmissions} />;
  if (page === "listings") return <AllListingsPage t={t} onBack={openWeb} vehiclesData={vehicleItems} />;
  return <main className="min-h-screen bg-white pb-20 font-sans text-[#0a1020] antialiased selection:bg-[#e65a26] selection:text-white lg:pb-0"><Header t={t} lang={lang} onLanguageChange={setLang} /><Hero t={t} /><StatsBand t={t} /><BrokerageSection t={t} /><WhySection t={t} /><Listings t={t} onOpenAll={openAllListings} vehiclesData={vehicleItems} /><Contact t={t} onFormSubmit={handleFormSubmit} /><NewsletterSignup t={t} onFormSubmit={handleFormSubmit} /><Footer t={t} onAdminOpen={openAdmin} onLegalOpen={setLegalType} /><LegalModal type={legalType} onClose={() => setLegalType(null)} t={t} /><MobileBar t={t} /></main>;
}
