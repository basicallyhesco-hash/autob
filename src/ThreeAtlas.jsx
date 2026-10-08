import React, { useEffect, useRef } from 'react';
import * as T from 'three';

const V = (x, y, z = 0) => new T.Vector3((x - 380) / 53, (570 - y) / 66, z);
const mat = (color, props = {}) => new T.MeshStandardMaterial({ color, roughness: 0.52, ...props });
const palette = {
  organs: '#ce7766',
  bones: '#ded0ab',
  muscles: '#c55962',
  arteries: '#df655a',
  veins: '#6699ce',
  nerves: '#dfb65b',
  lymph: '#78b48a',
  digestive: '#d8996a',
  respiratory: '#75b5c0',
  urinary: '#9a8bbd',
  reproductive: '#ca829a',
  endocrine: '#ccab67',
  sensory: '#85abc7',
  joints: '#a4a98f',
  skin: '#d8bbaa',
  immune: '#80b18a',
};
const route = {
  arteries: [
    [
      [386, 315],
      [398, 299],
      [400, 338],
      [399, 403],
      [399, 466],
      [400, 512],
      [415, 551],
      [425, 570],
    ],
    [
      [367, 214],
      [380, 242],
      [382, 270],
      [337, 275],
      [322, 313],
      [305, 365],
      [279, 430],
    ],
    [
      [404, 213],
      [391, 244],
      [390, 271],
      [432, 275],
      [442, 312],
      [460, 365],
      [483, 430],
    ],
    [
      [399, 438],
      [348, 439],
    ],
    [
      [399, 438],
      [425, 439],
    ],
    [
      [369, 552],
      [350, 554],
      [345, 630],
      [348, 692],
      [345, 839],
    ],
    [
      [414, 552],
      [425, 626],
      [418, 698],
      [416, 762],
      [414, 839],
    ],
  ],
  veins: [
    [
      [359, 136],
      [361, 195],
      [362, 260],
      [361, 327],
      [360, 395],
      [362, 455],
      [361, 507],
      [353, 553],
    ],
    [
      [353, 553],
      [344, 624],
      [346, 695],
      [344, 761],
      [343, 839],
    ],
    [
      [410, 553],
      [422, 621],
      [418, 695],
      [417, 761],
      [414, 839],
    ],
    [
      [346, 235],
      [316, 273],
      [305, 326],
      [284, 380],
      [267, 430],
    ],
    [
      [414, 235],
      [444, 273],
      [455, 326],
      [476, 380],
      [493, 430],
    ],
  ],
  nerves: [
    [
      [380, 131],
      [380, 181],
      [380, 234],
      [380, 286],
      [380, 345],
      [380, 404],
    ],
    [
      [380, 204],
      [342, 228],
      [307, 267],
      [278, 345],
      [251, 413],
      [223, 460],
    ],
    [
      [380, 204],
      [418, 228],
      [453, 267],
      [482, 345],
      [509, 413],
      [537, 460],
    ],
    [
      [380, 405],
      [352, 474],
      [340, 546],
      [338, 627],
      [340, 697],
      [340, 838],
    ],
    [
      [380, 405],
      [408, 474],
      [420, 546],
      [422, 627],
      [420, 697],
      [420, 838],
    ],
  ],
  lymph: [
    [
      [407, 214],
      [407, 264],
      [404, 314],
      [402, 365],
      [397, 415],
      [387, 464],
      [376, 508],
      [357, 550],
      [341, 572],
      [338, 650],
      [341, 725],
      [341, 838],
    ],
    [
      [380, 463],
      [355, 478],
      [329, 462],
      [303, 435],
    ],
    [
      [381, 463],
      [405, 478],
      [431, 462],
      [457, 435],
    ],
    [
      [355, 550],
      [326, 560],
      [315, 603],
    ],
    [
      [404, 550],
      [433, 560],
      [445, 603],
    ],
  ],
};
function tube(points, radius, color) {
  const c = new T.CatmullRomCurve3(points.map((p) => V(p[0], p[1], p[2] || 0.9)));
  return new T.Mesh(new T.TubeGeometry(c, 32, radius, 7, false), mat(color));
}
function ball(g, name, x, y, z, sx, sy, sz, color, id) {
  const m = new T.Mesh(new T.SphereGeometry(1, 24, 18), mat(color, { roughness: 0.49 }));
  m.position.set(x, y, z);
  m.scale.set(sx, sy, sz);
  m.castShadow = true;
  m.receiveShadow = true;
  m.userData.id = id;
  m.userData.name = name;
  g.add(m);
  return m;
}
function makeOrgan(s, g) {
  const pos = V(s.x, s.y, 1.15),
    x = pos.x,
    y = pos.y,
    id = s.id,
    color = palette[s.system] || palette.organs;
  if (id === 'brain') {
    ball(g, 'Right cerebral hemisphere', -0.19, 6.82, 1.08, 0.39, 0.47, 0.36, '#cb8b91', id);
    ball(g, 'Left cerebral hemisphere', 0.19, 6.82, 1.08, 0.39, 0.47, 0.36, '#cb8b91', id);
    ball(g, 'Cerebellum', 0, 6.42, 0.98, 0.25, 0.18, 0.26, '#aa7480', id);
    return;
  }
  if (id === 'heart') {
    const body = ball(g, 'Heart', x, y, 1.33, 0.35, 0.47, 0.32, '#ad454d', id);
    body.rotation.z = -0.18;
    ball(
      g,
      'Right ventricle',
      x - 0.1,
      y - 0.14,
      1.49,
      0.19,
      0.29,
      0.19,
      '#c66065',
      id,
    ).rotation.z = -0.18;
    ball(g, 'Left ventricle', x + 0.12, y - 0.16, 1.53, 0.2, 0.31, 0.18, '#8f3542', id).rotation.z =
      -0.18;
    ball(g, 'Right atrium', x - 0.14, y + 0.2, 1.51, 0.15, 0.19, 0.15, '#c66e71', id);
    ball(g, 'Left atrium', x + 0.14, y + 0.22, 1.5, 0.15, 0.18, 0.15, '#aa555c', id);
    for (const [dx, dy, dz] of [
      [-0.11, 0.3, 0.04],
      [-0.04, 0.34, 0.02],
      [0.12, 0.31, 0.05],
    ]) {
      const vessel = new T.Mesh(new T.CylinderGeometry(0.045, 0.07, 0.28, 12), mat('#b75459'));
      vessel.position.set(x + dx, y + dy, 1.34 + dz);
      vessel.rotation.z = dx * 0.9;
      vessel.userData.id = id;
      g.add(vessel);
    }
    return;
  }
  if (id === 'right-lung' || id === 'left-lung') {
    const right = id === 'right-lung',
      side = right ? -1 : 1;
    ball(g, s.name, x, y, 1.12, right ? 0.36 : 0.33, 0.76, 0.34, color, id);
    const lobes = right ? [-0.39, -0.05, 0.31] : [-0.29, 0.19];
    lobes.forEach((dy, j) => {
      const l = ball(
        g,
        'Lung lobe ' + (j + 1),
        x + side * 0.035,
        y + dy,
        1.33,
        0.3,
        0.27,
        0.22,
        j === 0 ? '#d38d91' : '#bd7b83',
        id,
      );
      l.userData.system = s.system;
    });
    const fiss = new T.Mesh(new T.TorusGeometry(0.3, 0.012, 6, 36, Math.PI * 0.92), mat('#f1c7bb'));
    fiss.position.set(x, y + 0.04, 1.5);
    fiss.rotation.z = right ? -0.62 : 0.66;
    fiss.userData.id = id;
    g.add(fiss);
    return;
  }
  if (id === 'liver') {
    const lobes = [
      [-0.22, 0.05, 0.55, 0.34],
      [-0.56, -0.04, 0.23, 0.25],
      [0.37, 0.02, 0.27, 0.24],
    ];
    lobes.forEach(([dx, dy, sx, sy], i) => {
      const l = ball(
        g,
        'Liver lobe ' + (i + 1),
        x + dx,
        y + dy,
        1.12 - i * 0.035,
        sx,
        sy,
        0.29,
        i ? '#a7735c' : '#865c4e',
        id,
      );
      l.rotation.z = -dx * 0.24;
    });
    return;
  }
  if (/kidney/.test(id)) {
    ball(g, s.name, x, y, 1.15, 0.26, 0.42, 0.24, '#a05b5d', id);
    ball(g, 'Renal hilum', x + (x < 0 ? 0.16 : -0.16), y, 1.34, 0.07, 0.14, 0.07, '#eed2b2', id);
    return;
  }
  if (id === 'stomach') {
    ball(g, 'Stomach', x, y, 1.12, 0.39, 0.52, 0.29, '#d39d8b', id);
    return;
  }
  if (id === 'spleen') {
    ball(g, 'Spleen', x, y, 1.13, 0.17, 0.39, 0.19, '#795a76', id);
    return;
  }
  if (id === 'pancreas') {
    ball(g, 'Pancreas', x, y, 1.13, 0.58, 0.14, 0.17, '#d5ad67', id);
    return;
  }
  if (id === 'gallbladder') {
    ball(g, 'Gallbladder', x, y, 1.24, 0.1, 0.23, 0.11, '#85a274', id);
    return;
  }
  if (id === 'urinary-bladder') {
    ball(g, 'Urinary bladder', x, y, 1.13, 0.31, 0.36, 0.25, '#c4aa7e', id);
    return;
  }
  if (id === 'small-intestine' || id === 'large-intestine') {
    const arr =
      id === 'large-intestine'
        ? [
            [338, 452],
            [341, 429],
            [359, 428],
            [399, 431],
            [422, 434],
            [429, 453],
            [426, 476],
            [407, 485],
            [385, 481],
          ]
        : [
            [358, 444],
            [400, 445],
            [360, 453],
            [400, 455],
            [359, 463],
            [401, 465],
            [365, 473],
            [396, 475],
          ];
    const m = tube(arr, id === 'large-intestine' ? 0.08 : 0.052, color);
    m.userData.id = id;
    m.userData.name = s.name;
    g.add(m);
    return;
  }
  if (id === 'thyroid') {
    ball(g, s.name, x - 0.12, y, 1.15, 0.12, 0.21, 0.13, color, id);
    ball(g, s.name, x + 0.12, y, 1.15, 0.12, 0.21, 0.13, color, id);
    return;
  }
  ball(g, s.name, x, y, 1.15, 0.22, 0.3, 0.2, color, id);
}
function torso(g) {
  const ring = [
    [0.12, -0.29],
    [0.32, 0.04],
    [0.45, 0.41],
    [0.54, 0.95],
    [0.66, 1.62],
    [0.71, 2.28],
    [0.8, 2.73],
    [0.9, 3.07],
    [0.96, 3.39],
    [0.9, 3.76],
    [0.78, 4.1],
    [0.6, 4.52],
    [0.4, 4.94],
    [0.28, 5.36],
    [0.25, 5.64],
  ];
  const shell = new T.Mesh(
    new T.LatheGeometry(
      ring.map((q) => new T.Vector2(q[0], q[1])),
      64,
    ),
    mat('#b99f91', {
      transparent: true,
      opacity: 0.11,
      depthWrite: false,
      side: T.DoubleSide,
      metalness: 0.02,
    }),
  );
  shell.userData.system = 'skin';
  shell.userData.name = 'Anterior body wall';
  shell.castShadow = true;
  g.add(shell);
  const skull = ball(g, 'Head', 0, 6.84, 0, 0.47, 0.6, 0.43, '#c6a99b', null);
  skull.material = mat('#c6a99b', {
    roughness: 0.77,
    clearcoat: 0.15,
    transparent: true,
    opacity: 0.22,
    depthWrite: false,
  });
  const neck = new T.Mesh(
    new T.CylinderGeometry(0.25, 0.29, 0.84, 32),
    mat('#c6a99b', { transparent: true, opacity: 0.11, depthWrite: false }),
  );
  neck.position.y = 5.76;
  neck.userData.system = 'skin';
  g.add(neck);
  for (const side of [-1, 1]) {
    const links = [
      [side * 0.82, 5.05, side * 1.05, 3.83, 0.28],
      [side * 1.05, 3.85, side * 1.26, 2.83, 0.22],
      [side * 0.42, 0.9, side * 0.43, -0.83, 0.32],
      [side * 0.43, -0.82, side * 0.42, -2.68, 0.21],
      [side * 0.42, -2.7, side * 0.42, -4.48, 0.15],
    ];
    for (const [x1, y1, x2, y2, r] of links) {
      const m = new T.Mesh(
        new T.CapsuleGeometry(r, Math.abs(y2 - y1) - r * 0.5, 8, 20),
        mat('#c6a99b', { transparent: true, opacity: 0.11, depthWrite: false, roughness: 0.8 }),
      );
      m.position.set((x1 + x2) / 2, (y1 + y2) / 2, 0);
      m.rotation.z = Math.atan2(x2 - x1, y2 - y1);
      m.userData.system = 'skin';
      g.add(m);
    }
    ball(g, 'Hand', side * 1.28, 2.64, 0, 0.17, 0.26, 0.13, '#d8c0b1', null);
    ball(g, 'Foot', side * 0.42, -4.6, 0.19, 0.22, 0.15, 0.43, '#d8c0b1', null);
  }
}
function bonePosition(s, i) {
  const n = s.name.toLowerCase(),
    side = n.startsWith('right ') ? -1 : n.startsWith('left ') ? 1 : i % 2 ? 1 : -1;
  if (/rib \d/.test(n)) {
    const k = Number((n.match(/rib (\d+)/) || [])[1] || 5);
    return [
      side * (0.23 + k * 0.032),
      4.56 - k * 0.014,
      0.31 + Math.sin((k / 12) * Math.PI) * 0.19,
    ];
  }
  if (/cervical vertebra/.test(n)) return [0, 5.48 + (i % 7) * 0.067, -0.08];
  if (/thoracic vertebra/.test(n)) return [0, 4.85 - (i % 12) * 0.067, -0.09];
  if (/lumbar vertebra/.test(n)) return [0, 3.65 - (i % 5) * 0.075, -0.08];
  if (/sacrum/.test(n)) return [0, 1.54, -0.09];
  if (/coccyx/.test(n)) return [0, 1.16, -0.09];
  if (
    /skull|parietal|temporal|frontal bone|occipital|sphenoid|ethmoid|mandible|maxilla|zygomatic|nasal|lacrimal|palatine|concha|hyoid|malleus|incus|stapes/.test(
      n,
    )
  )
    return [side * 0.12, 6.84, 0.17];
  if (/clavicle/.test(n)) return [side * 0.59, 5.15, 0.15];
  if (/scapula/.test(n)) return [side * 0.65, 4.72, -0.24];
  if (/humerus/.test(n)) return [side * 0.89, 4.23, 0.24];
  if (/radius|ulna/.test(n)) return [side * 1.1, 3.2, 0.22];
  if (/carpal/.test(n)) return [side * 1.25, 2.76, 0.22];
  if (/metacarpal/.test(n)) return [side * 1.31, 2.57, 0.23];
  if (/hand phalanx/.test(n)) return [side * 1.35, 2.39 - (i % 4) * 0.045, 0.25];
  if (/hip bone/.test(n)) return [side * 0.39, 1.42, 0.02];
  if (/femur/.test(n)) return [side * 0.43, 0.26, 0.21];
  if (/patella/.test(n)) return [side * 0.43, -0.82, 0.38];
  if (/tibia|fibula/.test(n)) return [side * 0.43, -1.83, 0.16];
  if (/tars|calcane|talus|cuboid|cuneiform/.test(n)) return [side * 0.43, -3.65, 0.17];
  if (/metatarsal/.test(n)) return [side * 0.44, -4.12, 0.29];
  if (/foot phalanx/.test(n)) return [side * 0.45, -4.36, 0.38];
  return [side * 0.3, 4, 0.1];
}
function addBone(s, g, i) {
  const [x, y, z] = bonePosition(s, i),
    n = s.name.toLowerCase(),
    side = n.startsWith('right ') ? -1 : n.startsWith('left ') ? 1 : i % 2 ? 1 : -1;
  let a = [x, y + 0.11, z],
    b = [x + side * 0.018, y - 0.11, z],
    r = 0.055;
  if (/femur|humerus/.test(n)) {
    a = [x, y + 0.53, z];
    b = [x, y - 0.53, z];
    r = 0.092;
  } else if (/tibia|fibula|radius|ulna/.test(n)) {
    a = [x, y + 0.43, z];
    b = [x, y - 0.43, z];
    r = 0.045;
  } else if (/clavicle/.test(n)) {
    a = [x - side * 0.22, y, z];
    b = [x + side * 0.22, y - 0.035, z];
    r = 0.045;
  } else if (/rib \d/.test(n)) {
    const k = Number((n.match(/rib (\d+)/) || [])[1] || 6);
    const pts = Array.from({ length: 13 }, (_, j) => {
      const t = (j / 12) * Math.PI;
      return new T.Vector3(
        side * (0.12 + k * 0.026 + Math.cos(t) * (0.16 + k * 0.009)),
        y - 0.1 + Math.sin(t) * (0.22 + k * 0.012),
        z + Math.sin(t) * 0.17,
      );
    });
    const m = new T.Mesh(
      new T.TubeGeometry(new T.CatmullRomCurve3(pts), 20, 0.024, 6, false),
      mat(palette.bones),
    );
    m.userData.id = s.id;
    m.userData.name = s.name;
    m.userData.system = 'bones';
    g.add(m);
    return;
  } else if (/vertebra/.test(n)) {
    r = 0.09;
    a = [x, y + 0.06, z];
    b = [x, y - 0.06, z];
  } else if (/phalanx|metacarpal|metatarsal|carpal|tars/.test(n)) {
    a = [x - side * 0.036, y + 0.042, z];
    b = [x + side * 0.036, y - 0.042, z];
    r = 0.035;
  } else if (/sternum/.test(n)) {
    a = [0, 4.87, 0.33];
    b = [0, 4.13, 0.34];
    r = 0.09;
  }
  const d = new T.Vector3(...b).sub(new T.Vector3(...a)),
    m = new T.Mesh(
      new T.CapsuleGeometry(r, Math.max(0.025, d.length() - r * 2), 5, 10),
      mat(palette.bones),
    );
  m.position.set((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2);
  m.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), d.normalize());
  m.castShadow = true;
  m.userData.id = s.id;
  m.userData.name = s.name;
  m.userData.system = 'bones';
  g.add(m);
  const joint = new T.Mesh(new T.SphereGeometry(r * 1.12, 10, 8), mat(palette.bones));
  joint.position.set(...a);
  joint.userData.id = s.id;
  joint.userData.name = s.name;
  joint.userData.system = 'bones';
  g.add(joint);
}
function addMuscle(s, g, i) {
  const n = s.name.toLowerCase(),
    side = n.startsWith('right ') ? -1 : n.startsWith('left ') ? 1 : i % 2 ? 1 : -1;
  let x = side * 0.4,
    y = 3,
    z = 0.34,
    h = 0.42,
    w = 0.12;
  if (/head|temporalis|masseter|orbicularis|frontalis|occipitalis/.test(n)) {
    x = side * 0.22;
    y = 6.75;
    z = 0.34;
    h = 0.23;
    w = 0.13;
  } else if (/neck|scalene|sternocleidomastoid|trapezius/.test(n)) {
    x = side * 0.28;
    y = 5.42;
    z = 0.3;
    h = 0.55;
    w = 0.1;
  } else if (
    /arm|brach|deltoid|pector|serratus|latissimus|rhomboid|supra|infra|teres|subscapular|carpi|pollicis|pronator|flexor|extensor/.test(
      n,
    )
  ) {
    x = side * (n.includes('deltoid') ? 0.85 : 1.02);
    y = n.includes('deltoid') ? 4.88 : 3.55;
    z = 0.31;
    h = n.includes('deltoid') ? 0.28 : 0.4;
    w = 0.15;
  } else if (/abdom|diaphragm|intercostal|psoas/.test(n)) {
    x = side * 0.24;
    y = n.includes('diaphragm') ? 4.0 : n.includes('intercostal') ? 4.55 : 2.25;
    z = 0.47;
    h = 0.55;
    w = 0.22;
  } else if (
    /glute|adductor|gracilis|sartorius|fem|vastus|bicep femoris|semitend|semimem/.test(n)
  ) {
    x = side * 0.43;
    y = 0.03;
    z = 0.36;
    h = 0.78;
    w = 0.18;
  } else if (/tibial|fibular|gastrocnemius|soleus|digitorum|hallucis|peroneal/.test(n)) {
    x = side * 0.44;
    y = -2.25;
    z = 0.33;
    h = 0.62;
    w = 0.12;
  } else {
    x = side * 0.36;
    y = 3.25 - (i % 6) * 0.14;
    z = 0.35;
    h = 0.36;
    w = 0.12;
  }
  const m = ball(g, s.name, x, y, z, w, h, 0.11, palette.muscles, s.id);
  m.userData.system = 'muscles';
}
function buildCity(g, roadGroup, structures) {
  const base = mat('#344744', { roughness: 0.89 }),
    curb = mat('#bdae8c', { roughness: 0.7 }),
    street = mat('#e1d1ad', { roughness: 0.83 });
  for (const [y, rx, rz] of [
    [6.55, 0.7, 0.44],
    [4.35, 1.18, 0.76],
    [2.28, 0.88, 0.66],
    [0.35, 0.6, 0.52],
    [-2.5, 0.51, 1.12],
  ]) {
    const pad = new T.Mesh(new T.CylinderGeometry(rx * 0.96, rx, y < 1 ? 0.09 : 0.13, 52), base);
    pad.scale.z = rz / rx;
    pad.position.set(0, y, 0);
    pad.userData.system = 'city';
    pad.receiveShadow = true;
    g.add(pad);
    const ring = new T.Mesh(new T.TorusGeometry(rx * 0.95, 0.018, 6, 50), curb);
    ring.scale.z = rz / rx;
    ring.rotation.x = Math.PI / 2;
    ring.position.set(0, y + 0.07, 0);
    ring.userData.system = 'city';
    g.add(ring);
  }
  for (const line of [
    [
      [0, 6.6],
      [0, 5.8],
      [0, 5],
      [0, 4.2],
      [0, 3.5],
      [0, 2.7],
      [0, 1.9],
      [0, 1],
      [0, 0.2],
      [0, -0.8],
      [0, -2],
      [0, -3.2],
      [0, -4.3],
    ],
    [
      [-0.9, 4.75],
      [0, 4.34],
      [0.9, 4.75],
      [-0.86, 3.8],
      [0.86, 3.8],
      [-0.7, 2.4],
      [0.7, 2.4],
      [-0.38, 0.4],
      [0.38, 0.4],
      [-0.42, -1.6],
      [0.42, -1.6],
    ],
  ]) {
    const curve = new T.CatmullRomCurve3(line.map((p) => new T.Vector3(p[0], p[1], 0.17)));
    const mesh = new T.Mesh(new T.TubeGeometry(curve, 52, 0.067, 7, false), street);
    mesh.userData.system = 'city';
    g.add(mesh);
  }
  for (const side of [-1, 1]) {
    const water = tube(
      [
        [380 + 50 * side, 135, 0.08],
        [380 + 82 * side, 245, 0.08],
        [380 + 77 * side, 335, 0.08],
        [380 + 68 * side, 450, 0.08],
        [380 + 53 * side, 552, 0.08],
        [380 + 50 * side, 700, 0.08],
        [380 + 45 * side, 840, 0.08],
      ],
      0.045,
      '#54909a',
    );
    water.userData.system = 'city';
    g.add(water);
    for (let i = 0; i < 16; i++) {
      const tree = new T.Mesh(
        new T.ConeGeometry(0.055, 0.21, 6),
        mat(i % 2 ? '#729374' : '#a2a273'),
      );
      tree.position.set(side * (0.18 + (i % 4) * 0.24), 5.9 - Math.floor(i / 4) * 0.2, 0.22);
      tree.userData.system = 'city';
      g.add(tree);
    }
  }
  const deck = new T.Mesh(new T.BoxGeometry(1.42, 0.12, 0.46), mat('#d6b983'));
  deck.position.set(0, 0.17, 0.22);
  deck.userData.name = 'Upper/lower city bridge · symbolic anatomy landmark';
  deck.userData.system = 'city';
  deck.userData.city = true;
  g.add(deck);
  for (const side of [-1, 1]) {
    const p = new T.Mesh(new T.CylinderGeometry(0.045, 0.07, 0.43, 10), curb);
    p.position.set(side * 0.54, -0.035, 0.22);
    p.userData.system = 'city';
    g.add(p);
  }
  const colors = { arteries: '#df655a', veins: '#6699ce', nerves: '#dfb65b', lymph: '#78b48a' };
  for (const system of Object.keys(route))
    for (const line of route[system]) {
      const mesh = tube(
        line.map((p) => [p[0], p[1], 1.27]),
        system === 'nerves' || system === 'lymph' ? 0.023 : 0.032,
        colors[system],
      );
      mesh.userData.system = system;
      mesh.userData.cityRoute = true;
      roadGroup.add(mesh);
    }
  const buildingGroup = new T.Group();
  buildingGroup.userData.system = 'buildings';
  g.add(buildingGroup);
  structures.forEach((s, i) => {
    if (['arteries', 'veins', 'nerves'].includes(s.system)) return;
    if (s.system === 'lymph' && !/node|tonsil|cisterna/i.test(s.name)) return;
    makeBuilding(s, buildingGroup, i);
  });
}
function makeBuilding(s, g, i) {
  const r = s.region,
    side = s.name.startsWith('Right ') ? -1 : s.name.startsWith('Left ') ? 1 : i % 2 ? 1 : -1;
  let x =
      side *
      (r === 'head'
        ? 0.3
        : r === 'chest'
          ? 0.46
          : r === 'abdomen'
            ? 0.48
            : r === 'pelvis'
              ? 0.36
              : 0.42),
    y = { head: 6.6, chest: 4.42, abdomen: 2.36, pelvis: 0.46, legs: -2.73 }[r] ?? 2;
  const n = s.name.toLowerCase();
  if (/rib \d/.test(n)) {
    const k = Number((n.match(/rib (\d+)/) || [])[1] || 6);
    x = side * (0.24 + k * 0.031);
    y = 4.55 - k * 0.014;
  }
  if (/vertebra|spinal cord/.test(n)) x = 0;
  if (/hand|carpal|metacarpal/.test(n)) {
    x = side * 1.21;
    y = 2.72;
  }
  if (/foot|tars|metatarsal/.test(n)) {
    x = side * 0.43;
    y = -4.05;
  }
  if (!s.name.startsWith('Right ') && !s.name.startsWith('Left ')) x += ((i % 7) - 3) * 0.052;
  const h = 0.15 + (i % 5) * 0.049,
    w = 0.105 + (i % 3) * 0.024,
    c = ['#c89a77', '#779890', '#9d9274', '#879b83'][i % 4],
    m = mat(c, { roughness: 0.7 });
  const block = new T.Mesh(new T.BoxGeometry(w, h, w), m);
  block.position.set(x, y + h / 2, 0.04);
  block.castShadow = true;
  block.userData.id = s.id;
  block.userData.name = s.name;
  block.userData.city = true;
  g.add(block);
  block.userData.system = s.system;
  const roof = new T.Mesh(new T.ConeGeometry(w * 0.81, 0.073, 4), mat('#d8c599'));
  roof.rotation.y = Math.PI / 4;
  roof.position.set(x, y + h + 0.035, 0.04);
  roof.userData.id = s.id;
  roof.userData.name = s.name;
  roof.userData.city = true;
  roof.userData.system = s.system;
  g.add(roof);
  const win = new T.Mesh(
    new T.BoxGeometry(w * 0.48, 0.027, 0.012),
    mat('#f3d99a', { emissive: '#b18348', emissiveIntensity: 0.2 }),
  );
  win.position.set(x, y + h * 0.62, 0.04 + w * 0.51);
  win.userData.id = s.id;
  win.userData.name = s.name;
  win.userData.city = true;
  win.userData.system = s.system;
  g.add(win);
}
function addMoreNetworks(group, structures) {
  const names = structures.filter((s) =>
    ['arteries', 'veins', 'nerves', 'lymph'].includes(s.system),
  );
  const visible = new Set([
    'aorta',
    'vena-cava',
    'superior-vena-cava',
    'inferior-vena-cava',
    'spinal-cord',
    'thoracic-duct',
    'pulmonary-artery',
    'pulmonary-veins',
    'brachial-plexus',
    'upper-limb-arteries',
    'upper-limb-veins',
    'sciatic',
    'femoral-arteries',
    'femoral-veins',
    'renal-arteries',
    'vagus',
    'carotid',
    'jugular',
  ]);
  const paletteNetwork = {
    arteries: '#df655a',
    veins: '#6699ce',
    nerves: '#dfb65b',
    lymph: '#78b48a',
  };
  for (const s of names) {
    if (!visible.has(s.id)) continue;
    const match = route[s.system];
    if (!match) continue;
    let source = match[0];
    if (/^Left /.test(s.name)) {
      source = match[2] || match[0];
    }
    if (/^Right /.test(s.name)) {
      source = match[1] || match[0];
    }
    const mesh = tube(source, 0.021, paletteNetwork[s.system]);
    mesh.userData.id = s.id;
    mesh.userData.system = s.system;
    mesh.userData.name = s.name;
    mesh.userData.cityRoute = true;
    group.add(mesh);
  }
}
function setTint(o, color, chosen) {
  if (o.material && o.material.emissive) {
    o.material.emissive.set(chosen ? color : '#000000');
    o.material.emissiveIntensity = chosen ? 0.32 : 0;
  }
}
export default function ThreeAtlas({
  view,
  structures,
  systems,
  layers,
  selected,
  labels,
  zoom,
  setZoom,
  onSelect,
  onRotate,
  region,
}) {
  const canvas = useRef(null),
    pin = useRef(null),
    tip = useRef(null),
    state = useRef(null);
  state.current = {
    view,
    structures,
    systems,
    layers,
    selected,
    labels,
    zoom,
    setZoom,
    onSelect,
    onRotate,
    region,
  };
  useEffect(() => {
    const el = canvas.current,
      renderer = new T.WebGLRenderer({
        canvas: el,
        antialias: true,
        powerPreference: 'high-performance',
      });
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
    renderer.outputColorSpace = T.SRGBColorSpace;
    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = T.PCFSoftShadowMap;
    const scene = new T.Scene();
    scene.background = new T.Color('#e7e3d9');
    scene.fog = new T.Fog('#e7e3d9', 20, 44);
    const camera = new T.PerspectiveCamera(34, 1, 0.1, 80),
      target = new T.Vector3(0, 1.25, 0);
    scene.add(new T.HemisphereLight('#fff5e9', '#465359', 2.15));
    const sun = new T.DirectionalLight('#fff1dc', 3.15);
    sun.position.set(-7, 12, 12);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -8;
    sun.shadow.camera.right = 8;
    sun.shadow.camera.top = 12;
    sun.shadow.camera.bottom = -8;
    scene.add(sun);
    const fill = new T.DirectionalLight('#a9c3d2', 1.2);
    fill.position.set(8, 5, -8);
    scene.add(fill);
    const rim = new T.DirectionalLight('#edc19c', 1.35);
    rim.position.set(0, 7, -6);
    scene.add(rim);
    const floor = new T.Mesh(new T.CircleGeometry(18, 64), mat('#e7e3d9', { roughness: 1 }));
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -4.99;
    floor.receiveShadow = true;
    scene.add(floor);
    const grid = new T.GridHelper(32, 64, '#c6c6bd', '#d8d5cc');
    grid.position.y = -4.98;
    grid.material.transparent = true;
    grid.material.opacity = 0.43;
    scene.add(grid);
    const human = new T.Group(),
      organGroup = new T.Group(),
      boneGroup = new T.Group(),
      muscleGroup = new T.Group(),
      networks = new T.Group(),
      city = new T.Group();
    scene.add(human, organGroup, boneGroup, muscleGroup, networks, city);
    torso(human);
    const organSystems = new Map();
    for (const s of structures) {
      if (['bones', 'muscles', 'arteries', 'veins', 'nerves', 'lymph'].includes(s.system)) continue;
      let subgroup = organSystems.get(s.system);
      if (!subgroup) {
        subgroup = new T.Group();
        subgroup.userData.system = s.system;
        organGroup.add(subgroup);
        organSystems.set(s.system, subgroup);
      }
      organMesh(s, subgroup);
    }
    structures.filter((s) => s.system === 'bones').forEach((s, i) => addBone(s, boneGroup, i));
    structures
      .filter((s) => s.system === 'muscles')
      .forEach((s, i) => addMuscle(s, muscleGroup, i));
    for (const system of ['arteries', 'veins']) {
      for (const line of vesselPaths(structures, system)) {
        const m = tube(line, system === 'arteries' ? 0.025 : 0.022, palette[system]);
        m.userData.system = system;
        m.userData.network = true;
        m.userData.cityRoute = true;
        networks.add(m);
      }
    }
    for (const [system, lines] of Object.entries(route).filter(
      ([k]) => k === 'nerves' || k === 'lymph',
    )) {
      lines.forEach((line) => {
        const m = tube(
          line,
          system === 'lymph' || system === 'nerves' ? 0.022 : 0.033,
          palette[system],
        );
        m.userData.system = system;
        m.userData.network = true;
        networks.add(m);
      });
    }
    structures
      .filter((s) => ['arteries', 'veins', 'nerves', 'lymph'].includes(s.system))
      .forEach((s) => organMesh(s, networks));
    addMoreNetworks(networks, structures);
    buildCity(city, networks, structures);
    const itemById = new Map(structures.map((s) => [s.id, s]));
    const mats = [];
    scene.traverse((o) => {
      if (o.isMesh && o.userData.id) {
        const s = itemById.get(o.userData.id);
        if (s) {
          o.userData.region = s.region;
          o.userData.system = o.userData.system || s.system;
        }
        mats.push(o);
      }
    });
    let yaw = -0.3,
      yawAim = yaw,
      pitch = 0.17,
      pitchAim = pitch,
      width = 0,
      height = 0,
      frame = 0,
      drag = null,
      moved = false;
    const ray = new T.Raycaster(),
      pointer = new T.Vector2();
    function resize() {
      const w = el.clientWidth || 1,
        h = el.clientHeight || 1;
      if (w === width && h === height) return;
      width = w;
      height = h;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    function intersect(e) {
      const b = el.getBoundingClientRect();
      pointer.set(
        ((e.clientX - b.left) / b.width) * 2 - 1,
        (-(e.clientY - b.top) / b.height) * 2 + 1,
      );
      ray.setFromCamera(pointer, camera);
      return ray.intersectObjects(mats, false).find((h) => {
        let o = h.object,
          shown = true;
        while (o) {
          if (!o.visible) {
            shown = false;
            break;
          }
          o = o.parent;
        }
        return shown && h.object.userData.id;
      });
    }
    function down(e) {
      drag = { x: e.clientX, y: e.clientY, yaw: yawAim, pitch: pitchAim };
      moved = false;
      el.setPointerCapture(e.pointerId);
      el.style.cursor = 'grabbing';
    }
    function move(e) {
      if (drag) {
        const dx = e.clientX - drag.x,
          dy = e.clientY - drag.y;
        if (Math.abs(dx) + Math.abs(dy) > 3) moved = true;
        yawAim = drag.yaw - dx * 0.008;
        pitchAim = T.MathUtils.clamp(drag.pitch + dy * 0.006, -0.45, 0.48);
        return;
      }
      const hit = intersect(e),
        s = hit && state.current.structures.find((a) => a.id === hit.object.userData.id);
      el.style.cursor = hit ? 'pointer' : 'grab';
      if (tip.current) {
        tip.current.textContent = s?.name || '';
        tip.current.style.opacity = s ? '1' : '0';
        if (s) {
          const b = el.getBoundingClientRect();
          tip.current.style.left = Math.min(e.clientX - b.left + 15, b.width - 185) + 'px';
          tip.current.style.top = Math.max(12, e.clientY - b.top - 26) + 'px';
        }
      }
    }
    function up(e) {
      if (!drag) return;
      if (!moved) {
        const hit = intersect(e);
        if (hit) state.current.onSelect(hit.object.userData.id);
      }
      drag = null;
      el.style.cursor = 'grab';
    }
    function wheel(e) {
      e.preventDefault();
      state.current.setZoom((z) => T.MathUtils.clamp(z * Math.exp(-e.deltaY * 0.001), 0.55, 2.25));
    }
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    el.addEventListener('wheel', wheel, { passive: false });
    const observer = new ResizeObserver(resize);
    observer.observe(el);
    function draw() {
      frame = requestAnimationFrame(draw);
      resize();
      const a = state.current;
      const cityView = a.view === 'city';
      yaw += (yawAim - yaw) * 0.075;
      pitch += (pitchAim - pitch) * 0.075;
      human.visible = !cityView && a.layers.skin;
      organGroup.visible = !cityView;
      organGroup.children.forEach((o) => {
        o.visible = Boolean(a.layers[o.userData.system]);
      });
      boneGroup.visible = !cityView && (a.layers.bones || a.layers.joints);
      muscleGroup.visible = !cityView && a.layers.muscles;
      networks.children.forEach((o) => {
        o.visible = cityView
          ? Boolean(
              o.userData.city ||
              o.userData.cityRoute ||
              o.userData.system === 'city' ||
              a.layers[o.userData.system],
            )
          : Boolean(a.layers[o.userData.system]);
      });
      city.visible = cityView;
      city.children.forEach((o) => {
        o.visible = cityView
          ? o.userData.system !== 'buildings' || a.layers[o.userData.system] !== false
          : o.userData.system === 'city' || !o.userData.system || a.layers[o.userData.system];
      });
      const buildings = city.children.find((o) => o.userData.system === 'buildings');
      if (buildings)
        buildings.children.forEach((o) => {
          o.visible = a.layers[o.userData.system] !== false;
        });
      for (const m of mats) {
        const isSelected = m.userData.id === a.selected;
        if (m.userData.id) {
          const record = itemById.get(m.userData.id);
          if (record) {
            m.visible = a.region === 'all' || record.region === a.region;
          }
        }
        if (m.material?.emissive && m.userData.id) setTint(m, '#f3b54a', isSelected);
      }
      target.lerp(new T.Vector3(0, cityView ? 1.0 : 1.25, 0), 0.07);
      const distance = 20 / a.zoom,
        cp = Math.cos(pitch);
      camera.position.set(
        target.x + Math.sin(yaw) * cp * distance,
        target.y + Math.sin(pitch) * distance,
        target.z + Math.cos(yaw) * cp * distance,
      );
      camera.lookAt(target);
      renderer.render(scene, camera);
      const s = a.structures.find((x) => x.id === a.selected);
      if (s && pin.current && a.labels) {
        const p = V(s.x, s.y, 1.4).project(camera);
        const left = (p.x * 0.5 + 0.5) * width,
          top = (-p.y * 0.5 + 0.5) * height;
        pin.current.style.left = Math.max(12, Math.min(width - 192, left + 16)) + 'px';
        pin.current.style.top = Math.max(12, Math.min(height - 42, top)) + 'px';
        pin.current.style.opacity = p.z < 1 ? '1' : '0';
      } else if (pin.current) pin.current.style.opacity = '0';
    }
    draw();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointercancel', up);
      el.removeEventListener('wheel', wheel);
      renderer.dispose();
      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) o.material.dispose();
      });
    };
  }, []);
  return (
    <div className="three-stage">
      <canvas
        ref={canvas}
        className="three-canvas"
        aria-label={
          view === 'city'
            ? 'Interactive three-dimensional anatomy city. Drag to orbit and click a building.'
            : 'Interactive three-dimensional anatomy atlas. Drag to orbit; click a visible anatomical structure.'
        }
      />
      <div className="three-tip" ref={tip} />
      {labels && (
        <div className="three-pin" ref={pin}>
          {structures.find((s) => s.id === selected)?.name}
        </div>
      )}
      <div className="three-axis">
        {view === 'city' ? 'CITY PLAN' : 'ANTERIOR VIEW'} <span>·</span> PATIENT RIGHT{' '}
        <span>·</span> DRAG TO ORBIT
      </div>
    </div>
  );
}
function organMesh(s, g) {
  const key = s.id
    .replace(/-(organs|digestive|respiratory|urinary|reproductive|endocrine|sensory|immune)$/, '')
    .replace(/right-|left-/g, '');
  const find = (patterns) => patterns.find(([re]) => re.test(key));
  const core = find([
    [/^brain/, 'brain'],
    [/^heart/, 'heart'],
    [/^right-lung|^left-lung/, 'lung'],
    [/^liver/, 'liver'],
    [/^stomach/, 'stomach'],
    [/^spleen/, 'spleen'],
    [/^pancreas/, 'pancreas'],
    [/^gallbladder/, 'gallbladder'],
    [/^right-kidney|^left-kidney/, 'kidney'],
    [/^small-intestine/, 'small-intestine'],
    [/^large-intestine/, 'large-intestine'],
    [/^urinary-bladder/, 'urinary-bladder'],
    [/^thyroid/, 'thyroid'],
  ]);
  if (core) {
    const type = core[1],
      base = { ...s, id: type };
    if (type === 'lung') base.id = s.id.startsWith('left-') ? 'left-lung' : 'right-lung';
    if (type === 'kidney') base.id = s.id.startsWith('left-') ? 'left-kidney' : 'right-kidney';
    return makeOrgan(base, g);
  }
  const p = V(s.x, s.y, 1.12),
    n = s.name.toLowerCase(),
    color = palette[s.system] || palette.organs;
  if (/node|lymph/.test(n)) {
    for (let j = 0; j < 5; j++) {
      const a = (j / 5) * Math.PI * 2;
      const m = ball(
        g,
        s.name,
        p.x + Math.cos(a) * 0.075,
        p.y + Math.sin(a) * 0.06,
        1.22,
        0.065,
        0.045,
        0.055,
        color,
        s.id,
      );
      m.userData.system = s.system;
      m.userData.cityNode = true;
    }
    return;
  }
  if (/nerve|plexus|cord|cranial/.test(n)) {
    let pts;
    if (
      /optic|oculomotor|trochlear|trigeminal|abducens|facial|vestibulo|glossopharyngeal|hypoglossal|olfactory|cranial/.test(
        n,
      )
    )
      pts = [
        [380, 160],
        [380 + (n.includes('Left') ? 1 : -1) * 12, 151],
        [380 + (n.includes('Left') ? 1 : -1) * 32, 143],
        [380 + (n.includes('Left') ? 1 : -1) * 45, 133],
        [380 + (n.includes('Left') ? 1 : -1) * 52, 116],
      ];
    else if (/brachial|radial|ulnar|median|musculocutaneous/.test(n))
      pts = route.nerves[n.includes('Left') ? 2 : 1];
    else if (/sciatic|tibial|fibular|femoral|sacral/.test(n))
      pts = route.nerves[n.includes('Left') ? 4 : 3];
    else if (/intercostal/.test(n))
      pts = [
        [380, 305],
        [350, 307],
        [332, 319],
        [312, 333],
        [291, 341],
      ];
    else if (/vagus/.test(n))
      pts = [
        [380, 175],
        [385, 236],
        [380, 289],
        [390, 330],
        [398, 385],
        [400, 439],
        [408, 478],
      ];
    else pts = route.nerves[0];
    const m = tube(pts, 0.017, color);
    m.userData.id = s.id;
    m.userData.system = s.system;
    m.userData.name = s.name;
    m.userData.cityRoute = true;
    g.add(m);
    return;
  }
  if (/arter|aorta|carotid|pulmonary trunk/.test(n) || /vein|vena cava|jugular/.test(n)) {
    let line = route[s.system]?.[0] || route[s.system === 'arteries' ? 'arteries' : 'veins'][0];
    if (/arm|brachial|axillary|radial|ulnar|cephalic|basilic|subclavian/.test(n))
      line = route[s.system === 'arteries' ? 'arteries' : 'veins'][n.includes('Left') ? 2 : 1];
    if (/leg|femoral|iliac|tibial|popliteal|saphenous/.test(n))
      line = route[s.system === 'arteries' ? 'arteries' : 'veins'][n.includes('Left') ? 6 : 5];
    if (/renal/.test(n))
      line = route[s.system === 'arteries' ? 'arteries' : 'veins'][n.includes('Left') ? 4 : 3];
    if (/carotid|jugular|vertebral/.test(n))
      line = route[s.system === 'arteries' ? 'arteries' : 'veins'][
        n.includes('Left') ? 2 : 1
      ].slice(0, 5);
    if (/coronary/.test(n))
      line = [
        [386, 315],
        [376, 320],
        [375, 328],
        [389, 332],
        [400, 325],
        [404, 314],
      ];
    if (/pulmonary/.test(n))
      line = [
        [386, 316],
        [380, 308],
        [370, 301],
        [351, 293],
        [335, 285],
      ];
    if (/hepatic|mesenteric|celiac|portal|splenic/.test(n))
      line = [
        [399, 396],
        [382, 405],
        [365, 414],
        [349, 421],
        [334, 427],
      ];
    const m = tube(line, 0.022, color);
    m.userData.id = s.id;
    m.userData.system = s.system;
    m.userData.name = s.name;
    m.userData.cityRoute = true;
    g.add(m);
    return;
  }
  const m = ball(g, s.name, p.x, p.y, 1.16, 0.13, 0.16, 0.11, color, s.id);
  m.userData.system = s.system;
}
function joinTube(group, name, points, radius, color, id, system) {
  const m = tube(points, radius, color);
  m.userData.id = id;
  m.userData.name = name;
  m.userData.system = system;
  group.add(m);
  return m;
}
function vesselPaths(structures, system) {
  const isArtery = system === 'arteries',
    c = isArtery ? palette.arteries : palette.veins;
  const central = isArtery
    ? [
        [386, 315],
        [394, 337],
        [392, 373],
        [395, 402],
        [396, 438],
        [397, 481],
        [400, 522],
        [405, 552],
        [415, 602],
        [418, 673],
        [418, 760],
        [416, 839],
      ]
    : [
        [359, 136],
        [360, 192],
        [361, 256],
        [362, 318],
        [362, 379],
        [365, 433],
        [363, 482],
        [362, 523],
        [360, 552],
        [352, 612],
        [350, 688],
        [347, 763],
        [344, 839],
      ];
  const branches = isArtery
    ? [
        [
          [395, 346],
          [376, 332],
          [354, 323],
          [339, 303],
          [329, 276],
          [322, 250],
          [321, 222],
          [316, 190],
          [309, 161],
          [304, 134],
        ],
        [
          [395, 346],
          [415, 332],
          [439, 320],
          [452, 299],
          [460, 274],
          [468, 249],
          [474, 219],
          [482, 189],
          [493, 160],
          [501, 136],
        ],
        [
          [393, 411],
          [371, 398],
          [347, 392],
          [323, 382],
          [300, 372],
          [279, 360],
          [260, 350],
        ],
        [
          [397, 411],
          [418, 398],
          [440, 391],
          [462, 382],
          [484, 370],
          [505, 359],
          [523, 348],
        ],
        [
          [398, 487],
          [377, 475],
          [356, 469],
          [337, 463],
          [323, 452],
          [312, 441],
        ],
        [
          [400, 487],
          [420, 474],
          [442, 469],
          [461, 460],
          [479, 448],
          [492, 434],
        ],
        [
          [404, 550],
          [389, 560],
          [376, 573],
          [365, 589],
          [357, 611],
          [354, 633],
          [350, 660],
          [350, 685],
          [345, 708],
          [342, 739],
          [343, 770],
          [340, 799],
          [337, 835],
        ],
        [
          [414, 550],
          [425, 561],
          [435, 575],
          [443, 594],
          [450, 616],
          [452, 642],
          [450, 669],
          [451, 694],
          [447, 716],
          [446, 741],
          [440, 769],
          [435, 798],
          [434, 835],
        ],
        [
          [392, 373],
          [370, 370],
          [353, 374],
          [333, 380],
        ],
        [
          [398, 373],
          [417, 371],
          [431, 378],
          [449, 382],
        ],
      ]
    : [
        [
          [361, 307],
          [343, 298],
          [330, 281],
          [326, 258],
          [324, 237],
          [320, 213],
          [315, 188],
          [310, 160],
          [305, 136],
        ],
        [
          [361, 307],
          [378, 295],
          [399, 289],
          [425, 295],
          [447, 285],
          [458, 265],
          [464, 241],
          [469, 215],
          [480, 189],
          [492, 160],
          [501, 136],
        ],
        [
          [362, 431],
          [343, 419],
          [320, 408],
          [297, 397],
          [278, 381],
          [260, 361],
        ],
        [
          [363, 431],
          [384, 419],
          [408, 412],
          [432, 402],
          [455, 390],
          [483, 373],
          [520, 352],
        ],
        [
          [362, 489],
          [343, 483],
          [326, 472],
          [316, 458],
          [306, 441],
        ],
        [
          [363, 489],
          [383, 480],
          [404, 472],
          [427, 462],
          [449, 453],
          [473, 440],
        ],
        [
          [360, 550],
          [343, 559],
          [329, 575],
          [319, 595],
          [313, 620],
          [314, 649],
          [318, 675],
          [318, 701],
          [321, 731],
          [324, 760],
          [326, 791],
          [331, 824],
          [337, 840],
        ],
        [
          [360, 550],
          [382, 559],
          [399, 576],
          [408, 596],
          [414, 620],
          [415, 648],
          [411, 677],
          [410, 704],
          [409, 735],
          [410, 764],
          [412, 793],
          [415, 825],
          [414, 840],
        ],
        [
          [361, 350],
          [343, 346],
          [324, 350],
          [304, 362],
        ],
        [
          [362, 350],
          [379, 341],
          [399, 339],
          [420, 341],
        ],
      ];
  const result = [central, ...branches];
  for (const [i, line] of branches.entries()) {
    const count = i < 2 ? 7 : i < 4 ? 6 : i < 6 ? 5 : 8;
    for (let k = 1; k <= count; k++) {
      const a = k / (count + 1),
        j = Math.min(Math.floor(a * (line.length - 1)), line.length - 2),
        t = a * (line.length - 1) - j,
        p = [
          line[j][0] + (line[j + 1][0] - line[j][0]) * t,
          line[j][1] + (line[j + 1][1] - line[j][1]) * t,
        ];
      const end = [p[0] + (i % 2 ? -1 : 1) * (6 + (k % 3) * 3), p[1] + (k % 2 ? 6 : -6)];
      result.push([p, [p[0] + (end[0] - p[0]) * 0.52, p[1] + (end[1] - p[1]) * 0.45], end]);
    }
  }
  return result;
}
