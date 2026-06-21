import { Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import './StatkiLayout.css'

export default function StatkiLayout() {
  useEffect(() => {
    const link = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
    const prev = link?.href ?? ''
    if (link) link.href = '/favicon-statki.svg'
    return () => { if (link) link.href = prev }
  }, [])

  return (
    <div className="statki-layout">
      <div className="statki-bg" aria-hidden="true">

        {/* ── DESKTOP / LANDSCAPE (≥640px) ── viewBox 1440×810 (16:9) */}
        <svg className="statki-bg__desktop"
          viewBox="0 0 1440 810" preserveAspectRatio="xMidYMin slice"
          xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <defs>
            <linearGradient id="sky-g" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#010a18"/>
              <stop offset="100%" stopColor="#091c35"/>
            </linearGradient>
            <linearGradient id="ocean-g" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#0c4a72"/>
              <stop offset="40%"  stopColor="#083a5e"/>
              <stop offset="100%" stopColor="#020d1c"/>
            </linearGradient>
            <linearGradient id="ray-g" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#5ab4e8" stopOpacity="0.11"/>
              <stop offset="100%" stopColor="#5ab4e8" stopOpacity="0"/>
            </linearGradient>
            <radialGradient id="moon-g" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="#f8e878" stopOpacity="0.32"/>
              <stop offset="100%" stopColor="#f8e878" stopOpacity="0"/>
            </radialGradient>
            <radialGradient id="sand-g" cx="50%" cy="30%" r="60%">
              <stop offset="0%"   stopColor="#f0cc68"/>
              <stop offset="100%" stopColor="#a87020"/>
            </radialGradient>
            {/* Fish gradients */}
            <radialGradient id="cf-g" cx="28%" cy="32%" r="70%">
              <stop offset="0%"   stopColor="#ffaa3a"/>
              <stop offset="55%"  stopColor="#e06812"/>
              <stop offset="100%" stopColor="#9c3000"/>
            </radialGradient>
            <radialGradient id="bf-g" cx="65%" cy="32%" r="68%">
              <stop offset="0%"   stopColor="#66c8ff"/>
              <stop offset="55%"  stopColor="#1880e2"/>
              <stop offset="100%" stopColor="#073578"/>
            </radialGradient>
            <radialGradient id="yf-g" cx="30%" cy="32%" r="68%">
              <stop offset="0%"   stopColor="#fff870"/>
              <stop offset="58%"  stopColor="#e8c00a"/>
              <stop offset="100%" stopColor="#a07400"/>
            </radialGradient>
            <linearGradient id="sh-g" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#728898"/>
              <stop offset="100%" stopColor="#4a6070"/>
            </linearGradient>
            <radialGradient id="oct-g" cx="40%" cy="35%" r="65%">
              <stop offset="0%"   stopColor="#c060d8"/>
              <stop offset="60%"  stopColor="#8030a0"/>
              <stop offset="100%" stopColor="#500870"/>
            </radialGradient>
            <linearGradient id="palm-g" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#7a5028"/>
              <stop offset="100%" stopColor="#4e2c0c"/>
            </linearGradient>
            <linearGradient id="floor-g" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#06101e" stopOpacity="0"/>
              <stop offset="40%"  stopColor="#080e18" stopOpacity="0.75"/>
              <stop offset="100%" stopColor="#060c14" stopOpacity="1"/>
            </linearGradient>
          </defs>

          {/* SKY */}
          <rect width="1440" height="165" fill="url(#sky-g)"/>

          {/* Moon halo + crescent */}
          <ellipse cx="145" cy="64" rx="80" ry="80" fill="url(#moon-g)"/>
          <circle  cx="145" cy="64" r="33" fill="#f8f0bc"/>
          <circle  cx="159" cy="56" r="28" fill="#091c35"/>
          {/* Craters */}
          <circle cx="134" cy="70" r="4"   fill="rgba(200,175,90,0.28)"/>
          <circle cx="144" cy="53" r="2.5" fill="rgba(200,175,90,0.22)"/>
          <circle cx="126" cy="58" r="3"   fill="rgba(200,175,90,0.18)"/>

          {/* Stars */}
          {([
            [305,26,2],[418,16,1.5],[518,38,1.2],[628,10,2.2],[748,30,1.6],
            [858,7,1.8],[968,34,1.2],[1078,19,2],[1178,42,1.5],[1288,13,1.8],
            [1378,36,1.2],[688,53,1.5],[838,46,1.2],[1098,56,1.8],[558,21,1],
            [718,13,1.3],[1018,49,1],[458,46,1.5],[378,28,1],[1238,40,1.3],
            [200,18,1],[490,14,1.2],[910,24,1.4],[1150,30,1],
          ] as [number,number,number][]).map(([x,y,r],i) => (
            <circle key={i} cx={x} cy={y} r={r} fill="#fff" opacity={0.38+(i%4)*0.14}/>
          ))}

          {/* ── ISLAND (upper right) ── */}
          {/* Sand shadow base */}
          <ellipse cx="1300" cy="168" rx="105" ry="14" fill="#7a5010" opacity="0.55"/>
          {/* Sand */}
          <ellipse cx="1300" cy="163" rx="102" ry="16" fill="url(#sand-g)"/>
          {/* Vegetation */}
          <ellipse cx="1262" cy="148" rx="74"  ry="24" fill="#1e5410"/>
          <ellipse cx="1308" cy="150" rx="52"  ry="19" fill="#2a6c18"/>
          <ellipse cx="1238" cy="156" rx="38"  ry="14" fill="#174c0e"/>
          <ellipse cx="1338" cy="155" rx="32"  ry="12" fill="#235c14"/>
          <ellipse cx="1285" cy="144" rx="26"  ry="10" fill="#327020"/>
          {/* Beach rocks */}
          <ellipse cx="1205" cy="162" rx="10" ry="5.5" fill="#9a6c28"/>
          <ellipse cx="1365" cy="160" rx="7"  ry="4"   fill="#8a6020"/>
          <ellipse cx="1390" cy="164" rx="9"  ry="4.5" fill="#7a5518"/>

          {/* Palm trunk (curved path) */}
          <path d="M1282 162 C1280 144 1274 126 1271 108 C1268 90 1270 74 1272 58"
            stroke="url(#palm-g)" strokeWidth="9" fill="none" strokeLinecap="round"/>
          {/* Trunk texture */}
          <path d="M1279 154 C1276 140 1271 122 1269 104"
            stroke="#a07030" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.4"/>
          <path d="M1285 148 C1282 134 1276 116 1274 96"
            stroke="#a07030" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.3"/>

          {/* Palm leaves — 7 leaves, layered */}
          <path d="M1272 58 C1246 50 1218 54 1196 68" stroke="#186014" strokeWidth="10" fill="none" strokeLinecap="round"/>
          <path d="M1272 58 C1246 50 1218 54 1196 68" stroke="#24801c" strokeWidth="4"  fill="none" strokeLinecap="round" strokeDasharray="5 3" opacity="0.55"/>
          <path d="M1272 58 C1258 40 1252 20 1262 3"  stroke="#156010" strokeWidth="9"  fill="none" strokeLinecap="round"/>
          <path d="M1272 58 C1258 40 1252 20 1262 3"  stroke="#22781a" strokeWidth="4"  fill="none" strokeLinecap="round" strokeDasharray="5 3" opacity="0.5"/>
          <path d="M1272 58 C1292 38 1314 28 1330 34" stroke="#1a6414" strokeWidth="9"  fill="none" strokeLinecap="round"/>
          <path d="M1272 58 C1292 38 1314 28 1330 34" stroke="#268020" strokeWidth="4"  fill="none" strokeLinecap="round" strokeDasharray="5 3" opacity="0.5"/>
          <path d="M1272 58 C1298 54 1322 58 1340 72" stroke="#1e6818" strokeWidth="10" fill="none" strokeLinecap="round"/>
          <path d="M1272 58 C1298 54 1322 58 1340 72" stroke="#2a7e22" strokeWidth="4"  fill="none" strokeLinecap="round" strokeDasharray="5 3" opacity="0.55"/>
          {/* Drooping leaves */}
          <path d="M1272 58 C1258 66 1238 74 1220 88" stroke="#175c12" strokeWidth="8" fill="none" strokeLinecap="round"/>
          <path d="M1272 58 C1288 66 1308 76 1322 92" stroke="#1e6818" strokeWidth="8" fill="none" strokeLinecap="round"/>
          <path d="M1272 58 C1275 44 1286 32 1298 24" stroke="#1a6014" strokeWidth="6" fill="none" strokeLinecap="round"/>

          {/* Coconut cluster */}
          <circle cx="1264" cy="66" r="7"   fill="#5c2c08"/>
          <circle cx="1275" cy="70" r="6.5" fill="#6a3410"/>
          <circle cx="1268" cy="73" r="6"   fill="#7a3e14"/>
          <circle cx="1262" cy="64" r="2.2" fill="rgba(255,210,140,0.28)"/>
          <circle cx="1273" cy="68" r="2"   fill="rgba(255,210,140,0.22)"/>

          {/* WATER SURFACE */}
          <path d="M0 165 Q90 155 180 165 Q270 175 360 165 Q450 155 540 165
                   Q630 175 720 165 Q810 155 900 165 Q990 175 1080 165
                   Q1170 155 1260 165 Q1350 175 1440 165
                   L1440 180 Q1350 190 1260 180 Q1170 170 1080 180
                   Q990 190 900 180 Q810 170 720 180 Q630 190 540 180
                   Q450 170 360 180 Q270 190 180 180 Q90 170 0 180 Z"
            fill="#1878aa" opacity="0.65"/>
          <path d="M0 174 Q360 164 720 174 Q1080 184 1440 174"
            stroke="#8ad4f0" strokeWidth="1.5" fill="none" opacity="0.32"/>

          {/* OCEAN */}
          <rect y="165" width="1440" height="645" fill="url(#ocean-g)"/>

          {/* Light rays */}
          <polygon points="480,165 320,810 640,810"  fill="url(#ray-g)"/>
          <polygon points="780,165 640,810 920,810"  fill="url(#ray-g)"/>
          <polygon points="1100,165 940,810 1260,810" fill="url(#ray-g)"/>

          {/* ── JELLYFISH — drifts right to left, bell pulses, mid-water y≈315 ── */}
          <g className="ocean-jelly-1">
            <g className="ocean-jelly-1__bell">
              {/* Bell dome */}
              <path d="M -30 320 Q -32 284 0 282 Q 32 284 30 320 Q 18 326 0 324 Q -18 326 -30 320 Z"
                fill="rgba(215,125,245,0.28)" stroke="rgba(235,160,255,0.62)" strokeWidth="1.6"/>
              {/* Frilly rim */}
              <path d="M -30 320 Q -22 330 -14 323 Q -6 330 0 323 Q 6 330 14 323 Q 22 330 30 320"
                fill="rgba(215,125,245,0.18)" stroke="rgba(230,155,255,0.5)" strokeWidth="1.2"/>
              {/* Inner organs — two horseshoe shapes */}
              <path d="M -13 306 Q -13 295 -7 295 Q -1 295 -1 306 Q -1 314 -7 314 Q -13 314 -13 306 Z"
                fill="none" stroke="rgba(225,140,250,0.55)" strokeWidth="1.4"/>
              <path d="M 1 306 Q 1 295 7 295 Q 13 295 13 306 Q 13 314 7 314 Q 1 314 1 306 Z"
                fill="none" stroke="rgba(225,140,250,0.55)" strokeWidth="1.4"/>
            </g>
            {/* Oral arms — 4 medium wavy */}
            <path d="M -10 324 Q -17 348 -10 370 Q -3 390 -11 412"
              stroke="rgba(210,125,240,0.55)" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
            <path d="M -3 325 Q -6 352 -2 376 Q 2 396 -2 418"
              stroke="rgba(200,115,230,0.5)" strokeWidth="2" fill="none" strokeLinecap="round"/>
            <path d="M 3 325 Q 6 350 2 374 Q -2 394 2 416"
              stroke="rgba(210,125,240,0.5)" strokeWidth="2" fill="none" strokeLinecap="round"/>
            <path d="M 10 324 Q 17 346 10 368 Q 3 388 11 410"
              stroke="rgba(200,115,230,0.55)" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
            {/* Long thin tentacles */}
            <path d="M -23 321 Q -29 364 -21 404 Q -13 440 -21 468"
              stroke="rgba(195,110,225,0.38)" strokeWidth="1.1" fill="none" strokeLinecap="round"/>
            <path d="M -13 322 Q -17 368 -11 408 Q -5 442 -13 472"
              stroke="rgba(185,100,215,0.3)" strokeWidth="0.9" fill="none" strokeLinecap="round"/>
            <path d="M 0 326 Q 2 374 0 414 Q -2 448 0 478"
              stroke="rgba(195,110,225,0.35)" strokeWidth="1" fill="none" strokeLinecap="round"/>
            <path d="M 13 322 Q 17 366 11 406 Q 5 440 13 470"
              stroke="rgba(185,100,215,0.3)" strokeWidth="0.9" fill="none" strokeLinecap="round"/>
            <path d="M 23 321 Q 29 362 21 402 Q 13 438 21 466"
              stroke="rgba(195,110,225,0.38)" strokeWidth="1.1" fill="none" strokeLinecap="round"/>
          </g>

          {/* ── DOLPHIN — jumping near surface ── */}
          <g className="ocean-dolphin-1">
            <ellipse cx="680" cy="188" rx="54" ry="14" fill="#4a8aaa"/>
            <polygon points="680,174 702,152 716,174" fill="#3a7898"/>
            <polygon points="626,188 602,174 602,202" fill="#3a7898"/>
            <ellipse cx="650" cy="193" rx="14" ry="6"  fill="#3a7898" transform="rotate(-22 650 193)"/>
            <ellipse cx="668" cy="190" rx="36" ry="6"  fill="#c0dce8" opacity="0.6"/>
            <polygon points="730,188 752,184 752,192" fill="#5a9ab8"/>
            <circle cx="724" cy="183" r="5.5" fill="#1a2a3a"/>
            <circle cx="722" cy="181" r="2"   fill="#fff" opacity="0.8"/>
            <path d="M730 190 Q739 193 743 191" stroke="#3a7898" strokeWidth="1.5" fill="none"/>
          </g>

          {/* ── CLOWNFISH (fish 1) — facing right, y=284 ── */}
          <g className="ocean-fish-1">
            {/* Tail */}
            <path d="M-24,284 C-33,277 -46,270 -51,266 L-44,275 L-24,284 L-44,293 L-51,302 C-46,298 -33,291 -24,284Z"
              fill="#b04008"/>
            {/* Body */}
            <path d="M26,284 C24,271 11,268 -1,269 C-14,270 -24,276 -24,284 C-24,292 -14,298 -1,299 C11,300 24,297 26,284Z"
              fill="url(#cf-g)" stroke="#7a2400" strokeWidth="0.6"/>
            {/* Dorsal fin */}
            <path d="M-7,270 C-2,257 9,253 20,269"
              fill="#d05808" stroke="#9a2800" strokeWidth="0.8"/>
            {/* Pectoral fin */}
            <path d="M7,284 C7,292 16,302 10,303 C3,303 2,293 7,284"
              fill="#c84a00" opacity="0.9"/>
            {/* White stripe 1 — near head */}
            <path d="M16,270 C19,270 22,272 22,284 C22,296 19,298 16,298 C13,298 10,296 10,284 C10,272 13,270 16,270Z"
              fill="#fff" stroke="#2a0a00" strokeWidth="1"/>
            {/* White stripe 2 — mid body */}
            <path d="M1,270 C4,270 6,272 6,284 C6,296 4,298 1,298 C-2,298 -5,296 -5,284 C-5,272 -2,270 1,270Z"
              fill="#fff" stroke="#2a0a00" strokeWidth="1"/>
            {/* White stripe 3 — near tail */}
            <path d="M-13,272 C-11,272 -8,274 -8,284 C-8,294 -11,296 -13,296 C-16,296 -19,294 -19,284 C-19,274 -16,272 -13,272Z"
              fill="#fff" stroke="#2a0a00" strokeWidth="0.9"/>
            {/* Eye */}
            <circle cx="20" cy="279" r="5.5" fill="#fff"/>
            <circle cx="20" cy="279" r="3.8" fill="#140600"/>
            <circle cx="18.5" cy="277.5" r="1.8" fill="#fff" opacity="0.9"/>
            {/* Mouth */}
            <path d="M24,285 Q27,288 24,290" stroke="#9a2800" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
          </g>

          {/* ── SHARK — facing right, y=378 ── */}
          <g className="ocean-shark-1">
            {/* Body */}
            <path d="M82,378 C80,360 56,354 18,354 C-18,354 -58,364 -72,378 C-58,392 -18,402 18,402 C56,402 80,396 82,378Z"
              fill="url(#sh-g)"/>
            {/* Tail asymmetric */}
            <path d="M-72,378 C-83,368 -103,357 -110,352 L-102,364 L-72,378 L-102,392 L-110,404 C-103,399 -83,388 -72,378Z"
              fill="#4a6070"/>
            {/* Belly */}
            <ellipse cx="4" cy="390" rx="58" ry="9" fill="#ccd8de" opacity="0.72"/>
            {/* Dorsal fin */}
            <path d="M14,354 C25,331 46,323 64,354" fill="#507080" stroke="#3e5c6e" strokeWidth="0.8"/>
            {/* Pectoral fin */}
            <path d="M-6,378 C4,391 22,404 12,408 C2,408 -8,396 -6,378" fill="#405870"/>
            {/* Snout */}
            <path d="M82,378 C88,372 96,369 98,378 C96,387 88,384 82,378" fill="#7090a0"/>
            {/* Eye */}
            <circle cx="56" cy="368" r="5.5" fill="#18182a"/>
            <circle cx="54.5" cy="366.5" r="2" fill="#fff" opacity="0.45"/>
            <ellipse cx="70" cy="374" rx="2.8" ry="1.5" fill="#3a5868"/>
            {/* Gill slits */}
            <path d="M30 364 Q33 378 30 392" stroke="#3c5a6a" strokeWidth="2" fill="none"/>
            <path d="M20 364 Q23 378 20 392" stroke="#3c5a6a" strokeWidth="1.5" fill="none"/>
            <path d="M10 365 Q13 378 10 391" stroke="#3c5a6a" strokeWidth="1.2" fill="none"/>
          </g>

          {/* ── BLUE FISH (fish 2) — facing left, y=430 ── */}
          <g className="ocean-fish-2">
            {/* Tail (on the right, fish faces left) */}
            <path d="M27,430 C36,422 48,416 52,412 L46,421 L27,430 L46,439 L52,448 C48,444 36,438 27,430Z"
              fill="#0a5aaa"/>
            {/* Body */}
            <path d="M-26,430 C-24,418 -10,415 2,415 C15,415 27,422 27,430 C27,438 15,445 2,445 C-10,445 -24,442 -26,430Z"
              fill="url(#bf-g)" stroke="#073070" strokeWidth="0.6"/>
            {/* Dorsal fin (left side, above) */}
            <path d="M6,415 C2,403 -9,400 -20,415"
              fill="#0e60b0" stroke="#083880" strokeWidth="0.8"/>
            {/* Pectoral fin */}
            <path d="M-7,430 C-7,438 -16,448 -10,450 C-4,450 -2,440 -7,430" fill="#0e58a0" opacity="0.9"/>
            {/* Yellow stripe horizontal */}
            <path d="M-18,426 C-10,424 10,424 18,426 L18,434 C10,436 -10,436 -18,434Z"
              fill="#f0d020" opacity="0.88"/>
            {/* Eye (left side of body) */}
            <circle cx="-18" cy="425" r="5.5" fill="#fff"/>
            <circle cx="-18" cy="425" r="3.8" fill="#060c20"/>
            <circle cx="-19.5" cy="423.5" r="1.8" fill="#fff" opacity="0.9"/>
            {/* Lateral line */}
            <path d="M-22,430 C0,425 0,425 22,430" stroke="#88ccff" strokeWidth="1.2" fill="none" opacity="0.45"/>
            {/* Mouth */}
            <path d="M-24,432 Q-27,435 -24,437" stroke="#0a4898" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
          </g>

          {/* ── YELLOW FISH (fish 3) — facing right, y=556, smaller ── */}
          <g className="ocean-fish-3">
            {/* Tail */}
            <path d="M-17,556 C-23,551 -33,547 -37,543 L-31,550 L-17,556 L-31,562 L-37,569 C-33,565 -23,561 -17,556Z"
              fill="#c89808"/>
            {/* Body */}
            <path d="M20,556 C18,546 7,544 -1,544 C-11,544 -17,549 -17,556 C-17,563 -11,568 -1,568 C7,568 18,566 20,556Z"
              fill="url(#yf-g)" stroke="#806000" strokeWidth="0.5"/>
            {/* Dorsal fin */}
            <path d="M-4,544 C0,536 9,534 16,544" fill="#d0a808" stroke="#906800" strokeWidth="0.7"/>
            {/* Black vertical stripe */}
            <path d="M-2,545 C0,545 2,547 2,556 C2,565 0,567 -2,567 C-4,567 -7,565 -7,556 C-7,547 -4,545 -2,545Z"
              fill="#1a1000"/>
            {/* Eye */}
            <circle cx="13" cy="551" r="3.5" fill="#fff"/>
            <circle cx="13" cy="551" r="2.5" fill="#080400"/>
            <circle cx="12" cy="550" r="1"   fill="#fff" opacity="0.9"/>
          </g>

          {/* ── OCTOPUS — head y=470, tentacles to y=635 ── */}
          <g className="ocean-octopus-1">
            {/* 5 main tentacles ending at y≈635 */}
            <path d="M900 505 C878 522 860 550 852 578 C844 604 848 622 842 638" stroke="#6a2880" strokeWidth="8" fill="none" strokeLinecap="round"/>
            <path d="M900 505 C886 526 878 556 882 584 C886 608 879 622 875 638" stroke="#6a2880" strokeWidth="7" fill="none" strokeLinecap="round"/>
            <path d="M900 505 C898 528 898 560 902 588 C906 612 900 624 898 638" stroke="#6a2880" strokeWidth="7" fill="none" strokeLinecap="round"/>
            <path d="M900 505 C914 524 922 556 918 584 C914 608 922 622 926 638" stroke="#6a2880" strokeWidth="7" fill="none" strokeLinecap="round"/>
            <path d="M900 505 C920 520 940 550 948 578 C956 604 950 622 958 638" stroke="#6a2880" strokeWidth="8" fill="none" strokeLinecap="round"/>
            {/* 3 shorter front tentacles */}
            <path d="M892 508 C877 522 866 538 856 550" stroke="#7a3890" strokeWidth="5.5" fill="none" strokeLinecap="round"/>
            <path d="M900 508 C898 524 895 540 893 554" stroke="#7a3890" strokeWidth="5.5" fill="none" strokeLinecap="round"/>
            <path d="M908 508 C923 522 932 538 944 550" stroke="#7a3890" strokeWidth="5.5" fill="none" strokeLinecap="round"/>
            {/* Suction cups */}
            {([
              [850,577],[844,603],[874,582],[876,608],[900,585],[901,610],[922,580],[928,608],[950,577],[955,604],
            ] as [number,number][]).map(([cx,cy],i) => (
              <circle key={i} cx={cx} cy={cy} r="2.5" fill="none" stroke="#b866cc" strokeWidth="1.1" opacity="0.65"/>
            ))}
            {/* Head / mantle */}
            <ellipse cx="900" cy="478" rx="42" ry="30" fill="url(#oct-g)"/>
            <ellipse cx="895" cy="468" rx="24" ry="13" fill="rgba(200,110,220,0.3)"/>
            {/* Body */}
            <ellipse cx="900" cy="506" rx="34" ry="21" fill="#9040b0"/>
            <ellipse cx="895" cy="500" rx="17" ry="9"  fill="rgba(200,110,220,0.25)"/>
            {/* Eyes */}
            <circle cx="882" cy="482" r="8.5" fill="#120820"/>
            <circle cx="882" cy="482" r="6"   fill="#241038"/>
            <circle cx="879.5" cy="479.5" r="2.5" fill="#fff" opacity="0.9"/>
            <ellipse cx="882" cy="483" rx="1.8" ry="2.2" fill="#000"/>
            <circle cx="918" cy="482" r="8.5" fill="#120820"/>
            <circle cx="918" cy="482" r="6"   fill="#241038"/>
            <circle cx="915.5" cy="479.5" r="2.5" fill="#fff" opacity="0.9"/>
            <ellipse cx="918" cy="483" rx="1.8" ry="2.2" fill="#000"/>
            {/* Ink cloud */}
            <ellipse cx="862" cy="496" rx="16" ry="10" fill="#100820" opacity="0.32"/>
            <ellipse cx="854" cy="490" rx="10" ry="7"  fill="#100820" opacity="0.22"/>
          </g>

          {/* BUBBLES */}
          {([
            [220,480,5],[380,555,3],[550,415,4],[700,590,3.5],[1060,460,3],
            [1230,572,4],[1380,520,3],[162,540,2.5],[472,500,3.5],[832,468,2.5],
          ] as [number,number,number][]).map(([x,y,r],i) => (
            <circle key={i} cx={x} cy={y} r={r} fill="none" stroke="#5ab4e8"
              strokeWidth="1.2" opacity="0.4"
              className={`ocean-bubble ocean-bubble-${(i%3)+1}`}/>
          ))}

          {/* OCEAN FLOOR — atmospheric gradient, fades in from y=570 */}
          <rect x="0" y="570" width="1440" height="240" fill="url(#floor-g)"/>

          {/* SEAWEED — drawn BEFORE ground base so roots are buried under it.
              Each plant: root deep at y=638, tops at varying heights. */}
          {([
            [155, 455], [330, 502], [565, 462], [750, 530],
            [1010, 474], [1190, 492], [1380, 518],
          ] as [number,number][]).map(([x, top], i) => {
            const root = 638
            const h    = root - top
            const m1   = root - h * 0.32
            const m2   = root - h * 0.66
            return (
              <g key={i} className={`ocean-seaweed ocean-seaweed-${(i % 2) + 1}`}>
                {/* main stem — S-curve */}
                <path d={`M${x} ${root} Q${x-22} ${m1} ${x} ${(m1+m2)/2} Q${x+22} ${m2} ${x} ${top}`}
                  stroke="#187228" strokeWidth="5.5" fill="none" strokeLinecap="round"/>
                {/* short side shoot */}
                <path d={`M${x} ${root} Q${x+18} ${root-h*0.38} ${x+7} ${root-h*0.6}`}
                  stroke="#269834" strokeWidth="4" fill="none" strokeLinecap="round"/>
                {/* thin back strand */}
                <path d={`M${x+8} ${root} Q${x-10} ${root-h*0.34} ${x+3} ${root-h*0.58} Q${x+20} ${root-h*0.76} ${x+8} ${top+h*0.14}`}
                  stroke="#125c20" strokeWidth="3" fill="none" strokeLinecap="round"/>
              </g>
            )
          })}

          {/* OCEAN FLOOR BASE — drawn AFTER seaweed so it buries the roots */}
          <rect x="0" y="600" width="1440" height="210" fill="#0a1810"/>

          {/* STARFISH — on the floor at y≈604 */}
          <g transform="translate(308,604) rotate(14)">
            <polygon points="0,-20 4.4,-7 18,-6.4 7,2.2 11,16.4 0,8.2 -11,16.4 -7,2.2 -18,-6.4 -4.4,-7"
              fill="#d03a18" stroke="#ee5830" strokeWidth="1"/>
            {[0,-12,7,8,-7,8,11,-3.5,-11,-3.5].reduce((acc,_,idx,arr)=>idx%2===0?[...acc,[arr[idx],arr[idx+1]] as [number,number]]:acc,[] as [number,number][]).map(([cx,cy],i)=>
              <circle key={i} cx={cx} cy={cy} r="2.2" fill="#f06038" opacity="0.6"/>)}
            <circle cx="0" cy="0" r="4.5" fill="#b02810"/>
          </g>
          <g transform="translate(738,608) rotate(-22)">
            <polygon points="0,-16 3.5,-5.5 14.4,-4.8 5.6,1.6 8.8,12.8 0,6.4 -8.8,12.8 -5.6,1.6 -14.4,-4.8 -3.5,-5.5"
              fill="#7a2890" stroke="#9a44b0" strokeWidth="1"/>
            {[0,-9,6,6,-6,6,9,-3,-9,-3].reduce((acc,_,idx,arr)=>idx%2===0?[...acc,[arr[idx],arr[idx+1]] as [number,number]]:acc,[] as [number,number][]).map(([cx,cy],i)=>
              <circle key={i} cx={cx} cy={cy} r="1.8" fill="#b060c8" opacity="0.6"/>)}
            <circle cx="0" cy="0" r="3.5" fill="#5a1870"/>
          </g>
          <g transform="translate(1155,605) rotate(6)">
            <polygon points="0,-22 4.8,-7.6 20.2,-6.6 7.8,2.4 12.2,17.6 0,9 -12.2,17.6 -7.8,2.4 -20.2,-6.6 -4.8,-7.6"
              fill="#df5e0e" stroke="#f07e2e" strokeWidth="1"/>
            {[0,-13,8,9,-8,9,12,-4,-12,-4].reduce((acc,_,idx,arr)=>idx%2===0?[...acc,[arr[idx],arr[idx+1]] as [number,number]]:acc,[] as [number,number][]).map(([cx,cy],i)=>
              <circle key={i} cx={cx} cy={cy} r="2.5" fill="#f08838" opacity="0.55"/>)}
            <circle cx="0" cy="0" r="5" fill="#b03c08"/>
          </g>
          <g transform="translate(1348,610) rotate(-34)">
            <polygon points="0,-13 2.8,-4.5 12,-4 4.7,1.5 7.2,10 0,5.2 -7.2,10 -4.7,1.5 -12,-4 -2.8,-4.5"
              fill="#c83868" stroke="#e85898" strokeWidth="0.8"/>
            <circle cx="0" cy="0" r="3" fill="#a01e50"/>
          </g>

          {/* OCEAN FLOOR ROCKS — algae-green tint keeps hue on any color profile */}
          <ellipse cx="316"  cy="620" rx="90"  ry="17" fill="#1a3024"/>
          <ellipse cx="316"  cy="613" rx="76"  ry="12" fill="#224030"/>
          <ellipse cx="718"  cy="621" rx="138" ry="19" fill="#182c20"/>
          <ellipse cx="718"  cy="614" rx="116" ry="13" fill="#203a28"/>
          <ellipse cx="1148" cy="620" rx="102" ry="17" fill="#1a3024"/>
          <ellipse cx="1148" cy="613" rx="84"  ry="12" fill="#224030"/>
          <ellipse cx="1388" cy="621" rx="76"  ry="16" fill="#182c20"/>
          <ellipse cx="478"  cy="618" rx="34"  ry="9"  fill="#1c3222"/>
          <ellipse cx="896"  cy="620" rx="26"  ry="7"  fill="#1a3024"/>
          <ellipse cx="1018" cy="618" rx="22"  ry="6"  fill="#1c3222"/>

          {/* SHELLS — decorative on the ocean floor */}
          {/* Conch shell */}
          <g transform="translate(200,610) rotate(-12)">
            <ellipse cx="0" cy="-3" rx="13" ry="9" fill="#c89858" stroke="#886028" strokeWidth="1"/>
            <ellipse cx="2" cy="-3" rx="7" ry="5" fill="#dab870" stroke="#886028" strokeWidth="0.7"/>
            <circle cx="5" cy="-4" r="2.5" fill="#a07030"/>
            <path d="M8,-9 Q12,-17 9,-21" stroke="#906028" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            <path d="M-13,-3 Q-15,4 -9,8 Q-3,10 3,7" fill="#e8c080" stroke="#886028" strokeWidth="0.8"/>
          </g>
          {/* Clam / scallop shell */}
          <g transform="translate(560,607) rotate(8)">
            <path d="M-14,4 Q0,14 14,4" fill="#d4b070" stroke="#a07840" strokeWidth="0.9"/>
            <path d="M-14,4 Q-15,-10 0,-12 Q15,-10 14,4" fill="#e8c888" stroke="#a07840" strokeWidth="0.9"/>
            <line x1="0" y1="-12" x2="0" y2="10" stroke="#a07840" strokeWidth="0.6" opacity="0.5"/>
            <line x1="0" y1="-12" x2="-9" y2="9" stroke="#a07840" strokeWidth="0.5" opacity="0.45"/>
            <line x1="0" y1="-12" x2="9" y2="9" stroke="#a07840" strokeWidth="0.5" opacity="0.45"/>
            <line x1="0" y1="-12" x2="-13" y2="3" stroke="#a07840" strokeWidth="0.5" opacity="0.35"/>
            <line x1="0" y1="-12" x2="13" y2="3" stroke="#a07840" strokeWidth="0.5" opacity="0.35"/>
            <circle cx="0" cy="-12" r="2" fill="#907030"/>
          </g>
          {/* Small spiral shell */}
          <g transform="translate(1050,612) rotate(18)">
            <ellipse cx="0" cy="0" rx="9" ry="6.5" fill="#b89858" stroke="#806030" strokeWidth="0.8"/>
            <ellipse cx="2" cy="0" rx="5" ry="3.5" fill="#ccaa60" stroke="#806030" strokeWidth="0.6"/>
            <circle cx="4" cy="-1" r="1.8" fill="#906828"/>
            <path d="M7,-3 Q10,-9 8,-12" stroke="#806030" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
          </g>

          {/* SNAIL — walks right→left, head leads (left), shell trails (right) */}
          <g className="ocean-snail-1">
            {/* Shell (right side — trails behind) */}
            <ellipse cx="0" cy="601" rx="13" ry="9" fill="#c89858" stroke="#886028" strokeWidth="1.1"/>
            <ellipse cx="2" cy="601" rx="7" ry="5" fill="#dab870" stroke="#886028" strokeWidth="0.8"/>
            <circle cx="5" cy="600" r="2.5" fill="#a07030"/>
            {/* Spire */}
            <path d="M8,595 Q12,588 9,583" stroke="#906028" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            {/* Lip (opens to the left toward body) */}
            <path d="M-13,601 Q-15,607 -9,610 Q-3,612 3,609" fill="#e8c080" stroke="#886028" strokeWidth="0.8"/>
            {/* Body — foot + head + eyestalks (left side, leads the way), retracts into shell periodically */}
            <g className="ocean-snail-1__body">
              <path d="M-2,609 Q-20,613 -40,611 Q-46,611 -50,609 Q-46,607 -40,607 Q-20,609 -2,609Z"
                fill="#7a9848" stroke="#4a6828" strokeWidth="0.7"/>
              <ellipse cx="-44" cy="605" rx="8" ry="5" fill="#8aaa50" stroke="#4a6828" strokeWidth="0.8"/>
              <path d="M-48,603 Q-50,597 -50,593" stroke="#4a6828" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
              <circle cx="-50" cy="592" r="2.2" fill="#1a1010"/>
              <path d="M-42,602 Q-42,596 -40,593" stroke="#4a6828" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
              <circle cx="-40" cy="592" r="2.2" fill="#1a1010"/>
              <path d="M-47,607 Q-44,609 -41,607" stroke="#4a6828" strokeWidth="0.8" fill="none" strokeLinecap="round"/>
            </g>
          </g>
        </svg>

        {/* ── MOBILE / PORTRAIT (≤639px) ── viewBox 400×860 */}
        <svg className="statki-bg__mobile"
          viewBox="0 0 400 860" preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <defs>
            <linearGradient id="m-sky-g" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#010a18"/>
              <stop offset="100%" stopColor="#091c35"/>
            </linearGradient>
            <linearGradient id="m-ocean-g" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#0c4a72"/>
              <stop offset="40%"  stopColor="#083a5e"/>
              <stop offset="100%" stopColor="#020d1c"/>
            </linearGradient>
            <linearGradient id="m-ray-g" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#5ab4e8" stopOpacity="0.12"/>
              <stop offset="100%" stopColor="#5ab4e8" stopOpacity="0"/>
            </linearGradient>
            <radialGradient id="m-moon-g" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="#f8e878" stopOpacity="0.32"/>
              <stop offset="100%" stopColor="#f8e878" stopOpacity="0"/>
            </radialGradient>
            <radialGradient id="m-cf-g" cx="28%" cy="32%" r="70%">
              <stop offset="0%"   stopColor="#ffaa3a"/>
              <stop offset="55%"  stopColor="#e06812"/>
              <stop offset="100%" stopColor="#9c3000"/>
            </radialGradient>
            <radialGradient id="m-bf-g" cx="65%" cy="32%" r="68%">
              <stop offset="0%"   stopColor="#66c8ff"/>
              <stop offset="55%"  stopColor="#1880e2"/>
              <stop offset="100%" stopColor="#073578"/>
            </radialGradient>
            <radialGradient id="m-oct-g" cx="40%" cy="35%" r="65%">
              <stop offset="0%"   stopColor="#c060d8"/>
              <stop offset="60%"  stopColor="#8030a0"/>
              <stop offset="100%" stopColor="#500870"/>
            </radialGradient>
            <radialGradient id="m-sand-g" cx="50%" cy="30%" r="60%">
              <stop offset="0%"   stopColor="#f0cc68"/>
              <stop offset="100%" stopColor="#a87020"/>
            </radialGradient>
            <linearGradient id="m-palm-g" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#7a5028"/>
              <stop offset="100%" stopColor="#4e2c0c"/>
            </linearGradient>
          </defs>

          {/* Sky */}
          <rect width="400" height="200" fill="url(#m-sky-g)"/>

          {/* Moon */}
          <ellipse cx="68" cy="62" rx="64" ry="64" fill="url(#m-moon-g)"/>
          <circle  cx="68" cy="62" r="28" fill="#f8f0bc"/>
          <circle  cx="80" cy="55" r="24" fill="#091c35"/>
          <circle cx="57" cy="68" r="3.5" fill="rgba(200,175,90,0.28)"/>
          <circle cx="66" cy="52" r="2"   fill="rgba(200,175,90,0.22)"/>

          {/* Stars */}
          {([
            [150,18,1.5],[220,10,2],[290,22,1.2],[340,8,1.8],[380,28,1.3],
            [175,40,1],[255,35,1.5],[310,46,1.2],[120,30,1.3],[370,15,1],
            [200,50,1.2],[265,15,1.8],[340,38,1],[130,48,1.4],
          ] as [number,number,number][]).map(([x,y,r],i) => (
            <circle key={i} cx={x} cy={y} r={r} fill="#fff" opacity={0.38+(i%4)*0.14}/>
          ))}

          {/* Island top-right (portrait, smaller) */}
          <ellipse cx="352" cy="182" rx="60" ry="11" fill="#8a5a18" opacity="0.5"/>
          <ellipse cx="352" cy="178" rx="58" ry="12" fill="url(#m-sand-g)"/>
          <ellipse cx="334" cy="167" rx="44" ry="16" fill="#1e5410"/>
          <ellipse cx="358" cy="169" rx="30" ry="12" fill="#2a6c18"/>
          {/* Palm trunk */}
          <path d="M340 176 C338 162 334 148 332 134 C330 120 332 108 333 96"
            stroke="url(#m-palm-g)" strokeWidth="7" fill="none" strokeLinecap="round"/>
          {/* Palm leaves */}
          <path d="M333 96 C318 88 302 91 288 101" stroke="#186014" strokeWidth="8" fill="none" strokeLinecap="round"/>
          <path d="M333 96 C322 80 318 64 326 50"  stroke="#156010" strokeWidth="7" fill="none" strokeLinecap="round"/>
          <path d="M333 96 C348 80 362 74 372 80"  stroke="#1a6414" strokeWidth="7" fill="none" strokeLinecap="round"/>
          <path d="M333 96 C346 90 358 94 368 104" stroke="#1e6818" strokeWidth="8" fill="none" strokeLinecap="round"/>
          <path d="M333 96 C322 102 308 110 296 120" stroke="#175c12" strokeWidth="6" fill="none" strokeLinecap="round"/>
          {/* Coconuts */}
          <circle cx="326" cy="103" r="5.5" fill="#5c2c08"/>
          <circle cx="334" cy="107" r="5"   fill="#6a3410"/>

          {/* Water surface */}
          <path d="M0 200 Q50 192 100 200 Q150 208 200 200 Q250 192 300 200 Q350 208 400 200
                   L400 212 Q350 220 300 212 Q250 204 200 212 Q150 220 100 212 Q50 204 0 212 Z"
            fill="#1878aa" opacity="0.65"/>
          <path d="M0 208 Q200 200 400 208" stroke="#8ad4f0" strokeWidth="1.5" fill="none" opacity="0.32"/>

          {/* Ocean */}
          <rect y="200" width="400" height="660" fill="url(#m-ocean-g)"/>

          {/* Light rays */}
          <polygon points="200,200 120,860 280,860" fill="url(#m-ray-g)"/>
          <polygon points="320,200 260,860 380,860" fill="url(#m-ray-g)"/>

          {/* ── MOBILE JELLYFISH — drifts right to left, bell at y≈420 ── */}
          <g className="ocean-jelly-1m">
            <g className="ocean-jelly-1__bell">
              <path d="M -22 426 Q -24 400 0 398 Q 24 400 22 426 Q 14 432 0 430 Q -14 432 -22 426 Z"
                fill="rgba(215,125,245,0.28)" stroke="rgba(235,160,255,0.62)" strokeWidth="1.5"/>
              <path d="M -22 426 Q -15 434 -8 428 Q 0 434 8 428 Q 15 434 22 426"
                fill="rgba(215,125,245,0.16)" stroke="rgba(230,155,255,0.48)" strokeWidth="1.1"/>
              <path d="M -9 413 Q -9 404 -4 404 Q 1 404 1 413 Q 1 420 -4 420 Q -9 420 -9 413 Z"
                fill="none" stroke="rgba(225,140,250,0.55)" strokeWidth="1.3"/>
              <path d="M 1 413 Q 1 404 6 404 Q 11 404 11 413 Q 11 420 6 420 Q 1 420 1 413 Z"
                fill="none" stroke="rgba(225,140,250,0.55)" strokeWidth="1.3"/>
            </g>
            <path d="M -7 430 Q -13 452 -7 472 Q -1 490 -9 508"
              stroke="rgba(210,125,240,0.55)" strokeWidth="2" fill="none" strokeLinecap="round"/>
            <path d="M 0 431 Q 2 456 0 478 Q -2 496 0 514"
              stroke="rgba(200,115,230,0.5)" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
            <path d="M 7 430 Q 13 450 7 470 Q 1 488 9 506"
              stroke="rgba(210,125,240,0.5)" strokeWidth="2" fill="none" strokeLinecap="round"/>
            <path d="M -18 428 Q -22 462 -16 494 Q -10 522 -18 548"
              stroke="rgba(195,110,225,0.36)" strokeWidth="0.9" fill="none" strokeLinecap="round"/>
            <path d="M 18 428 Q 22 460 16 492 Q 10 520 18 546"
              stroke="rgba(195,110,225,0.36)" strokeWidth="0.9" fill="none" strokeLinecap="round"/>
          </g>

          {/* ── MOBILE CLOWNFISH — facing right, y=340 ── */}
          <g className="ocean-fish-1m">
            <path d="M-18,340 C-25,334 -35,329 -38,326 L-33,333 L-18,340 L-33,347 L-38,354 C-35,351 -25,346 -18,340Z"
              fill="#b04008"/>
            <path d="M20,340 C18,330 9,328 1,328 C-9,328 -18,333 -18,340 C-18,347 -9,352 1,352 C9,352 18,350 20,340Z"
              fill="url(#m-cf-g)" stroke="#7a2400" strokeWidth="0.6"/>
            <path d="M-4,328 C-1,320 7,318 15,328" fill="#d05808" stroke="#9a2800" strokeWidth="0.7"/>
            <path d="M12,340 C12,347 19,355 14,356 C8,356 7,347 12,340" fill="#c84a00" opacity="0.9"/>
            <path d="M11,329 C13,329 16,331 16,340 C16,349 13,351 11,351 C8,351 6,349 6,340 C6,331 8,329 11,329Z"
              fill="#fff" stroke="#2a0a00" strokeWidth="0.9"/>
            <path d="M0,329 C2,329 4,331 4,340 C4,349 2,351 0,351 C-2,351 -4,349 -4,340 C-4,331 -2,329 0,329Z"
              fill="#fff" stroke="#2a0a00" strokeWidth="0.9"/>
            <circle cx="15" cy="335" r="4.5" fill="#fff"/>
            <circle cx="15" cy="335" r="3.2" fill="#140600"/>
            <circle cx="13.8" cy="333.8" r="1.4" fill="#fff" opacity="0.9"/>
          </g>

          {/* ── MOBILE BLUE FISH — facing left, y=490 ── */}
          <g className="ocean-fish-2m">
            <path d="M20,490 C27,483 37,477 41,474 L35,482 L20,490 L35,498 L41,506 C37,502 27,497 20,490Z"
              fill="#0a5aaa"/>
            <path d="M-20,490 C-18,480 -8,477 2,477 C12,477 20,483 20,490 C20,497 12,503 2,503 C-8,503 -18,500 -20,490Z"
              fill="url(#m-bf-g)" stroke="#073070" strokeWidth="0.6"/>
            <path d="M4,477 C1,468 -7,466 -16,477" fill="#0e60b0" stroke="#083880" strokeWidth="0.7"/>
            <path d="M-12,486 C-6,484 8,484 14,486 L14,494 C8,496 -6,496 -12,494Z"
              fill="#f0d020" opacity="0.85"/>
            <circle cx="-14" cy="485" r="4.5" fill="#fff"/>
            <circle cx="-14" cy="485" r="3.2" fill="#060c20"/>
            <circle cx="-15.5" cy="483.5" r="1.4" fill="#fff" opacity="0.9"/>
          </g>

          {/* ── MOBILE OCTOPUS — centered at (200,690) ── */}
          <g className="ocean-octopus-1m">
            <path d="M200 720 C182 740 168 768 162 796 C156 816 162 830 155 845" stroke="#6a2880" strokeWidth="7" fill="none" strokeLinecap="round"/>
            <path d="M200 720 C188 744 182 774 185 800 C188 820 181 834 178 845" stroke="#6a2880" strokeWidth="6" fill="none" strokeLinecap="round"/>
            <path d="M200 720 C198 746 198 776 200 802 C202 822 198 836 197 845" stroke="#6a2880" strokeWidth="6" fill="none" strokeLinecap="round"/>
            <path d="M200 720 C212 742 218 774 215 800 C212 820 218 834 222 845" stroke="#6a2880" strokeWidth="6" fill="none" strokeLinecap="round"/>
            <path d="M200 720 C220 738 234 768 240 796 C246 816 240 830 246 845" stroke="#6a2880" strokeWidth="7" fill="none" strokeLinecap="round"/>
            <path d="M193 722 C180 736 170 751 160 762" stroke="#7a3890" strokeWidth="5" fill="none" strokeLinecap="round"/>
            <path d="M200 722 C198 738 196 754 194 766" stroke="#7a3890" strokeWidth="5" fill="none" strokeLinecap="round"/>
            <path d="M207 722 C220 736 230 751 240 762" stroke="#7a3890" strokeWidth="5" fill="none" strokeLinecap="round"/>
            <ellipse cx="200" cy="694" rx="38" ry="27" fill="url(#m-oct-g)"/>
            <ellipse cx="196" cy="685" rx="21" ry="12" fill="rgba(200,110,220,0.3)"/>
            <ellipse cx="200" cy="720" rx="30" ry="19" fill="#9040b0"/>
            <circle cx="184" cy="698" r="7.5" fill="#120820"/>
            <circle cx="184" cy="698" r="5.2" fill="#241038"/>
            <circle cx="182" cy="696" r="2.2" fill="#fff" opacity="0.9"/>
            <ellipse cx="184" cy="699" rx="1.6" ry="2" fill="#000"/>
            <circle cx="216" cy="698" r="7.5" fill="#120820"/>
            <circle cx="216" cy="698" r="5.2" fill="#241038"/>
            <circle cx="214" cy="696" r="2.2" fill="#fff" opacity="0.9"/>
            <ellipse cx="216" cy="699" rx="1.6" ry="2" fill="#000"/>
          </g>

          {/* Mobile bubbles */}
          {([
            [80,600,4],[160,680,3],[240,540,3.5],[320,720,3],[360,620,2.5],
          ] as [number,number,number][]).map(([x,y,r],i) => (
            <circle key={i} cx={x} cy={y} r={r} fill="none" stroke="#5ab4e8"
              strokeWidth="1.2" opacity="0.4"
              className={`ocean-bubble ocean-bubble-${(i%3)+1}`}/>
          ))}

          {/* Mobile seaweed — drawn BEFORE floor base so roots are buried */}
          {([
            [60, 748], [150, 768], [240, 754], [330, 774],
          ] as [number,number][]).map(([x, top], i) => {
            const root = 856
            const h    = root - top
            const m1   = root - h * 0.32
            const m2   = root - h * 0.66
            return (
              <g key={i} className={`ocean-seaweed ocean-seaweed-${(i % 2) + 1}`}>
                <path d={`M${x} ${root} Q${x-16} ${m1} ${x} ${(m1+m2)/2} Q${x+16} ${m2} ${x} ${top}`}
                  stroke="#187228" strokeWidth="5" fill="none" strokeLinecap="round"/>
                <path d={`M${x} ${root} Q${x+13} ${root-h*0.4} ${x+5} ${root-h*0.62}`}
                  stroke="#269834" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
              </g>
            )
          })}

          {/* Mobile floor base — drawn AFTER seaweed to bury the roots */}
          <rect x="0" y="838" width="400" height="22" fill="#0a1810"/>

          {/* Mobile starfish */}
          <g transform="translate(114,834) rotate(18)">
            <polygon points="0,-16 3.5,-5.5 14.4,-4.8 5.6,1.6 8.8,12.8 0,6.4 -8.8,12.8 -5.6,1.6 -14.4,-4.8 -3.5,-5.5"
              fill="#d03a18" stroke="#ee5830" strokeWidth="1"/>
            <circle cx="0" cy="0" r="4" fill="#b02810"/>
          </g>
          <g transform="translate(295,840) rotate(-20)">
            <polygon points="0,-14 3.1,-4.8 12.6,-4.2 4.9,1.4 7.7,11.2 0,5.6 -7.7,11.2 -4.9,1.4 -12.6,-4.2 -3.1,-4.8"
              fill="#7a2890" stroke="#9a44b0" strokeWidth="1"/>
            <circle cx="0" cy="0" r="3.2" fill="#5a1870"/>
          </g>

          {/* Mobile ocean floor rocks */}
          <ellipse cx="100" cy="858" rx="90"  ry="14" fill="#1a3024"/>
          <ellipse cx="290" cy="860" rx="120" ry="16" fill="#182c20"/>
          <ellipse cx="370" cy="858" rx="50"  ry="12" fill="#1a3024"/>

          {/* MOBILE SHELLS */}
          {/* Conch shell */}
          <g transform="translate(70,836) rotate(-15)">
            <ellipse cx="0" cy="-2" rx="10" ry="7" fill="#c89858" stroke="#886028" strokeWidth="0.9"/>
            <ellipse cx="2" cy="-2" rx="5" ry="3.5" fill="#dab870" stroke="#886028" strokeWidth="0.6"/>
            <circle cx="4" cy="-3" r="2" fill="#a07030"/>
            <path d="M7,-7 Q9,-13 7,-16" stroke="#906028" strokeWidth="2" fill="none" strokeLinecap="round"/>
            <path d="M-10,-2 Q-12,3 -7,6 Q-2,8 2,5" fill="#e8c080" stroke="#886028" strokeWidth="0.7"/>
          </g>
          {/* Clam shell */}
          <g transform="translate(200,834) rotate(6)">
            <path d="M-11,3 Q0,11 11,3" fill="#d4b070" stroke="#a07840" strokeWidth="0.8"/>
            <path d="M-11,3 Q-12,-7 0,-9 Q12,-7 11,3" fill="#e8c888" stroke="#a07840" strokeWidth="0.8"/>
            <line x1="0" y1="-9" x2="0" y2="8" stroke="#a07840" strokeWidth="0.5" opacity="0.5"/>
            <line x1="0" y1="-9" x2="-7" y2="7" stroke="#a07840" strokeWidth="0.4" opacity="0.4"/>
            <line x1="0" y1="-9" x2="7" y2="7" stroke="#a07840" strokeWidth="0.4" opacity="0.4"/>
            <circle cx="0" cy="-9" r="1.5" fill="#907030"/>
          </g>
          {/* Small spiral shell */}
          <g transform="translate(325,838) rotate(22)">
            <ellipse cx="0" cy="0" rx="7" ry="5" fill="#b89858" stroke="#806030" strokeWidth="0.7"/>
            <ellipse cx="1" cy="0" rx="4" ry="2.5" fill="#ccaa60" stroke="#806030" strokeWidth="0.5"/>
            <circle cx="3" cy="-1" r="1.4" fill="#906828"/>
            <path d="M5,-2 Q7,-7 6,-10" stroke="#806030" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          </g>

          {/* MOBILE SNAIL — walks right→left, head leads (left), shell trails (right) */}
          <g className="ocean-snail-1m">
            {/* Shell (right side) */}
            <ellipse cx="0" cy="836" rx="10" ry="7" fill="#c89858" stroke="#886028" strokeWidth="0.9"/>
            <ellipse cx="1" cy="836" rx="5.5" ry="4" fill="#dab870" stroke="#886028" strokeWidth="0.6"/>
            <circle cx="4" cy="835" r="2" fill="#a07030"/>
            {/* Spire */}
            <path d="M6,830 Q9,825 7,821" stroke="#906028" strokeWidth="2" fill="none" strokeLinecap="round"/>
            {/* Lip (opens to the left toward body) */}
            <path d="M-10,836 Q-12,841 -7,844 Q-2,846 2,843" fill="#e8c080" stroke="#886028" strokeWidth="0.7"/>
            {/* Body (left side — leads the way) */}
            <g className="ocean-snail-1m__body">
              <path d="M-2,843 Q-15,847 -32,845 Q-36,845 -38,843 Q-36,841 -32,841 Q-15,843 -2,843Z"
                fill="#7a9848" stroke="#4a6828" strokeWidth="0.6"/>
              <ellipse cx="-33" cy="840" rx="6" ry="4" fill="#8aaa50" stroke="#4a6828" strokeWidth="0.7"/>
              <path d="M-36,838 Q-38,833 -38,830" stroke="#4a6828" strokeWidth="1.1" fill="none" strokeLinecap="round"/>
              <circle cx="-38" cy="829" r="1.8" fill="#1a1010"/>
              <path d="M-31,837 Q-31,832 -30,829" stroke="#4a6828" strokeWidth="1.1" fill="none" strokeLinecap="round"/>
              <circle cx="-30" cy="828" r="1.8" fill="#1a1010"/>
            </g>
          </g>
        </svg>

      </div>
      <div className="statki-content">
        <Outlet />
      </div>
    </div>
  )
}
