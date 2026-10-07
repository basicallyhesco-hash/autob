import React, { useState, useRef, useEffect } from 'react';
import { structures, systems } from './data';

const bodyPath =
  'M357 147 C332 136 325 118 328 89 C329 57 350 42 380 42 C410 42 431 57 432 89 C435 118 428 136 403 147 L404 177 C413 190 450 195 473 207 C496 220 505 249 516 285 L540 367 L562 436 C568 449 580 468 579 480 C580 490 574 490 568 480 L558 466 C565 491 566 515 560 518 C554 519 552 499 548 488 C552 514 549 529 544 526 L537 491 C540 516 536 526 531 521 L525 486 C525 505 521 510 517 503 L511 466 C507 451 508 439 510 429 L488 373 L459 298 C459 337 445 370 447 408 C449 444 466 480 460 523 L452 566 C452 600 444 647 436 681 C435 706 445 741 434 787 L426 841 C428 854 444 866 447 876 C446 887 423 892 409 882 C398 872 396 854 398 839 L396 778 C394 747 397 717 391 686 L380 588 L369 686 C363 717 366 747 364 778 L362 839 C364 854 362 872 351 882 C337 892 314 887 313 876 C316 866 332 854 334 841 L326 787 C315 741 325 706 324 681 C316 647 308 600 308 566 L300 523 C294 480 311 444 313 408 C315 370 301 337 301 298 L272 373 L250 429 C252 439 253 451 249 466 L243 503 C239 510 235 505 235 486 L229 521 C224 526 220 516 223 491 L216 526 C211 529 208 514 212 488 C208 499 206 519 200 518 C194 515 195 491 202 466 L192 480 C186 490 180 490 181 480 C180 468 192 449 198 436 L220 367 L244 285 C255 249 264 220 287 207 C310 195 347 190 356 177 Z';
