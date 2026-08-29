"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

const models = [
  {
    id: "economy",
    type: "Type 1",
    name: "Economy",
    area: 65,
    beds: 2,
    baths: 1,
    price: 35100,
    image: "/assets/type1/main.webp",
    plan: "/assets/type1/new-gallery-8-plan.webp",
    tag: "Le plus accessible",
  },
  {
    id: "standard",
    type: "Type 2",
    name: "Standard",
    area: 85,
    beds: 3,
    baths: 2,
    price: 45900,
    image: "/assets/type2/main.webp",
    plan: "/assets/type2/new-gallery-13-plan.webp",
    tag: "Idéal famille",
  },
  {
    id: "comfort",
    type: "Type 3",
    name: "Confort",
    area: 150,
    beds: 3,
    baths: 2,
    price: 81000,
    image: "/assets/type3/main.webp",
    plan: "/assets/type3/gallery-5.webp",
    tag: "Grands espaces",
  },
  {
    id: "modern",
    type: "Type 4",
    name: "Moderne",
    area: 200,
    beds: 3,
    baths: 2,
    price: 108000,
    image: "/assets/type4/main.webp",
    plan: "/assets/type4/gallery-plan.webp",
    tag: "Standing R+1",
  },
  {
    id: "ruashi01",
    type: "Maison",
    name: "RUASHI-01",
    area: 75,
    beds: 3,
    baths: 1,
    price: 22534,
    image: "/assets/ruashi/main-plan-facade.webp",
    plan: "/assets/ruashi01/plan.webp",
    tag: "Offre RUASHI",
  },
  {
    id: "ruashi02",
    type: "Maison",
    name: "RUASHI-02",
    area: 85,
    beds: 3,
    baths: 2,
    price: 26071,
    image: "/assets/ruashi/main-plan-facade.webp",
    plan: "/assets/ruashi02/plan.webp",
    tag: "Offre RUASHI",
  },
] as const;

type CreditOption = { key: string; name: string; price: number };
const money = (n: number) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
const moneyExact = (n: number) =>
  `${new Intl.NumberFormat("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)} $US`;
const epanayoAnnualRate = 0.12;
const epanayoAnnualRateLabel = `${epanayoAnnualRate * 100} %`;
const economyGallery = [
  "/assets/type1/new-gallery-1.webp",
  "/assets/type1/new-gallery-2.webp",
  "/assets/type1/new-gallery-3.webp",
  "/assets/type1/new-gallery-4.webp",
  "/assets/type1/new-gallery-5.webp",
  "/assets/type1/new-gallery-6.webp",
  "/assets/type1/new-gallery-7.webp",
  "/assets/type1/new-gallery-8-plan.webp",
];
const standardGallery = [
  "/assets/type2/new-gallery-1.webp",
  "/assets/type2/new-gallery-2.webp",
  "/assets/type2/new-gallery-3.webp",
  "/assets/type2/new-gallery-4.webp",
  "/assets/type2/new-gallery-5.webp",
  "/assets/type2/new-gallery-6.webp",
  "/assets/type2/new-gallery-7.webp",
  "/assets/type2/new-gallery-8.webp",
  "/assets/type2/new-gallery-9.webp",
  "/assets/type2/new-gallery-10.webp",
  "/assets/type2/new-gallery-11.webp",
  "/assets/type2/new-gallery-12.webp",
  "/assets/type2/new-gallery-13-plan.webp",
];
const comfortGallery = [
  "/assets/type3/new-gallery-1.webp",
  "/assets/type3/new-gallery-2.webp",
  "/assets/type3/new-gallery-3.webp",
  "/assets/type3/new-gallery-4.webp",
  "/assets/type3/gallery-5.webp",
];
const modernGallery = [
  "/assets/type4/gallery-interior.webp",
  "/assets/type4/gallery-plan.webp",
];
const moladiGallery = [
  "/assets/moladi/welcome.webp",
  "/assets/moladi/technology.webp",
  "/assets/moladi/mould-house.webp",
  "/assets/moladi/fill-formwork.webp",
  "/assets/moladi/speed-reduces-cost.webp",
  "/assets/moladi/first-house.webp",
] as const;
const moladiCaptions: Record<(typeof moladiGallery)[number], string> = {
  "/assets/moladi/welcome.webp": "Présentation Moladi Group",
  "/assets/moladi/technology.webp": "Technologie Moladi",
  "/assets/moladi/mould-house.webp": "Technologie Moladi — Moulage",
  "/assets/moladi/fill-formwork.webp": "Technologie Moladi — Coffrage",
  "/assets/moladi/speed-reduces-cost.webp": "Technologie Moladi — Construction rapide",
  "/assets/moladi/first-house.webp": "Référence Moladi — Première maison",
};
const moladiCaptionFor = (src: string) =>
  moladiCaptions[src as keyof typeof moladiCaptions];
