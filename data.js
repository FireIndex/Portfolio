/* ============================================================
   PORTFOLIO CONTENT
   Everything on the site is generated from this object.
   Edit here - no need to touch index.html or main.js.

   Section numbers (01, 02, ...) are assigned automatically in
   document order, so you can add or remove sections freely.
   ============================================================ */

const PORTFOLIO = {
  meta: {
    name: "Sundram Kumar",
    monogram: "SK",
    role: "Backend & Quantitative Python Engineer",
    location: "Delhi, India",
    timezone: "IST · UTC+5:30",
    year: "2026",
    url: "https://fireindex.github.io/Portfolio",
    description:
      "Portfolio of Sundram Kumar - backend and quantitative Python engineer building real-time trading infrastructure, low-latency data pipelines and distributed services.",
    ogImage: "assets/og.svg",
    available: true,
    availableLabel: "Open to opportunities",
  },

  /* Section anchors are rewritten to index.html#... on other pages.
     A non-anchor href (work.html) is left as-is. */
  nav: [
    { label: "About", href: "#about" },
    { label: "Work", href: "#work" },
    { label: "All work", href: "work.html" },
    { label: "Skills", href: "#skills" },
    { label: "Experience", href: "#experience" },
    { label: "Contact", href: "#contact" },
  ],

  hero: {
    label: "Portfolio / 2026",
    headline:
      "Building real-time trading systems that stay correct when things fail.",
    intro:
      "I am a backend engineer working on real-time trading infrastructure — market data ingestion, order-state tracking, trade replication. Most of my work is the unglamorous middle of the stack: the part that has to stay correct when a packet is dropped, a broker goes quiet, or five hundred accounts need the same answer at once. I care about systems that keep working when something fails, because in this domain something always does.",
    actions: [
      { label: "View selected work", href: "#work", primary: true },
      { label: "Get in touch", href: "#contact", primary: false },
    ],
    meta: ["Based in Delhi, India", "Python / FastAPI / Redis", "Open to opportunities"],
  },

  about: {
    title: "About",
    quote:
      "I like turning messy problems into simple systems that actually work.",
    paragraphs: [
      "I started out doing data analysis and visualisation — dashboards, Streamlit apps, pulling stories out of public datasets. That work taught me to care about whether a number is actually true, which turned out to be the more useful half of the skill.",
      "Since 2024 I have been the core engineer on the trading stack at Finesse Stock Broking, building the services that move live market and order data for 200–500 concurrent accounts. Distributed systems, failover, reconciliation: the recurring theme is designing for the moment things break rather than the moment they work.",
      "Alongside that I write and publish small tools, and I am steadily moving deeper into quantitative and ML-facing work — the modelling side of the same problems I already build the plumbing for.",
    ],
    focus: {
      label: "Current focus",
      items: [
        "Real-time data streaming",
        "Distributed & fault-tolerant services",
        "Order management systems",
        "Quantitative & ML tooling",
      ],
    },
    expertise: {
      label: "Areas of expertise",
      items: [
        "Python backend engineering",
        "Low-latency data pipelines",
        "Event-driven architecture",
        "Data analysis & visualisation",
      ],
    },
  },

  /* ----------------------------------------------------------
     PROJECTS

     `featured: true`  -> full case study on the home page
     everything else   -> catalogue only (work.html)

     `context` labels ownership so professional work is never
     mistaken for a personal side project:
       "personal" | "work" | "open-source"
     `org` names the employer on "work" entries.

     Display numbers are derived from order, so reordering or
     removing a project never leaves a stale 04 behind.
     ---------------------------------------------------------- */
  work: {
    title: "Selected Work",
    intro:
      "A few projects worth explaining properly. The rest are listed in the full catalogue.",
    catalogueLink: { label: "View all projects", href: "work.html" },
    projects: [
      {
        featured: true,
        context: "personal",
        name: "Mansik Santulan Score",
        kind: "Student Wellness ML Model",
        description:
          "A student wellness predictor that estimates a mental health score from eleven lifestyle and digital-habit inputs — screen time, phone unlocks, study and sleep hours, perceived stress. A scikit-learn regression model sits behind a FastAPI service, with a form-driven front end built to read as a considered instrument rather than a demo.",
        outcome:
          "Deployed and publicly usable. Deliberately framed as informational, not a clinical assessment.",
        tech: ["Python", "scikit-learn", "FastAPI", "Render"],
        year: "2026",
        links: [
          {
            label: "Live demo",
            href: "https://mansik-santulan-score-site.onrender.com/",
          },
          { label: "Video demo", href: "https://vimeo.com/1223057127" },
          {
            label: "GitHub",
            href: "https://github.com/FireIndex/Mansik-Santulan-Score",
          },
        ],
        image: "assets/work-mansik.webp",
        alt: "Screenshot of the Mental Health Signal app: a multi-step form for lifestyle inputs beside a score readout panel.",
      },
      {
        featured: true,
        context: "personal",
        name: "Writer",
        kind: "Collaborative Note-Taking App",
        description:
          "A full-stack note-taking application with a React front end, an Express API and MySQL storage. Built around collaboration and offline-tolerant editing — the interesting problems were state synchronisation and making the editor feel immediate rather than networked.",
        outcome: "Built and deployed privately; source and deployment are not public.",
        tech: ["React", "Express.js", "MySQL"],
        year: "2023",
        links: [
          { label: "Video demo", href: "https://vimeo.com/1223057147" },
          {
            label: "Synopsis (PDF)",
            href: "https://drive.google.com/file/d/1HwRB8ThHEnNjGHxmb38HfzZ_mkrlswLr/view?usp=sharing",
          },
        ],
        image: "assets/work-writer.svg",
        alt: "The Writer editor: a folder sidebar, a list of notes, and an open note titled “Reflection on the Month of June”. Three people are in the note at once — their initials sit in the margin beside the lines they are reading, one highlights a passage, and a fourth line is being typed live. MJ is offline, with four edits waiting and nothing lost.",
      },
      {
        featured: true,
        context: "open-source",
        name: "Butterfly",
        kind: "Data Masking Library",
        description:
          "A dependency-free Python library for masking and obfuscating sensitive data, published on PyPI. Masking is layered — deterministic salted shuffling composed with a Caesar shift — so the same input always produces the same masked output, and the transformation reverses when you hold the salt.",
        outcome:
          "Published on PyPI with zero runtime dependencies; encoding, encryption and hashing modules on the roadmap.",
        tech: ["Python", "PyPI"],
        year: "2025",
        links: [{ label: "GitHub", href: "https://github.com/FireIndex/MissButterfly" }],
        image: "assets/work-butterfly.svg",
        alt: "Diagram: input passing through a salted shuffle and Caesar shift to masked output, with a dashed reversible return path.",
      },
      {
        featured: true,
        context: "work",
        org: "Finesse Stock Broking",
        name: "PyData",
        kind: "Real-Time Market Data Engine",
        description:
          "A high-throughput market data microservice that ingests live WebSocket feeds from multiple brokers and streams normalised ticks into a Redis cache. A canonical-key translation layer resolves the fact that no two brokers name the same instrument the same way, and a cold-standby engine takes over mid-stream when a feed drops.",
        outcome:
          "Zero-downtime tick streaming for 200–500 concurrent accounts, with sub-10ms state reads and ClickHouse-backed historical querying.",
        tech: ["Python", "FastAPI", "WebSockets", "Redis", "ClickHouse"],
        year: "2025",
        links: [],
        image: "assets/work-pydata.svg",
        alt: "Architecture diagram: multiple broker WebSocket feeds normalised through a canonical-key layer into Redis and ClickHouse, with a cold-standby feed.",
      },
      {
        featured: true,
        context: "work",
        org: "Finesse Stock Broking",
        name: "pulseSocket",
        kind: "Order-State Synchronisation Service",
        description:
          "A multi-broker order-state tracker built on a dual-memory design: Redis for millisecond reads, and an append-only PostgreSQL trail so history can never be silently rewritten. A REST-based reconciliation loop diffs live state against the broker of record and repairs itself when packets arrive late or not at all.",
        outcome:
          "100% data integrity against dropped and out-of-order packets, with no manual intervention.",
        tech: ["Python", "Redis", "PostgreSQL", "WebSockets"],
        year: "2026",
        links: [],
        image: "assets/work-pulsesocket.svg",
        alt: "Architecture diagram: a WebSocket order stream with a dropped packet writing to Redis and PostgreSQL, with a reconciliation loop re-applying corrected state.",
      },
      {
        featured: true,
        context: "work",
        org: "Finesse Stock Broking",
        name: "Replicator",
        kind: "Distributed Task Replication Engine",
        description:
          "A replication engine that mirrors a master account's orders across many downstream accounts over gRPC. Scaling is proportional or weighted per follower, and the sequencing is strict — cancel, then modify, then place — because getting that order wrong is the difference between a mirrored trade and a broken position.",
        outcome:
          "Powers a bulk execution path handling 2,000+ concurrent orders at 4× baseline speed.",
        tech: ["Python", "FastAPI", "gRPC", "Socket.IO"],
        year: "2025",
        links: [],
        image: "assets/work-replicator.svg",
        alt: "Architecture diagram: a master account order passing through a cancel-modify-place sequencing gate and fanning out over gRPC to follower accounts.",
      },

      /* --- catalogue only: earlier data & web work --------------- */
      {
        featured: false,
        context: "personal",
        name: "India's Crime Trend Dashboard",
        kind: "Data Analysis & Visualisation",
        description:
          "An interactive Streamlit dashboard analysing Indian crime data from 2001 to 2012, built to make a difficult public dataset legible.",
        outcome:
          "Deployed publicly; source data from the National Crime Records Bureau.",
        tech: ["Python", "Pandas", "Plotly", "Streamlit"],
        year: "2024",
        links: [
          {
            label: "Live demo",
            href: "https://fireindex-indias-crime-trend-dashboard.streamlit.app/",
          },
          { label: "Video demo", href: "https://vimeo.com/1223057077" },
          {
            label: "GitHub",
            href: "https://github.com/FireIndex/Models/tree/main/0.%20data-science/3_Indias_Crime_Trend_Streamlit_Dashboard",
          },
        ],
        image: "assets/work-crime.webp",
        alt: "Screenshot of the India crime trend dashboard showing state-level charts and filters.",
      },
      {
        featured: false,
        context: "personal",
        name: "IPL Insights Dashboard",
        kind: "Data Analysis & Visualisation",
        description:
          "A Streamlit dashboard covering fifteen IPL seasons — team performance, batting and bowling statistics, and head-to-head player comparisons.",
        outcome: "Deployed publicly on Streamlit Cloud.",
        tech: ["Python", "Pandas", "Plotly", "Streamlit"],
        year: "2024",
        links: [
          {
            label: "Live demo",
            href: "https://fireindex-ipl-dashboard.streamlit.app/",
          },
          { label: "Video demo", href: "https://vimeo.com/1223057074" },
          {
            label: "GitHub",
            href: "https://github.com/FireIndex/Models/tree/main/0.%20data-science/1_IPL_Streamlit_Dashboard",
          },
        ],
        image: "assets/work-ipl.webp",
        alt: "Screenshot of the IPL insights dashboard showing team and player statistics.",
      },
      {
        featured: false,
        context: "personal",
        name: "Zomato Insights Dashboard",
        kind: "Business Intelligence",
        description:
          "A Power BI dashboard over Zomato's sales, customer behaviour and city-level performance data, built to answer the questions a business actually asks.",
        outcome: "Interactive Power BI report with drill-down by city and cohort.",
        tech: ["Power BI", "MS Excel"],
        year: "2024",
        links: [
          { label: "Video demo", href: "https://vimeo.com/1223057193" },
          {
            label: "Files",
            href: "https://drive.google.com/drive/folders/1DoCLfmNYwdyRIuWq2E43YKGKProQRyz4?usp=drive_link",
          },
        ],
        image: "assets/work-zomato.webp",
        alt: "Screenshot of the Zomato insights Power BI dashboard showing sales and city metrics.",
      },
    ],
  },

  skills: {
    title: "Skills",
    intro: "Tools I reach for often, grouped by the kind of problem they solve.",
    groups: [
      {
        label: "Languages & Core",
        items: ["Python", "SQL", "JavaScript", "AsyncIO", "Multiprocessing", "OOP"],
      },
      {
        label: "Backend & APIs",
        items: [
          "FastAPI",
          "Django",
          "DRF",
          "Pydantic",
          "REST",
          "WebSockets",
          "gRPC",
        ],
      },
      {
        label: "Data & Storage",
        items: [
          "PostgreSQL",
          "Redis",
          "ClickHouse",
          "MongoDB",
          "Pandas",
          "NumPy",
        ],
      },
      {
        label: "Architecture & Tools",
        items: [
          "Microservices",
          "Event-Driven",
          "Distributed Systems",
          "Docker",
          "Git",
          "Linux",
        ],
      },
      {
        label: "Frontend",
        items: ["React", "Next.js", "Node.js", "Streamlit"],
      },
      {
        label: "Analysis & BI",
        items: ["Plotly", "Seaborn", "Power BI", "Tableau", "MS Excel"],
      },
    ],
  },

  experience: {
    title: "Experience",
    entries: [
      {
        period: "Sep 2024 — Present",
        role: "Quantitative Python Developer",
        org: "Finesse Stock Broking Services Pvt. Ltd.",
        place: "Delhi, India",
        description:
          "Core engineer on the firm's trading stack, spanning market data ingestion, real-time order tracking, trade replication and portfolio analytics across 200–500 concurrent client accounts. The through-line of the work is fault tolerance: heartbeat-driven failover, promoted-primary switching, and auto-recovery watchdogs, so a dropped connection is an event the system absorbs rather than an outage.",
        highlights: [
          "Architected the real-time WebSocket backend — multi-broker socket engine with dynamic load distribution and Redis-backed sub-10ms state reads",
          "Built an emergency square-off engine handling 2,000+ orders at 4× speed, supporting ₹500 Cr exposure liquidation in under 10 seconds",
          "Engineered auto-healing reconciliation loops that self-correct dropped or out-of-order packets, holding 100% data integrity",
        ],
      },
    ],
  },

  education: {
    title: "Education",
    entries: [
      {
        degree: "Bachelor of Computer Applications (BCA)",
        institution: "Indira Gandhi National Open University",
        year: "2021 — 2024",
        areas: ["Programming", "Databases", "Data Structures", "Web Development"],
      },
      {
        degree: "Higher Secondary Certificate — Science",
        institution: "Fair Child Public School",
        year: "2019 — 2021",
        areas: ["Physics", "Chemistry", "Mathematics"],
      },
    ],
  },

  contact: {
    title: "Contact",
    heading: "Let’s build something interesting.",
    text:
      "I am open to backend, quantitative and data-heavy engineering roles. If you have a system that has to stay up and stay correct, I would like to hear about it.",
    email: "sundramkumar8298@gmail.com",
    profiles: [
      { label: "GitHub", href: "https://github.com/FireIndex", handle: "@FireIndex" },
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/sundram8298/",
        handle: "/in/sundram8298",
      },
      { label: "Phone", href: "tel:+919540291360", handle: "+91 95402 91360" },
      // To add a résumé: drop the PDF in assets/ and uncomment this line.
      // { label: "Résumé", href: "assets/resume.pdf", handle: "PDF" },
    ],
  },

  footer: {
    left: "© 2026 Sundram Kumar",
    right: "Built with curiosity.",
  },
};

/* A top-level `const` is not a property of `window`, so expose it
   explicitly for main.js to read. */
window.PORTFOLIO = PORTFOLIO;