const paths = {
  'upper-limb-arteries':
    'M385 263 L344 221 L297 231 Q280 250 269 291 L246 366 L225 428 L220 466 M395 259 L452 219 Q477 229 491 287 L514 365 L536 430 L542 465 M246 366 L234 410 L232 463 M514 365 L526 410 L528 463',
  'upper-limb-veins':
    'M302 237 Q286 260 280 296 L257 368 L236 435 L232 473 M459 235 Q474 255 480 296 L503 368 L524 435 L528 473 M257 368 L245 413 L244 466 M503 368 L515 413 L516 466',
  vagus:
    'M369 133 L369 177 Q357 222 366 248 L365 281 Q354 311 362 334 L373 366 L388 389 M391 133 L391 174 Q410 218 413 251 L416 285 Q405 315 403 338 L399 365 L407 393 M366 277L340 289 M413 277L438 291 M366 307L385 316 M399 365L416 378',
  aorta:
    'M386 315 C406 305 414 282 401 264 C387 245 369 269 382 289 L399 335 L399 497 Q399 529 407 550 L425 570 M399 515 L354 555 M384 264 L362 214 M394 260 L403 213',
  carotid: 'M362 216 L360 175 L359 130 M403 216 L405 172 L402 130',
  'pulmonary-artery':
    'M376 307 L369 282 Q369 266 385 261 M373 270 Q344 253 326 277 M377 267 Q412 246 435 269',
  'renal-arteries': 'M399 435 L349 439 M399 430 L419 431',
  'femoral-arteries':
    'M354 551 C340 597 344 638 348 685 L345 743 L348 834 M425 564 C427 607 417 645 412 685 L415 744 L412 835 M348 683 L334 729 M412 683 L428 731',
  'vena-cava':
    'M361 220 L361 289 Q367 302 371 307 M361 317 L361 507 Q361 532 351 551 M361 520 L416 557 M361 230 L299 237 M361 230 L459 235 M361 435 L342 441 M361 428 L425 435',
  jugular: 'M350 133 L348 174 L350 221 M417 133 L418 174 L414 222 L363 239',
  'pulmonary-veins':
    'M331 298 Q348 311 384 298 M430 298 Q412 315 392 303 M332 315 L383 314 M430 316 L397 315',
  'femoral-veins':
    'M351 551 C332 592 333 640 335 686 L334 739 L337 833 M416 557 C439 600 428 650 425 686 L426 741 L423 834',
  'spinal-cord':
    'M380 131 L380 401 M380 401 L365 500 M380 401 L374 510 M380 401 L386 510 M380 401 L396 500',
  'brachial-plexus':
    'M380 188 Q350 214 306 218 L279 243 L258 310 L235 382 L219 450 M380 194 Q413 218 454 218 L481 243 L502 310 L525 382 L541 450 M309 218 L302 243 L278 285 M451 218 L458 243 L482 285',
  sciatic:
    'M377 490 L340 550 Q317 598 336 676 L337 762 L341 835 M383 490 L420 550 Q443 598 424 676 L423 762 L419 835 M336 676 L354 718 L354 814 M424 676 L406 718 L406 814',
  'cervical-nodes': 'M343 147 L341 168 L346 192 L353 210 M418 147 L421 168 L417 192 L408 209',
  'axillary-nodes':
    'M344 212 L291 245 L276 272 L252 334 L221 429 M410 213 L469 245 L484 272 L508 334 L539 429',
  'thoracic-duct':
    'M386 475 Q413 450 405 403 L405 334 Q397 277 408 224 Q415 210 424 211 M386 475 L340 554 M386 475 L420 554',
  'inguinal-nodes':
    'M330 555 L325 590 L323 664 L330 747 L335 833 M430 555 L435 590 L437 664 L430 747 L425 833',
};
const lymphPoints = {
  'cervical-nodes': [
    [343, 151],
    [341, 168],
    [344, 185],
    [349, 201],
    [418, 151],
    [421, 168],
    [419, 185],
    [413, 201],
  ],
  'axillary-nodes': [
    [287, 251],
    [281, 261],
    [277, 276],
    [291, 266],
    [473, 251],
    [479, 261],
    [483, 276],
    [469, 266],
  ],
  'thoracic-duct': [
    [386, 470],
    [390, 451],
    [404, 414],
  ],
  'inguinal-nodes': [
    [329, 555],
    [339, 551],
    [348, 549],
    [325, 567],
    [431, 555],
    [421, 551],
    [412, 549],
    [435, 567],
  ],
};
export function Organ({ id }) {
  switch (id) {
    case 'brain':
      return (
        <>
          <path
            d="M-3-35 C-18-43-32-29-33-20 C-48-15-46 3-40 10 C-43 26-28 33-16 30 C-8 39 4 38 9 29 C25 34 40 22 39 12 C49-1 40-18 31-21 C27-37 10-40 1-34Z"
            fill="url(#brainFill)"
          />
          <path
            d="M0-32 Q-7-18 1-6 Q-6 10 0 31 M-25-24 Q-11-28-17-12 Q-37-17-33-1 Q-16-6-16 8 Q-33 5-30 19 M-9-25 Q2-15-10-6 M-9 15 Q-17 23-11 29 M20-25 Q6-21 18-9 Q36-16 32-1 Q18-4 18 9 Q34 5 29 22 M10 9 Q2 17 12 27"
            fill="none"
            stroke="#b97972"
            strokeWidth="2"
          />
        </>
      );
    case 'thyroid':
      return (
        <path
          d="M-3-3 C-14-26-23-12-18 7 Q-13 26-3 9 L4 9 Q16 25 21 5 C25-15 13-23 4-3Z"
          fill="#bd7971"
        />
      );
    case 'right-lung':
      return (
        <>
          <path
            d="M18-52 C2-64-14-28-24-5 C-31 14-33 42-24 57 Q-7 67 26 54 L27 8 Q18-11 22-25Z"
            fill="url(#lungFill)"
          />
          <path
            d="M-26 19 Q-2 8 24 24 M-20 36 L23 29"
            fill="none"
            stroke="#ac7b75"
            strokeWidth="1.3"
          />
          <path
            d="M19-23 L6 7 L-12 27 M6 7 L18 31 M6 7 L-9-5"
            fill="none"
            stroke="#dfb2a5"
            strokeWidth="3"
          />
        </>
      );
    case 'left-lung':
      return (
        <>
          <path
            d="M-21-48 C-9-66 9-37 20-10 C30 13 36 40 28 54 Q16 63-5 54 L-21 36 Q-1 18-20 8Z"
            fill="url(#lungFill)"
          />
          <path d="M-7 39 Q9 16 27 15" fill="none" stroke="#ac7b75" strokeWidth="1.3" />
          <path d="M-15-25 L1 3 L16 28 M1 3 L17-5" fill="none" stroke="#dfb2a5" strokeWidth="3" />
        </>
      );
    case 'heart':
      return (
        <>
          <path
            d="M-13-22 L-16-39 L-7-41 L0-20 L5-37 L15-34 L12-17 C32-18 33 5 22 23 L7 45 C-9 36-30 20-30 2 C-32-13-22-24-13-22Z"
            fill="url(#heartFill)"
          />
          <path
            d="M-9-20 Q2-2-6 15 L8 40 M-7 5 L-21 10 M-4 18 L16 13 M-1-4 L17-8"
            stroke="#f4b6a1"
            strokeWidth="2"
            fill="none"
          />
          <path d="M-11-28 Q-4-49 12-45 L23-36 L19-26 Q8-38 3-27" fill="#b54f4c" />
        </>
      );
    case 'liver':
      return (
        <>
          <path
            d="M-38-19 Q-6-31 27-16 L65-10 Q46 13 19 13 Q-9 32-39 21 C-48 14-45-9-38-19Z"
            fill="url(#liverFill)"
          />
          <path d="M25-15 L18 10" stroke="#b58166" strokeWidth="1.5" />
        </>
      );
    case 'stomach':
      return (
        <>
          <path
            d="M-7-31 L1-32 L4-15 C23-35 39-4 23 16 C14 32-5 30-16 19 L-26 21 L-29 10 C-15 1-3 12 1 7 C9-3-8-12-7-31Z"
            fill="url(#stomachFill)"
          />
          <path
            d="M10-11 Q25-2 13 14 Q5 21-7 14 M14-17 Q33-1 21 12"
            fill="none"
            stroke="#c7877b"
            strokeWidth="1.3"
          />
        </>
      );
    case 'spleen':
      return (
        <path d="M1-24 C22-16 21 11 5 25 C-8 32-15 15-10 3 C-4-7-13-20 1-24Z" fill="#916c7f" />
      );
    case 'gallbladder':
      return (
        <>
          <path d="M-3-9 C-22-3-13 20-3 13 Q8 5 2-7 L8-18" fill="#8da471" />
          <path d="M4-8 L13-23" fill="none" stroke="#8da471" strokeWidth="3" />
        </>
      );
    case 'pancreas':
      return (
        <path
          d="M-37-6 Q-23-19-10-6 Q0-14 9-6 Q17-14 26-7 L43-6 L23 4 L1 8 Q-12 13-25 8 C-40 18-44 0-37-6Z"
          fill="#d4a467"
        />
      );
    case 'right-kidney':
      return (
        <>
          <path
            d="M-2-25 C-23-23-24 16-9 26 C6 33 18 14 8 8 Q-3 0 8-9 C18-21 8-30-2-25Z"
            fill="url(#kidneyFill)"
          />
          <path d="M8 9 Q16 29 22 58 L40 92" fill="none" stroke="#d5b67b" strokeWidth="2" />
        </>
      );
    case 'left-kidney':
      return (
        <>
          <path
            d="M2-25 C23-23 24 16 9 26 C-6 33-18 14-8 8 Q3 0-8-9 C-18-21-8-30 2-25Z"
            fill="url(#kidneyFill)"
          />
          <path d="M-8 9 Q-16 29-22 58 L-41 100" fill="none" stroke="#d5b67b" strokeWidth="2" />
        </>
      );
    case 'large-intestine':
      return (
        <>
          <path
            d="M-34 29 L-44 17 L-45-25 Q-44-43-23-37 Q-2-44 20-36 Q44-44 45-25 L45 21 Q42 38 26 37 L8 39 L5 58"
            fill="none"
            stroke="#b48a74"
            strokeWidth="15"
            strokeLinecap="round"
          />
          <path
            d="M-34 29 L-44 17 L-45-25 Q-44-43-23-37 Q-2-44 20-36 Q44-44 45-25 L45 21 Q42 38 26 37 L8 39 L5 58"
            fill="none"
            stroke="#d4ad94"
            strokeWidth="10"
            strokeDasharray="8 3"
            strokeLinecap="round"
          />
        </>
      );
    case 'small-intestine':
      return (
        <>
          <path
            d="M-25-23 Q-6-32 24-21 Q37-7 23-4 L-20-6 Q-33 3-19 8 L21 9 Q34 17 17 23 L-20 23 Q-30 31-9 33 L18 32"
            fill="none"
            stroke="#b8866f"
            strokeWidth="9"
            strokeLinecap="round"
          />
          <path
            d="M-25-23 Q-6-32 24-21 Q37-7 23-4 L-20-6 Q-33 3-19 8 L21 9 Q34 17 17 23 L-20 23 Q-30 31-9 33 L18 32"
            fill="none"
            stroke="#ddb09a"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </>
      );
    case 'bladder':
      return (
        <>
          <path
            d="M-20-14 Q0-25 20-14 Q30-1 18 13 L5 21 L4 32 L-4 32 L-5 21 Q-30 5-20-14Z"
            fill="#c5a783"
          />
          <path d="M-14-10 Q0-18 14-10" stroke="#ebd7b8" fill="none" strokeWidth="2" />
        </>
      );
    default:
      return null;
  }
}
function interactive(s, onSelect) {
  return {
    role: 'button',
    tabIndex: 0,
    'aria-label': `Explore ${s.name}`,
    onClick: () => onSelect(s.id),
    onKeyDown: (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onSelect(s.id);
      }
    },
  };
}
function Definitions() {
  return (
    <defs>
      <linearGradient id="bodyFill" x1="0" x2="1">
        <stop stopColor="#e5e5de" />
        <stop offset=".35" stopColor="#f1eee6" />
        <stop offset=".65" stopColor="#f6f2e9" />
        <stop offset="1" stopColor="#dedfd7" />
      </linearGradient>
      <linearGradient id="brainFill" x2=".8" y2="1">
        <stop stopColor="#dfb9ac" />
        <stop offset="1" stopColor="#c99185" />
      </linearGradient>
      <linearGradient id="lungFill" x2="1" y2="1">
        <stop stopColor="#d6aaa2" />
        <stop offset="1" stopColor="#b57d79" />
      </linearGradient>
      <linearGradient id="heartFill" x2="1" y2="1">
        <stop stopColor="#d97866" />
        <stop offset="1" stopColor="#a74443" />
      </linearGradient>
      <linearGradient id="liverFill" x2="1" y2="1">
        <stop stopColor="#bc8169" />
        <stop offset="1" stopColor="#95664f" />
      </linearGradient>
      <linearGradient id="stomachFill" x2="1" y2="1">
        <stop stopColor="#e4b2a0" />
        <stop offset="1" stopColor="#cc9483" />
      </linearGradient>
      <linearGradient id="kidneyFill" x2="1" y2="1">
        <stop stopColor="#b66f66" />
        <stop offset="1" stopColor="#944e4b" />
      </linearGradient>
      <filter id="organShadow" x="-70%" y="-70%" width="240%" height="240%">
        <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#705d50" floodOpacity=".16" />
      </filter>
      <filter id="selectionGlow" x="-80%" y="-80%" width="260%" height="260%">
        <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#2b8472" floodOpacity=".55" />
      </filter>
      <pattern
        id="cityGrid"
        width="30"
        height="18"
        patternUnits="userSpaceOnUse"
        patternTransform="rotate(-8)"
      >
        <path d="M0 0H30V18" fill="none" stroke="#c5d3c4" strokeWidth=".65" />
      </pattern>
    </defs>
  );
}
const cityY = (y) => (y < 530 ? y * 0.96 : y + 100);
const cityOffsets = {
  'right-lung': [-7, -12],
  'left-lung': [16, -12],
  heart: [0, 5],
  liver: [-15, -4],
  stomach: [10, -1],
  pancreas: [-5, 16],
  spleen: [25, 9],
  gallbladder: [-4, 15],
  'right-kidney': [-30, 14],
  'left-kidney': [35, 13],
  'large-intestine': [-30, 38],
  'small-intestine': [20, -3],
};
function cityPos(s) {
  const offset = cityOffsets[s.id] || [0, 0];
  return [s.x + offset[0], cityY(s.y) + offset[1]];
}
function Building({ s, selected, onSelect, muted }) {
  const [x, y] = cityPos(s),
    w = Math.max(13, s.size * 0.78),
    h = s.id === 'brain' ? 54 : s.id === 'heart' ? 47 : s.id.includes('lung') ? 37 : 24;
  const color =
    s.id === 'heart'
      ? '#b66b56'
      : s.id.includes('lung')
        ? '#769796'
        : s.id.includes('kidney')
          ? '#9a9272'
          : s.id === 'brain'
            ? '#719687'
            : '#b59a76';
  return (
    <g
      {...interactive(s, onSelect)}
      className={`map-target building ${selected ? 'is-selected' : ''}`}
      transform={`translate(${x} ${y})`}
      opacity={muted ? 0.22 : 1}
    >
      <title>
        {s.name} · {s.city}
      </title>
      {selected && (
        <ellipse
          cy="13"
          rx={w + 16}
          ry={w * 0.5 + 10}
          fill="#2c806f18"
          stroke="#2c806f"
          strokeWidth="1.5"
          strokeDasharray="3 4"
        />
      )}
      <ellipse cy="14" rx={w + 7} ry={w * 0.5 + 4} fill="#63725b" opacity=".1" />
      <path d={`M${-w} 0 L0 ${w * 0.46} L${w} 0 L0 ${-w * 0.46} Z`} fill="#b4bfb0" />
      <path d={`M${-w} ${-h} L0 ${-h + w * 0.46} L0 ${w * 0.46} L${-w} 0 Z`} fill={color} />
      <path
        d={`M0 ${-h + w * 0.46} L${w} ${-h} L${w} 0 L0 ${w * 0.46} Z`}
        fill={color}
        style={{ filter: 'brightness(.82)' }}
      />
      <path
        d={`M${-w} ${-h} L0 ${-h - w * 0.46} L${w} ${-h} L0 ${-h + w * 0.46} Z`}
        fill={color}
        style={{ filter: 'brightness(1.2)' }}
      />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <path
            d={`M${-w + 5 + (i * (w - 7)) / 3} ${-h + 9 + ((i * (w - 7)) / 3) * 0.46} v${Math.max(8, h - 16)}`}
            stroke="#f0ecdb"
            strokeWidth="3"
            opacity=".65"
          />
          <path
            d={`M${5 + (i * (w - 7)) / 3} ${-h + w * 0.46 + 5 - ((i * (w - 7)) / 3) * 0.46} v${Math.max(8, h - 16)}`}
            stroke="#d6e3d8"
            strokeWidth="2.5"
            opacity=".5"
          />
        </g>
      ))}
      {s.id.includes('lung') && (
        <g>
          <path
            d={`M${-w * 0.42} ${-h - w * 0.14} v-17 M${w * 0.33} ${-h - w * 0.14} v-15`}
            stroke="#c9d8cb"
            strokeWidth="8"
          />
          <ellipse cx={-w * 0.42} cy={-h - w * 0.14 - 17} rx="4" ry="2" fill="#567b78" />
          <ellipse cx={w * 0.33} cy={-h - w * 0.14 - 15} rx="4" ry="2" fill="#567b78" />
          <path d={`M${w} -8q10 3 11 13`} fill="none" stroke="#8ca79c" strokeWidth="4" />
        </g>
      )}
      {s.id.includes('kidney') && (
        <g>
          <path d={`M-8 ${-h - 6}v10q7 5 14 0v-10`} fill="#cdd5c1" />
          <ellipse
            cx="-1"
            cy={-h - 6}
            rx="7"
            ry="3.5"
            fill="#e3e6d2"
            stroke="#b7bea7"
            strokeWidth=".6"
          />
          <path d={`M${w} 1h9v8`} fill="none" stroke="#a4ad99" strokeWidth="3" />
        </g>
      )}
      {s.id === 'liver' && (
        <g>
          <path
            d={`M${-w + 4} ${-h - 1}L0 ${-h - w * 0.46 - 7}L${w - 4} ${-h - 1}L0 ${-h + w * 0.46 - 6}Z`}
            fill="#c4ad82"
            stroke="#a28b65"
            strokeWidth=".6"
          />
          {[0, 1, 2].map((i) => (
            <path
              key={i}
              d={`M${-w + 10 + i * 9} ${-h + 2 + i * 3}L${i * 9} ${-h - 10 + i * 3}`}
              stroke="#e1d1ab"
              strokeWidth="2"
            />
          ))}
        </g>
      )}
      {s.id === 'small-intestine' && (
        <g>
          {[-1, 0, 1].map((i) => (
            <g key={i} transform={`translate(${i * 12} ${12 - Math.abs(i) * 4})`}>
              <path d="M-6-8L0-11L6-8V2L0 5L-6 2Z" fill="#cab388" />
              <path d="M-8-8L0-12L8-8L0-4Z" fill={i === 0 ? '#b78564' : '#d5c69f'} />
              <path d="M-3-7L3-10M2-5L7-8" stroke="#f4edd6" strokeWidth="2" />
            </g>
          ))}
        </g>
      )}
      {s.id === 'bladder' && (
        <g>
          <path d={`M${-w + 4} ${-h}v8q${w - 4} 11 ${2 * w - 8} 0v-8`} fill="#b8b996" />
          <ellipse cy={-h} rx={w - 4} ry="8" fill="#d9e0cb" stroke="#b9c4a8" />
          <ellipse cy={-h} rx={w - 9} ry="5" fill="#9ebbb5" />
        </g>
      )}
      {s.id === 'heart' && (
        <g>
          <path d={`M${-w} -9h-10v10M${w} -9h9v-15`} fill="none" stroke="#c4876d" strokeWidth="5" />
          <path d={`M-7 ${-h - 3}v-13M5 ${-h - 3}v-18`} stroke="#b7775c" strokeWidth="6" />
        </g>
      )}
      {s.id === 'brain' && (
        <>
          <path d="M-13-60 L0-67 L13-60 L0-53Z" fill="#d8e2d4" />
          <path d="M0-67V-81" stroke="#426c5c" strokeWidth="2" />
          <path d="M1-81H15L10-73H1" fill="#3b8270" />
        </>
      )}
      {s.id === 'heart' && (
        <g transform="translate(0 -50)">
          <path
            d="M-6-3 C-12-10-19-2-11 4 L0 13 L11 4 C19-2 12-10 6-3 L0 3Z"
            fill="#f3e8da"
            transform="scale(.6)"
          />
        </g>
      )}
    </g>
  );
}
function CityBase() {
  return (
    <g>
      <path
        d="M356 37 L402 37 L439 78 L427 143 L427 169 L490 197 L543 300 L566 452 L522 474 L472 340 L480 488 L439 553 L321 553 L280 488 L289 340 L238 474 L194 452 L217 300 L270 197 L332 169 L332 143 L320 78Z"
        fill="#d8dfcf"
        stroke="#bbc8b5"
        strokeWidth="1.5"
      />
      <path
        d="M356 28 L402 28 L439 69 L427 134 L427 160 L490 188 L543 291 L566 443 L522 465 L472 331 L480 479 L439 544 L321 544 L280 479 L289 331 L238 465 L194 443 L217 291 L270 188 L332 160 L332 134 L320 69Z"
        fill="#e8ebdd"
        stroke="#ccd5c1"
      />
      <path
        d="M356 28 L402 28 L439 69 L427 134 L427 160 L490 188 L543 291 L566 443 L522 465 L472 331 L480 479 L439 544 L321 544 L280 479 L289 331 L238 465 L194 443 L217 291 L270 188 L332 160 L332 134 L320 69Z"
        fill="url(#cityGrid)"
        opacity=".75"
      />
      <path
        d="M320 635 L440 635 L461 703 L442 809 L450 937 L401 958 L380 797 L359 958 L310 937 L318 809 L299 703Z"
        fill="#d8dfcf"
        stroke="#bbc8b5"
      />
      <path
        d="M320 626 L440 626 L461 694 L442 800 L450 928 L401 949 L380 788 L359 949 L310 928 L318 800 L299 694Z"
        fill="#e8ebdd"
        stroke="#ccd5c1"
      />
      <path
        d="M320 626 L440 626 L461 694 L442 800 L450 928 L401 949 L380 788 L359 949 L310 928 L318 800 L299 694Z"
        fill="url(#cityGrid)"
      />
      <path
        d="M200 576 Q296 558 377 585 T560 572"
        fill="none"
        stroke="#c7dddb"
        strokeWidth="20"
        opacity=".5"
      />
      <path d="M348 532 L409 532 L418 639 L341 639Z" fill="#d4d7c8" stroke="#acb6a6" />
      <path d="M354 534 L348 636 M403 534 L411 636" stroke="#faf9ee" strokeWidth="4" />
      {[548, 569, 590, 611, 632].map((y) => (
        <path key={y} d={`M349 ${y} H412`} stroke="#acb6a6" strokeWidth="1" />
      ))}
      <path d="M380 536 L380 636" stroke="#f6f3de" strokeWidth="2" strokeDasharray="6 5" />
      {[
        [289, 197],
        [299, 190],
        [461, 194],
        [470, 201],
        [289, 326],
        [473, 324],
        [285, 474],
        [301, 514],
        [468, 477],
        [449, 526],
        [315, 690],
        [447, 686],
        [325, 790],
        [436, 789],
        [414, 908],
        [343, 908],
      ].map(([x, y], i) => (
        <g key={i}>
          <path d={`M${x} ${y}v9`} stroke="#879b72" strokeWidth="2" />
          <ellipse cx={x} cy={y - 3} rx="5" ry="8" fill={i % 2 ? '#96b28b' : '#afc39a'} />
        </g>
      ))}
      <g className="district-label">
        <text x="120" y="110">
          01
        </text>
        <text x="120" y="130">
          UPPER CITY
        </text>
        <path d="M120 141H210" stroke="#b8c4b5" />
        <text x="120" y="155" className="district-detail">
          Head · thorax · abdomen
        </text>
        <text x="496" y="747">
          02
        </text>
        <text x="496" y="767">
          LOWER CITY
        </text>
        <path d="M496 778H601" stroke="#b8c4b5" />
        <text x="496" y="792" className="district-detail">
          Pelvis · lower limbs
        </text>
      </g>
      <g className="bridge-label">
        <path d="M420 584H490" stroke="#8ca091" strokeDasharray="3 3" />
        <text x="499" y="582">
          THE CONNECTING BRIDGE
        </text>
        <text x="499" y="598">
          Symbolic · not an anatomical structure
        </text>
      </g>
    </g>
  );
}
export default function Atlas({ view, layers, selected, onSelect, labels, region, zoom }) {
  const isCity = view === 'city',
    selectedS = structures.find((s) => s.id === selected);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const drag = useRef(null),
    didDrag = useRef(false);
  useEffect(() => {
    setPan({ x: 0, y: 0 });
  }, [view, zoom === 1]);
  function pointerDown(e) {
    if (zoom <= 1) return;
    drag.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y };
    didDrag.current = false;
  }
  function pointerMove(e) {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x,
      dy = e.clientY - drag.current.y;
    if (Math.abs(dx) + Math.abs(dy) < 4 && !didDrag.current) return;
    didDrag.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    const scale = (isCity ? 995 : 900) / e.currentTarget.getBoundingClientRect().height;
    setPan({
      x: Math.max(-220, Math.min(220, drag.current.px + dx * scale)),
      y: Math.max(-390, Math.min(390, drag.current.py + dy * scale)),
    });
  }
  function pointerUp() {
    drag.current = null;
  }
  const enabled = (s) => layers[s.system];
  const mute = (s) => region !== 'all' && s.region !== region;
  const labelIds = structures.filter((s) => s.system === 'organs').map((s) => s.id);
  const labelTargets = [...new Set([...labelIds, selected])]
    .map((id) => structures.find((s) => s.id === id))
    .filter((s) => enabled(s) && !mute(s));
  const leftLabels = [
    'brain',
    'right-lung',
    'liver',
    'gallbladder',
    'right-kidney',
    'small-intestine',
    'large-intestine',
  ];
  const labelPositions = {};
  [true, false].forEach((left) => {
    let prev = -100;
    labelTargets
      .filter((s) => leftLabels.includes(s.id) === left)
      .sort((a, b) => (isCity ? cityPos(a)[1] : a.y) - (isCity ? cityPos(b)[1] : b.y))
      .forEach((s) => {
        const y = isCity ? cityPos(s)[1] : s.y;
        const ly = Math.max(y, prev + 25);
        labelPositions[s.id] = ly;
        prev = ly;
      });
  });
  return (
    <svg
      onPointerDown={pointerDown}
      onPointerMove={pointerMove}
      onPointerUp={pointerUp}
      onPointerCancel={pointerUp}
      onClickCapture={(e) => {
        if (didDrag.current) {
          e.stopPropagation();
          didDrag.current = false;
        }
      }}
      style={{ touchAction: zoom > 1 ? 'none' : 'pan-y', cursor: zoom > 1 ? 'grab' : undefined }}
      className={`atlas-svg ${isCity ? 'city-svg' : ''}`}
      viewBox={isCity ? '80 0 610 995' : '90 20 580 900'}
      aria-label={
        isCity
          ? 'Human body as a city: interactive schematic map'
          : 'Interactive human anatomy, anterior schematic view'
      }
    >
      <Definitions />
      <g
        transform={`translate(${pan.x} ${pan.y}) translate(380 ${isCity ? 440 : 435}) scale(${zoom}) translate(-380 ${isCity ? -440 : -435})`}
      >
        {isCity ? (
          <CityBase />
        ) : (
          <g className="body-base">
            <ellipse cx="380" cy="891" rx="86" ry="9" fill="#879385" opacity=".075" />
            <path d={bodyPath} fill="url(#bodyFill)" stroke="#c5c8bb" strokeWidth="1.2" />
            <path
              d="M364 151 Q380 157 398 151 M360 163 Q380 168 399 163 M352 190 L317 210 L288 222 M408 190 L443 210 L472 222 M380 200V537 M323 533 Q350 543 366 570 M437 533 Q410 543 394 570 M312 485 Q329 514 346 519 M448 485 Q431 514 414 519 M331 679 Q345 692 361 679 M399 679 Q415 692 429 679"
              fill="none"
              stroke="#c4c7b9"
              strokeWidth="1.5"
              opacity=".65"
            />
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <path
                key={i}
                d={`M380 ${222 + i * 16} Q339 ${203 + i * 16} 309 ${229 + i * 16} M380 ${222 + i * 16} Q421 ${203 + i * 16} 451 ${229 + i * 16}`}
                stroke="#fbf8f0"
                strokeWidth="5"
                fill="none"
                opacity=".65"
              />
            ))}
            <path
              d="M380 204V262 M378 245 L349 265 M382 245 L415 265"
              fill="none"
              stroke="#b5b6a5"
              strokeWidth="8"
            />
            <path d="M380 204V242" stroke="#e6e2d5" strokeWidth="9" strokeDasharray="2 3" />
            <path
              d="M308 350 Q375 329 452 350"
              stroke="#b7bbae"
              strokeWidth="1.5"
              fill="none"
              strokeDasharray="4 4"
            />
          </g>
        )}
        {structures
          .filter((s) => s.system !== 'organs' && enabled(s))
          .map((s) => {
            const color = systems.find((n) => n.id === s.system).color;
            // Stretch only the lower-body routes across the city’s symbolic bridge.
            const path = paths[s.id];
            return (
              <g
                key={s.id}
                {...interactive(s, onSelect)}
                className={`map-target network ${selected === s.id ? 'is-selected' : ''}`}
                opacity={mute(s) ? 0.13 : isCity ? 0.85 : 0.7}
              >
                <title>{s.name}</title>
                <g
                  transform={
                    isCity
                      ? s.region === 'legs' || s.id === 'inguinal-nodes'
                        ? 'translate(0 100)'
                        : 'scale(1 .96)'
                      : undefined
                  }
                >
                  {isCity && (
                    <path
                      d={path}
                      fill="none"
                      stroke="#faf9f0"
                      strokeWidth={s.system === 'arteries' || s.system === 'veins' ? 9 : 5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}
                  <path
                    d={path}
                    fill="none"
                    stroke={color}
                    strokeWidth={
                      selected === s.id
                        ? 5
                        : s.system === 'nerves'
                          ? 2
                          : s.system === 'lymph'
                            ? 1.8
                            : 3
                    }
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path d={path} fill="none" stroke="transparent" strokeWidth="13" />
                  {lymphPoints[s.id]?.map(([x, y], i) => (
                    <ellipse
                      key={i}
                      cx={x}
                      cy={y}
                      rx="4"
                      ry="5.5"
                      fill={color}
                      stroke="#eef0dd"
                      strokeWidth="1"
                    />
                  ))}
                </g>
              </g>
            );
          })}
        {!isCity &&
          structures
            .filter((s) => s.system === 'organs' && enabled(s))
            .map((s) => (
              <g
                key={s.id}
                {...interactive(s, onSelect)}
                className={`map-target organ ${selected === s.id ? 'is-selected' : ''}`}
                transform={`translate(${s.x} ${s.y})`}
                opacity={mute(s) ? 0.16 : 1}
                filter={selected === s.id ? 'url(#selectionGlow)' : 'url(#organShadow)'}
              >
                <title>{s.name}</title>
                <Organ id={s.id} />
              </g>
            ))}
        {isCity && (
          <g fill="none" strokeLinecap="round">
            {layers.arteries && (
              <>
                <path
                  d="M399 477Q399 521 390 544L392 625Q411 642 425 664 M392 625L354 651"
                  stroke="#faf9f0"
                  strokeWidth="9"
                />
                <path
                  d="M399 477Q399 521 390 544L392 625Q411 642 425 664 M392 625L354 651"
                  stroke="#c65252"
                  strokeWidth="3"
                />
              </>
            )}
            {layers.veins && (
              <path
                d="M361 477L368 544L367 625L351 651 M367 625L416 657"
                stroke="#537fb4"
                strokeWidth="3"
              />
            )}
            {layers.nerves && (
              <path
                d="M380 480L378 555L379 637L340 650 M379 637L420 650"
                stroke="#b58b37"
                strokeWidth="2"
              />
            )}
            {layers.lymph && (
              <path
                d="M386 450L382 545L383 628L330 655 M383 628L430 655"
                stroke="#6b9774"
                strokeWidth="2"
              />
            )}
          </g>
        )}
        {isCity &&
          structures
            .filter((s) => s.system === 'organs' && enabled(s))
            .map((s) => (
              <Building
                key={s.id}
                s={s}
                selected={s.id === selected}
                onSelect={onSelect}
                muted={mute(s)}
              />
            ))}
        {selectedS.system !== 'organs' && enabled(selectedS) && !mute(selectedS) && (
          <g
            pointerEvents="none"
            opacity=".9"
            transform={
              isCity
                ? selectedS.region === 'legs' || selectedS.id === 'inguinal-nodes'
                  ? 'translate(0 100)'
                  : 'scale(1 .96)'
                : undefined
            }
          >
            <path
              d={paths[selectedS.id]}
              fill="none"
              stroke={systems.find((n) => n.id === selectedS.system).color}
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        )}
        {labels &&
          labelTargets.map((s, i) => {
            const [x, y] = isCity ? cityPos(s) : [s.x, s.y];
            const left = leftLabels.includes(s.id);
            const tx = left ? 190 : 555,
              ty = labelPositions[s.id];
            const ax = left ? x - 22 : x + 22,
              end = left ? tx + 7 : tx - 7;
            return (
              <g
                key={s.id}
                {...interactive(s, onSelect)}
                className={`anatomy-label ${s.id === selected ? 'active-label' : ''}`}
              >
                <path
                  d={`M${ax} ${y} L${left ? ax - 23 : ax + 23} ${ty} H${end}`}
                  fill="none"
                  stroke={s.id === selected ? '#2d7e6a' : '#a9b5a7'}
                  strokeWidth=".9"
                />
                <circle
                  cx={ax}
                  cy={y}
                  r={s.id === selected ? 3 : 2}
                  fill={s.id === selected ? '#2d7e6a' : '#a9b5a7'}
                />
                <text x={tx} y={ty + 4} textAnchor={left ? 'end' : 'start'}>
                  {s.name.length > 22 ? (
                    <>
                      {s.name.split(' ').slice(0, -1).join(' ')}
                      <tspan x={tx} dy="13">
                        {s.name.split(' ').slice(-1)}
                      </tspan>
                    </>
                  ) : (
                    s.name
                  )}
                </text>
              </g>
            );
          })}
        {!labels && selectedS && enabled(selectedS) && (
          <g
            transform={`translate(${isCity ? cityPos(selectedS)[0] : selectedS.x} ${isCity ? cityPos(selectedS)[1] : selectedS.y})`}
            pointerEvents="none"
          >
            <circle r="42" fill="none" stroke="#267d69" strokeWidth="1.5" strokeDasharray="4 5" />
          </g>
        )}
      </g>
    </svg>
  );
}