const ruashiNeighborhoodGallery = [
  "/assets/ruashi/neighborhood-1.webp",
  "/assets/ruashi/neighborhood-2.webp",
  "/assets/ruashi/neighborhood-3.webp",
  "/assets/ruashi/landscape-1.webp",
  "/assets/ruashi/house-facade.webp",
  "/assets/ruashi/neighborhood-4.webp",
] as const;
const ruashiCaptions: Record<(typeof ruashiNeighborhoodGallery)[number], string> = {
  "/assets/ruashi/neighborhood-1.webp": "Vue du quartier",
  "/assets/ruashi/neighborhood-2.webp": "Quartier et paysage",
  "/assets/ruashi/neighborhood-3.webp": "Vue extérieure du quartier",
  "/assets/ruashi/landscape-1.webp": "Quartier et paysage",
  "/assets/ruashi/house-facade.webp": "Façade de la maison",
  "/assets/ruashi/neighborhood-4.webp": "Vue du quartier",
};
const ruashiCaptionFor = (src: string) =>
  ruashiCaptions[src as keyof typeof ruashiCaptions];
const ruashi02Gallery = [
  "/assets/ruashi02/gallery-1.webp",
  "/assets/ruashi02/gallery-2.webp",
  "/assets/ruashi02/gallery-3.webp",
  "/assets/ruashi02/gallery-4.webp",
  "/assets/ruashi02/gallery-5.webp",
  "/assets/ruashi02/gallery-6.webp",
  "/assets/ruashi02/gallery-7.webp",
  "/assets/ruashi02/gallery-8.webp",
  "/assets/ruashi02/gallery-9.webp",
  "/assets/ruashi02/gallery-10.webp",
  "/assets/ruashi02/gallery-11.webp",
  "/assets/ruashi02/gallery-12.webp",
  "/assets/ruashi02/plan.webp",
  ...ruashiNeighborhoodGallery,
  ...moladiGallery,
];
const ruashi01Gallery = [
  "/assets/ruashi01/plan.webp",
  ...ruashiNeighborhoodGallery,
  ...moladiGallery,
];
const galleries = {
  economy: economyGallery,
  standard: standardGallery,
  comfort: comfortGallery,
  modern: modernGallery,
  ruashi01: ruashi01Gallery,
  ruashi02: ruashi02Gallery,
} as const;
const catalogDescriptions = {
  economy: "Une maison accessible, lumineuse et fonctionnelle, idéale pour une jeune famille ou un premier achat.",
  standard: "Un modèle familial équilibré offrant trois chambres, deux salles de bain et des espaces de vie confortables.",
  comfort: "De grands volumes et une circulation harmonieuse pour une famille recherchant davantage d’espace et de confort.",
  modern: "Une résidence contemporaine à étage, pensée pour séparer élégamment les espaces de réception et les espaces privés.",
  ruashi01: "Une maison de 75 m² comprenant trois chambres et une salle de bain.",
  ruashi02: "Une maison de 85 m² comprenant trois chambres et deux salles de bain.",
} as const;
const detailDescriptions = {
  economy: "Une maison compacte et lumineuse conçue pour offrir l’essentiel du confort familial, avec une circulation simple et des espaces faciles à entretenir.",
  standard: "Une maison familiale équilibrée de 85 m², pensée pour offrir plus d’intimité, des pièces de vie conviviales et un confort durable pour toute la famille.",
  comfort: "Une résidence spacieuse de 150 m² qui privilégie les volumes, la lumière naturelle et une séparation harmonieuse entre les espaces de réception et les espaces privés.",
  modern: "Une maison à étage de 200 m² au caractère contemporain, organisée autour d’un patio lumineux et conçue pour offrir une séparation élégante entre réception et espaces privés.",
  ruashi01: "MAISON RUASHI-01 est un modèle de 75 m² comprenant trois chambres et une salle de bain.",
  ruashi02: "MAISON RUASHI-02 est un modèle complémentaire de 85 m² comprenant trois chambres et deux salles de bain.",
} as const;
type ViewerItem = {
  type: "image" | "video";
  src: string;
  caption: string;
};
const galleryFor = (id: (typeof models)[number]["id"]) => galleries[id];
const viewerItemsFor = (m: (typeof models)[number]): ViewerItem[] => [
  {
    type: "image",
    src: m.image,
    caption: `Photo principale — ${m.type} ${m.name}`,
  },
  ...galleryFor(m.id).map((src, index) => ({
    type: "image" as const,
    src,
    caption:
      src === m.plan
        ? `Plan — ${m.type} ${m.name}`
        : moladiCaptionFor(src) ?? ruashiCaptionFor(src) ?? `Galerie ${index + 1} — ${m.type} ${m.name}`,
  })),
  ...(m.id === "modern"
    ? [
        {
          type: "video" as const,
          src: "/assets/type4/video-3d.mp4",
          caption: "Vidéo 3D — Type 4 Moderne",
        },
      ]
    : []),
];
function loan(principal: number, rate: number, years: number) {
  if (principal <= 0) return { monthly: 0, interest: 0, total: 0 };
  const r = rate / 12,
    n = years * 12,
    monthly = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1),
    total = monthly * n;
  return { monthly, interest: total - principal, total };
}

export default function Home() {
  const [options, setOptions] = useState<CreditOption[]>([]);
  const [optionsError, setOptionsError] = useState(false);
  const [modelId, setModelId] = useState("economy");
  const [catalogFilter, setCatalogFilter] = useState("all");
  const [years, setYears] = useState(15);
  const [depositPct, setDepositPct] = useState(20);
  const [financeDeposit, setFinanceDeposit] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [modal, setModal] = useState<"reserve" | "track" | null>(null);
  const [detail, setDetail] = useState<string | null>(null);
  const [viewer, setViewer] = useState<{
    title: string;
    items: ViewerItem[];
    index: number;
  } | null>(null);
  const [created, setCreated] = useState<{
    reference: string;
    name: string;
    model: string;
    monthly: number;
  } | null>(null);
  const [busy, setBusy] = useState(false);
  const [presentationMode, setPresentationMode] = useState(false);
  const [track, setTrack] = useState<
    | null
    | { error: string }
    | {
        error?: never;
        status: string;
        statusLabel: string;
        modelName: string;
        reference: string;
        updatedAt: string;
        progress: number;
      }
  >(null);
  useEffect(() => {
    fetch("/api/options")
      .then(async (response) => {
        if (!response.ok) throw new Error("options unavailable");
        return response.json() as Promise<{ options: CreditOption[] }>;
      })
      .then((data) => setOptions(data.options))
      .catch(() => setOptionsError(true));
  }, []);
  const moveViewer = (direction: number) =>
    setViewer((current) =>
      current
        ? {
            ...current,
            index:
              (current.index + direction + current.items.length) %
              current.items.length,
          }
        : current,
    );
  const openViewer = (m: (typeof models)[number], index = 0) =>
    setViewer({
      title: `${m.type} ${m.name}`,
      items: viewerItemsFor(m),
      index,
    });
  useEffect(() => {
    if (!viewer) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setViewer(null);
      if (event.key === "ArrowLeft") moveViewer(-1);
      if (event.key === "ArrowRight" || event.key === " ") {
        event.preventDefault();
        moveViewer(1);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [viewer]);
  useEffect(() => {
    const syncFullscreen = () => setPresentationMode(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", syncFullscreen);
    return () => document.removeEventListener("fullscreenchange", syncFullscreen);
  }, []);
  const togglePresentation = async () => {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await document.documentElement.requestFullscreen();
  };
  const model = models.find((m) => m.id === modelId)!;
  const filteredModels = models.filter(
    (m) => catalogFilter === "all" || m.id === catalogFilter,
  );
  const optionsTotal = options
    .filter((option) => selected.includes(option.key))
    .reduce((sum, option) => sum + option.price, 0);
  const usesRuashiFinancing = model.id === "ruashi01" || model.id === "ruashi02";
  const simulation = useMemo(() => {
    const total = model.price + optionsTotal,
      deposit = (total * depositPct) / 100,
      insurance = total * 0.03,
      epanayoPrincipal = usesRuashiFinancing
        ? total - deposit - insurance - 500
        : total - deposit,
      bankPrincipal = financeDeposit ? deposit : 0;
    const rows = [5, 10, 15].map((duration) => {
      const main = loan(epanayoPrincipal, epanayoAnnualRate, duration),
        bank = loan(bankPrincipal, 0.12, duration);
      return {
        duration,
        monthly: usesRuashiFinancing
          ? Math.round(main.monthly * 100) / 100 + Math.round(bank.monthly * 100) / 100
          : main.monthly + bank.monthly,
        epanayoMonthly: main.monthly,
        bankMonthly: bank.monthly,
        interest: main.interest + bank.interest,
        totalCredit: main.total + bank.total,
      };
    });
    const chosen = rows.find((r) => r.duration === years)!;
    const upfront = insurance + 500 + (financeDeposit ? 0 : deposit);
    return {
      total,
      deposit,
      insurance,
      epanayoPrincipal,
      bankPrincipal,
      upfront,
      rows,
      monthly: chosen.monthly,
      interest: chosen.interest,
      totalCredit: chosen.totalCredit,
      financed: epanayoPrincipal + bankPrincipal,
    };
  }, [model, optionsTotal, years, depositPct, financeDeposit, usesRuashiFinancing]);

  async function reserve(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const res = await fetch("/api/reservations", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        ...data,
        modelId,
        modelName: model.name,
        price: model.price,
        years,
        options: options.filter((option) => selected.includes(option.key)).map((option) => option.name),
        optionsTotal,
        monthly: simulation.monthly,
      }),
    });
    const json = await res.json();
    setBusy(false);
    if (res.ok)
      setCreated({
        reference: json.reference,
        name: String(data.name),
        model: model.name,
        monthly: simulation.monthly,
      });
    else alert(json.error || "Impossible d’enregistrer la réservation.");
  }
  async function lookup(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setTrack(null);
    const fd = new FormData(e.currentTarget);
    const ref = fd.get("reference");
    const phone = fd.get("phone");
    const res = await fetch(
      `/api/reservations?reference=${encodeURIComponent(String(ref))}&phone=${encodeURIComponent(String(phone))}`,
    );
    const json = await res.json();
    setBusy(false);
    setTrack(res.ok ? json.reservation : { error: json.error });
  }
  function openReserve(id?: string) {
    if (id) setModelId(id);
    setCreated(null);
    setModal("reserve");
  }

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#accueil">
          <span className="ruashiIdentity">
            <img src="/assets/ruashi-logo.webp" alt="Logo RUASHI Mining" />
          </span>
        </a>
        <nav>
          <a href="#epanayo">EPANAYO</a>
          <a href="#maisons">Maisons</a>
          <a href="#simulateur">Simulateur</a>
          <a href="#options">Options</a>
          <button className="linkbtn" onClick={() => setModal("track")}>
            Suivre ma demande
          </button>
        </nav>
        <button
          className="presentationButton"
          onClick={togglePresentation}
          aria-label={presentationMode ? "Quitter le mode présentation" : "Afficher l’application en plein écran"}
        >
          <span aria-hidden="true">{presentationMode ? "↙" : "⛶"}</span>
          {presentationMode ? "Quitter" : "Présentation"}
        </button>
        <button className="primary compact" onClick={() => openReserve()}>
          Réserver
        </button>
      </header>

      <section id="accueil" className="hero">
        <div className="heroBg" />
        <div className="heroContent">
          <p className="eyebrow heroEyebrow">
            Programme social du logement des employés de RUASHI MINING
          </p>
          <h1>
            KWAKO
            <br />
            <em>NYUMBANI.</em>
          </h1>
          <p className="lead">
            Votre maison, votre avenir, votre emploi.
          </p>
          <div className="actions">
            <a className="primary" href="#simulateur">
              Simuler mon crédit
            </a>
            <a className="secondary" href="#maisons">
              Voir les maisons
            </a>
          </div>
          <div className="trust">
            <span>✓ Garantie décennale</span>
            <span>✓ Assurance tous risques</span>
            <span>✓ Construction clé en main</span>
          </div>
          <div className="heroFeatures" aria-label="Caractéristiques principales du programme">
            <article><b>4</b><span>Types de maisons</span></article>
            <article><b>15 mois</b><span>Construction</span></article>
            <article><b>180 mois</b><span>Crédit bancaire jusqu’à</span></article>
            <article><b>20 %</b><span>Acompte</span></article>
          </div>
        </div>
      </section>

      <section id="epanayo" className="section aboutEpanayo">
        <div className="aboutLogo">
          <img
            src="/assets/epanayo-logo.webp"
            alt="EPANAYO, société d’architecture et de construction"
          />
          <p className="eyebrow dark">Qui sommes-nous ?</p>
          <h2>L’architecture congolaise, pensée pour durer.</h2>
          <p>
            EPANAYO est une société d’architecture, d’ingénierie et de
            construction qui développe des logements contemporains adaptés aux
            réalités climatiques, culturelles et économiques de la République
            démocratique du Congo.
          </p>
          <p>
            Ses maisons associent des plans fonctionnels, de larges ouvertures,
            des espaces généreux et des solutions techniques modernes. Chaque
            modèle privilégie la lumière naturelle, le confort quotidien,
            l’efficacité énergétique et la maîtrise des coûts.
          </p>
          <div className="aboutPoints">
            <span>Normes architecturales internationales</span>
            <span>Adaptation aux usages locaux</span>
            <span>Construction clé en main</span>
            <span>Garantie décennale</span>
          </div>
        </div>
        <div className="aboutVisual">
          <button
            className="aboutVideoButton"
            onClick={() => setViewer({
              title: "Présentation EPANAYO",
              items: [{ type: "video", src: "/assets/epanayo-presentation.mp4", caption: "Présentation de la société EPANAYO" }],
              index: 0,
            })}
            aria-label="Regarder la présentation vidéo d’EPANAYO en plein écran"
          >
            <video muted playsInline preload="metadata">
              <source src="/assets/epanayo-presentation.mp4" type="video/mp4" />
            </video>
            <span className="aboutVideoPlay" aria-hidden="true">▶</span>
            <strong>Regarder la présentation EPANAYO</strong>
            <small>Cliquez pour ouvrir la vidéo en plein écran</small>
          </button>
        </div>
      </section>

      <section id="maisons" className="catalogSection">
        <div className="catalogTitle"><p className="eyebrow dark">Catalogue KWAKO NYUMBANI</p><h2>Choisissez votre maison.</h2><p>Comparez les modèles, parcourez leurs galeries et ouvrez leur fiche complète avant de simuler votre crédit.</p></div>
        <div className="catalogToolbar">
          <div className="catalogFilters">
            <div className="filterGroup"><span>Modèle</span><div className="filterPills">{[["economy","Economy"],["standard","Standard"],["comfort","Confort"],["modern","Moderne"]].map(([id,label])=><button className={catalogFilter===id?"active":""} onClick={()=>setCatalogFilter(id)} key={id}>{label}</button>)}</div></div>
          </div>
          <span className="catalogCount"><b>{filteredModels.length}</b> maison{filteredModels.length === 1 ? "" : "s"} trouvée{filteredModels.length === 1 ? "" : "s"}</span>
        </div>
        <div className="catalogGrid">
          {filteredModels.map((m) => {
            const gallery = galleryFor(m.id);
            const description = catalogDescriptions[m.id];
            return <article className="catalogCard" key={m.id}>
              <div className="catalogHero"><button className="catalogMainButton" onClick={()=>openViewer(m,0)} aria-label={`Afficher la photo principale de ${m.name} en plein écran`}><img src={m.image} alt={`Photo principale de la maison ${m.name}`}/></button><span className="catalogTag">{m.tag}</span><span className="availability">Disponible</span><span className="mainPhotoLabel">Photo principale</span><strong>{money(m.price)}</strong></div>
              <div className="catalogThumbs">{gallery.slice(0,4).map((img,i)=><button onClick={()=>openViewer(m,i+1)} key={img} aria-label={`Afficher la galerie ${m.name}, image ${i+1} en plein écran`}><img src={img} alt=""/></button>)}</div>
              <div className="catalogContent"><div className="catalogName"><h3>{m.type} {m.name}</h3><span>⌖ Cité Ruashi</span></div><p>{description}</p><div className="catalogSpecs"><span>↗ <b>{m.area} m²</b></span><span>▱ <b>{m.beds} chambres</b></span><span>♨ <b>{m.baths} SDB</b></span></div><div className="featureChips">{m.id === "ruashi01" || m.id === "ruashi02" ? <span>Offre RUASHI</span> : <><span>Terrasse</span>{m.id!=="economy"&&<span>Jardin</span>}{m.id!=="economy"&&<span>Parking</span>}</>}</div><div className="catalogActions"><button onClick={()=>setDetail(m.id)}>Voir la fiche complète</button><button onClick={()=>{setModelId(m.id);document.querySelector("#simulateur")?.scrollIntoView({behavior:"smooth"})}}>Simuler</button></div></div>
            </article>
          })}
          {filteredModels.length === 0 && <p className="catalogEmpty">Aucune maison ne correspond à vos critères.</p>}
        </div>
      </section>

      <section id="simulateur" className="creditSimulator">
        <div className="simulatorHeading">
          <p className="eyebrow dark">Simulateur de crédit immobilier</p>
          <h2>Comparez votre financement.</h2>
          <p>L’acompte de 20 % est modulable. Il peut être payé comptant ou financé séparément par une banque partenaire au taux annuel de 12 %.</p>
        </div>
        <div className="simulatorLayout">
          <aside className="parameterPanel">
            <h3>Paramètres</h3>
            <label>Maison sélectionnée<select value={modelId} onChange={(e) => setModelId(e.target.value)}>{models.map((m) => <option value={m.id} key={m.id}>{m.type} — {m.name} — {m.area} m²</option>)}</select></label>
            <label>Acompte <b>{depositPct} %</b><input className="range" type="range" min="0" max="100" step="5" value={depositPct} onChange={(e) => setDepositPct(Number(e.target.value))}/><span className="rangeLabels"><small>0 %</small><small>100 %</small></span></label>
            <label>Mode d’acompte<select value={financeDeposit ? "bank" : "cash"} onChange={(e) => setFinanceDeposit(e.target.value === "bank")}><option value="cash">Acompte payé comptant</option><option value="bank">Acompte financé par la banque</option></select></label>
            <div className="rateFields"><div><span>Taux bancaire annuel</span><b>12 %</b></div><div><span>Taux EPANAYO annuel</span><b>{epanayoAnnualRateLabel}</b></div><div><span>Assurance unique</span><b>3 %</b></div><div><span>Frais de dossier</span><b>500 $US</b></div></div>
            <a className="optionsShortcut" href="#options">Ajouter des options au crédit <b>→</b></a>
          </aside>
          <div className="resultsPanel">
            <div className="summaryTiles">
              <article><span>Prix TTC maison</span><strong>{moneyExact(model.price)}</strong></article>
              <article><span>Options sélectionnées</span><strong>{moneyExact(optionsTotal)}</strong></article>
              <article><span>Prix TTC total</span><strong>{moneyExact(simulation.total)}</strong></article>
              <article><span>Acompte {depositPct} %</span><strong>{moneyExact(simulation.deposit)}</strong></article>
              <article><span>Assurance unique</span><strong>{moneyExact(simulation.insurance)}</strong></article>
              <article><span>Frais de dossier</span><strong>500,00 $US</strong></article>
              <article className="highlight"><span>Capital EPANAYO</span><strong>{moneyExact(simulation.epanayoPrincipal)}</strong></article>
              <article className="highlight"><span>Apport au démarrage</span><strong>{moneyExact(simulation.upfront)}</strong></article>
            </div>
            <div className="durationCards">
              {simulation.rows.map((row) => <button className={years === row.duration ? "active" : ""} onClick={() => setYears(row.duration)} key={row.duration}><h3>{row.duration} ans</h3><strong>{moneyExact(row.monthly)} <small>/ mois</small></strong><dl><div><dt>Banque</dt><dd>{moneyExact(row.bankMonthly)}</dd></div><div><dt>EPANAYO</dt><dd>{moneyExact(row.epanayoMonthly)}</dd></div><div><dt>Intérêts totaux</dt><dd>{moneyExact(row.interest)}</dd></div><div><dt>Total remboursé</dt><dd>{moneyExact(row.totalCredit)}</dd></div></dl></button>)}
            </div>
            <div className="simulationActions"><p>Assurance tous risques (3 %) et frais d’ouverture de dossier (500 $US) payés une seule fois au départ, hors crédit. Simulation indicative soumise à validation.</p><button className="primary" onClick={() => openReserve()}>Réserver avec cette simulation</button></div>
          </div>
        </div>
      </section>

      <section id="options" className="section optionsPage">
        <div className="sectionHead">
          <div>
            <p className="eyebrow dark">Étape séparée • Personnalisation</p>
            <h2>
              Ajoutez vos options
              <br />
              au crédit.
            </h2>
          </div>
          <p>
            Sélectionnez les équipements souhaités. Leur montant est
            automatiquement intégré au coût du projet et à toutes les
            simulations.
          </p>
        </div>
        <div className="optionCards">
          {optionsError ? (
            <p className="notice error">Les options sont momentanément indisponibles.</p>
          ) : options.length === 0 ? (
            <p>Chargement des options…</p>
          ) : options.map((option) => (
            <button
              className={selected.includes(option.key) ? "selected" : ""}
              onClick={() =>
                setSelected((s) =>
                  s.includes(option.key) ? s.filter((key) => key !== option.key) : [...s, option.key],
                )
              }
              key={option.key}
            >
              <i>{selected.includes(option.key) ? "✓" : "+"}</i>
              <span>
                <b>{option.name}</b>
                <small>Ajouter au crédit EPANAYO à {epanayoAnnualRateLabel}</small>
              </span>
              <strong>{money(option.price)}</strong>
            </button>
          ))}
        </div>
        <div className="optionsTotal">
          <span>{selected.length} option(s) sélectionnée(s)</span>
          <b>{money(optionsTotal)}</b>
          <a className="primary" href="#simulateur">
            Recalculer mon crédit
          </a>
        </div>
      </section>

      <section id="processus" className="section process">
        <div className="sectionHead">
          <div>
            <p className="eyebrow dark">Simple, du choix à la clé</p>
            <h2>
              Devenez propriétaire
              <br />
              en quatre étapes.
            </h2>
          </div>
        </div>
        <div className="steps">
          {[
            [
              "01",
              "Simulez",
              "Choisissez votre maison et adaptez le financement à votre budget.",
            ],
            [
              "02",
              "Réservez",
              "Complétez votre demande et recevez immédiatement votre référence.",
            ],
            [
              "03",
              "Faites valider",
              "RUASHI MINING et les partenaires vérifient votre dossier et le financement.",
            ],
            [
              "04",
              "Suivez le chantier",
              "Consultez l’avancement jusqu’à la remise officielle de vos clés.",
            ],
          ].map((x) => (
            <article key={x[0]}>
              <b>{x[0]}</b>
              <h3>{x[1]}</h3>
              <p>{x[2]}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="finalCta">
        <div>
          <p className="eyebrow">KWAKO NYUMBANI</p>
          <h2>Le bon moment pour devenir propriétaire, c’est maintenant.</h2>
        </div>
        <button className="primary" onClick={() => openReserve()}>
          Commencer ma réservation
        </button>
      </section>
      <footer>
        <div className="brand footerBrand">
          <img src="/assets/ruashi-logo.webp" alt="RUASHI Mining" />
          <span>
            <b>KWAKO NYUMBANI</b>
            <small>Programme social du logement</small>
          </span>
        </div>
        <p>
          Une initiative dédiée aux employés de RUASHI MINING, avec HS CONSULT
          et EPANAYO.
        </p>
        <div>
          <button className="linkbtn" onClick={() => setModal("track")}>
            Suivre une demande
          </button>
          <a href="/admin">Administration</a>
        </div>
      </footer>
      <div className="poweredBar">
        <a href="https://kwako-nyumbani.heritiersangol.chatgpt.site">
          kwako-nyumbani.heritiersangol.chatgpt.site
        </a>
        <span>
          POWERED BY <b>HS CONSULT</b>
        </span>
        <a href="tel:+243990110110">+243 990 110 110</a>
      </div>

      {detail &&
        (() => {
          const m = models.find((x) => x.id === detail)!;
          const gallery = galleryFor(m.id);
          const isStandard = m.id === "standard",
            isComfort = m.id === "comfort",
            isModern = m.id === "modern",
            isRuashi01 = m.id === "ruashi01",
            isRuashi02 = m.id === "ruashi02";
          return (
            <div
              className="detailOverlay"
              role="dialog"
              aria-modal="true"
              onMouseDown={(e) => {
                if (e.target === e.currentTarget) setDetail(null);
              }}
            >
              <article className="houseDetail">
                <button
                  className="close"
                  onClick={() => setDetail(null)}
                  aria-label="Fermer"
                >
                  ×
                </button>
                <div className="detailTop">
                  <button
                    className="detailMainButton"
                    onClick={() => openViewer(m, 0)}
                    aria-label={`Afficher la photo principale de ${m.name} en plein écran`}
                  >
                    <img
                      src={m.image}
                      alt={`Vue principale de la maison ${m.name}`}
                    />
                  </button>
                  <div>
                    <p className="eyebrow dark">{m.type}</p>
                    <h2>{isRuashi01 ? "MAISON RUASHI-01" : isRuashi02 ? "MAISON RUASHI-02" : m.name}</h2>
                    <p className="detailLead">
                      {detailDescriptions[m.id]}
                    </p>
                    <div className="detailSpecs">
                      <span>
                        <b>{m.area} m²</b> de surface
                      </span>
                      <span>
                        <b>{m.beds}</b> chambres
                      </span>
                      <span>
                        <b>{m.baths}</b> salle(s) de bain
                      </span>
                    </div>
                    <ul>
                      {m.id === "economy" && (
                        <>
                          <li>Salon et salle à manger ouverts et lumineux</li>
                          <li>
                            Cuisine fonctionnelle avec accès direct aux pièces
                            de vie
                          </li>
                          <li>Deux chambres adaptées à une famille</li>
                          <li>Terrasse couverte et larges ouvertures</li>
                          <li>
                            Plan optimisé pour réduire les coûts d’entretien
                          </li>
                        </>
                      )}
                      {isStandard && (
                        <>
                          <li>Trois chambres, dont une chambre parentale</li>
                          <li>
                            Deux salles de bain pour plus de confort au
                            quotidien
                          </li>
                          <li>
                            Salon et salle à manger réunis dans un espace
                            lumineux
                          </li>
                          <li>
                            Cuisine séparée avec arrière-service et magasin
                          </li>
                          <li>
                            Deux terrasses couvertes et circulation intérieure
                            optimisée
                          </li>
                        </>
                      )}
                      {isComfort && (
                        <>
                          <li>
                            Trois chambres réparties autour d’un espace privé
                          </li>
                          <li>
                            Deux salles de bain et sanitaires complémentaires
                          </li>
                          <li>
                            Grand séjour avec salle à manger et accès au jardin
                          </li>
                          <li>
                            Cuisine généreuse pensée pour un usage familial
                          </li>
                          <li>
                            Latrines extérieures indépendantes et accès de
                            service
                          </li>
                        </>
                      )}
                      {isModern && (
                        <>
                          <li>
                            Rez-de-chaussée ouvert avec salon, salle à manger et
                            cuisine
                          </li>
                          <li>
                            Patio central apportant lumière et ventilation
                            naturelles
                          </li>
                          <li>Trois chambres aménagées à l’étage</li>
                          <li>Deux salles de bain et espaces de rangement</li>
                          <li>
                            Guérite, cour, terrasse de service et chambre
                            extérieure
                          </li>
                        </>
                      )}
                      {isRuashi02 && (
                        <>
                          <li>Surface totale de 85 m²</li>
                          <li>Trois chambres</li>
                          <li>Deux salles de bain</li>
                        </>
                      )}
                      {isRuashi01 && (
                        <>
                          <li>Surface totale de 75 m²</li>
                          <li>Trois chambres</li>
                          <li>Une salle de bain</li>
                        </>
                      )}
                    </ul>
                    <strong className="detailPrice">
                      {money(m.price)} TTC
                    </strong>
                    <button
                      className="primary"
                      onClick={() => {
                        setModelId(m.id);
                        setDetail(null);
                        document
                          .querySelector("#simulateur")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }}
                    >
                      Simuler ce modèle
                    </button>
                  </div>
                </div>
                <div className="galleryHead">
                  <h3>Galerie et plan</h3>
                  <span>{gallery.length + (isModern ? 1 : 0)} visuels</span>
                </div>
                <div className="houseGallery">
                  {gallery.map((img, i) => {
                    const isPlan = img === m.plan;
                    return (
                      <figure className={isPlan ? "planImage" : ""} key={img}>
                        <button
                          className="galleryOpen"
                          onClick={() => openViewer(m, i + 1)}
                          aria-label={`Afficher ${isPlan ? "le plan" : `la vue ${i + 1}`} de ${m.name} en plein écran`}
                        >
                          <img
                            src={img}
                            alt={
                              isPlan
                                ? `Plan de la maison ${m.name}`
                                : `Vue ${i + 1} de la maison ${m.name}`
                            }
                          />
                        </button>
                        <figcaption>
                          {isPlan
                            ? "Plan de la maison"
                            : moladiCaptionFor(img)
                            ? moladiCaptionFor(img)
                            : ruashiCaptionFor(img)
                            ? ruashiCaptionFor(img)
                            : i < 5
                            ? "Vue extérieure"
                            : "Aménagement intérieur"}
                        </figcaption>
                      </figure>
                    );
                  })}
                  {isModern && (
                    <figure className="videoGalleryItem">
                      <video
                        controls
                        playsInline
                        preload="metadata"
                        poster="/assets/type4/main.webp"
                      >
                        <source
                          src="/assets/type4/video-3d.mp4"
                          type="video/mp4"
                        />
                        Votre navigateur ne peut pas lire cette vidéo.
                      </video>
                      <figcaption>Vidéo 3D de la maison Moderne</figcaption>
                      <button
                        className="openVideoFull"
                        onClick={() => openViewer(m, gallery.length + 1)}
                      >
                        Voir la vidéo 3D en plein écran
                      </button>
                    </figure>
                  )}
                </div>
              </article>
            </div>
          );
        })()}

      {viewer &&
        (() => {
          const item = viewer.items[viewer.index];
          return (
            <div
              className="lightbox"
              role="dialog"
              aria-modal="true"
              aria-label={`Diaporama ${viewer.title}`}
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) setViewer(null);
              }}
            >
              <button
                className="lightboxClose"
                onClick={() => setViewer(null)}
                aria-label="Fermer le diaporama"
              >
                ×
              </button>
              {viewer.items.length > 1 && <button
                  className="lightboxArrow lightboxPrev"
                  onClick={() => moveViewer(-1)}
                  aria-label="Élément précédent"
                >‹</button>}
              <div className="lightboxStage">
                <div className="lightboxMedia" aria-live="polite">
                  {item.type === "image" ? (
                    <img key={item.src} src={item.src} alt={item.caption} />
                  ) : (
                    <video key={item.src} controls autoPlay playsInline preload="auto">
                      <source src={item.src} type="video/mp4" />
                      Votre navigateur ne peut pas lire cette vidéo.
                    </video>
                  )}
                </div>
                <div className="lightboxMeta">
                  <strong>{item.caption}</strong>
                  <span>
                    {viewer.index + 1} / {viewer.items.length}
                  </span>
                </div>
                <p className="lightboxHint">
                  Utilisez les flèches ← → ou la barre d’espace
                </p>
              </div>
              {viewer.items.length > 1 && <button
                  className="lightboxArrow lightboxNext"
                  onClick={() => moveViewer(1)}
                  aria-label="Élément suivant"
                >›</button>}
            </div>
          );
        })()}

      {modal && (
        <div
          className="modalBackdrop"
          role="dialog"
          aria-modal="true"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setModal(null);
          }}
        >
          <div className="modal">
            <button
              className="close"
              onClick={() => setModal(null)}
              aria-label="Fermer"
            >
              ×
            </button>
            {modal === "reserve" ? (
              created ? (
                <Success data={created} />
              ) : (
                <form onSubmit={reserve}>
                  <p className="eyebrow dark">Réservation sécurisée</p>
                  <h2>Votre future maison commence ici.</h2>
                  <div className="selection">
                    <img src={model.image} alt="" />
                    <div>
                      <b>
                        {model.type} — {model.name}
                      </b>
                      <span>
                        {money(model.price)} • {money(simulation.monthly)}/mois
                      </span>
                    </div>
                  </div>
                  <div className="formGrid">
                    <label>
                      Nom et prénom
                      <input name="name" required autoComplete="name" />
                    </label>
                    <label>
                      Matricule RUASHI
                      <input name="employeeId" required />
                    </label>
                    <label>
                      Téléphone
                      <input
                        name="phone"
                        required
                        type="tel"
                        autoComplete="tel"
                      />
                    </label>
                    <label>
                      E-mail
                      <input name="email" type="email" autoComplete="email" />
                    </label>
                    <label>
                      Département / Service
                      <input name="department" />
                    </label>
                    <label>
                      Parcelle souhaitée
                      <input name="plot" placeholder="Si déjà connue" />
                    </label>
                  </div>
                  <label className="consent">
                    <input type="checkbox" required />{" "}
                    <span>
                      Je confirme l’exactitude des informations et accepte
                      d’être contacté concernant cette demande.
                    </span>
                  </label>
                  <button className="primary full" disabled={busy}>
                    {busy ? "Enregistrement…" : "Confirmer la réservation"}
                  </button>
                </form>
              )
            ) : (
              <form onSubmit={lookup}>
                <p className="eyebrow dark">Suivi de dossier</p>
                <h2>Où en est votre demande ?</h2>
                <p className="muted">
                  Saisissez la référence reçue et le même numéro de téléphone
                  utilisé lors de la réservation.
                </p>
                <label>
                  Référence
                  <input
                    name="reference"
                    required
                    placeholder="KWN-2026-XXXXXX"
                  />
                </label>
                <label>
                  Numéro de téléphone
                  <input name="phone" required type="tel" />
                </label>
                <button className="primary full" disabled={busy}>
                  {busy ? "Recherche…" : "Consulter le statut"}
                </button>
                {track &&
                  ("error" in track ? (
                    <div className="notice error">{track.error}</div>
                  ) : (
                    <div className="statusCard">
                      <span className={`status ${track.status}`}>
                        {track.statusLabel}
                      </span>
                      <h3>{track.modelName}</h3>
                      <p>
                        Référence : <b>{track.reference}</b>
                      </p>
                      <p>
                        Dernière mise à jour :{" "}
                        {new Date(track.updatedAt).toLocaleDateString("fr-FR")}
                      </p>
                      <div className="timeline">
                        <i className="done" />
                        <i className={track.progress >= 2 ? "done" : ""} />
                        <i className={track.progress >= 3 ? "done" : ""} />
                        <i className={track.progress >= 4 ? "done" : ""} />
                      </div>
                    </div>
                  ))}
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

function Success({
  data,
}: {
  data: { reference: string; name: string; model: string; monthly: number };
}) {
  return (
    <div className="success">
      <div className="successIcon">✓</div>
      <p className="eyebrow dark">Réservation enregistrée</p>
      <h2>Merci, {data.name.split(" ")[0]}.</h2>
      <p>
        Votre demande pour le modèle <b>{data.model}</b> a bien été reçue.
      </p>
      <div className="reference">
        <small>Votre référence de suivi</small>
        <strong>{data.reference}</strong>
      </div>
      <p className="muted">
        Conservez cette référence. Elle vous permettra de suivre le traitement
        de votre dossier.
      </p>
      <div className="actions stack">
        <button className="primary" onClick={() => window.print()}>
          Imprimer / Enregistrer en PDF
        </button>
        <button className="secondary dark" onClick={() => location.reload()}>
          Terminer
        </button>
      </div>
    </div>
  );
}
