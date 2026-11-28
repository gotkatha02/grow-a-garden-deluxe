// A swing crescent painted in "unrolled" space: UV.x = along the swing (0 = tail … 1 = the axe head),
// UV.y = across it (0 = outside the blade path … 1 = inside). The game bends this strip onto the real
// swing of the sprite every frame (wolf_gfx.js), so this shader only decides how the crescent LOOKS.
// Strip height = 1.5 W: the blade path (the crescent's outer edge) sits at v = 1/6, its full width W reaches v = 5/6.
shader_type canvas_item;

uniform float t = 0.0;                 // 0 … 1 over the piece's life
uniform float kind = 0.0;              // 0 steel (basic, gold) · 1 blood (berserker, vampiric) · 2 ice (runic) · 3 thunder · 4 fury (fire)
uniform vec4 c0 : source_color;        // ink
uniform vec4 c1 : source_color;        // deep
uniform vec4 c2 : source_color;        // mid
uniform vec4 c3 : source_color;        // lite
uniform vec4 c4 : source_color;        // core
uniform sampler2D n1 : repeat_enable, filter_linear;   // fbm
uniform sampler2D n2 : repeat_enable, filter_linear;   // cellular (ice facets)

const float V0 = 1.0 / 6.0;
const float WV = 2.0 / 3.0;

float prof(float u) { u = clamp(u, 0.0, 1.0); return pow(sin(3.14159265 * pow(u, 1.55)), 0.8); }

void fragment() {
	float u = UV.x, v = UV.y;
	float p = max(prof(u), 0.0001);
	float d = (v - V0) / (WV * p);                       // 0 = blade edge, 1 = inner edge, < 0 = outside
	float f1 = texture(n1, vec2(u * 1.6 - t * 1.3, v * 0.9)).r;
	float f2 = texture(n1, vec2(u * 4.0 - t * 2.6, v * 3.0 + 0.3)).r;
	float cell = texture(n2, vec2(u * 3.2 + 0.1, v * 1.3)).r;

	// ragged inner edge: soft wisps (steel), long dripping tongues (blood), crystal teeth (ice)
	float rough = (f2 - 0.5) * 0.35;
	if (kind > 3.5) {                                    // fury: flame tongues licking off the inner edge
		float fl = texture(n1, vec2(u * 5.0 + t * 0.6, v * 1.2 - t * 1.8)).r;
		rough = (fl - 0.45) * 0.9 * smoothstep(0.1, 0.45, u);
	} else if (kind > 2.5) {                             // thunder: torn, flickering edge
		rough = (texture(n1, vec2(u * 6.0, floor(t * 15.0) * 0.31)).r - 0.5) * 0.5;
	} else if (kind > 1.5) {                             // ice: crystal teeth of uneven height
		float hgt = texture(n1, vec2(floor(u * 15.0) * 0.173, 0.61)).r;
		float tri = abs(fract(u * 15.0) - 0.5) * 2.0;      // 1 at the gaps, 0 at the tooth tips
		rough = (0.5 - tri) * (0.25 + hgt * 0.55) - 0.05;
	} else if (kind > 0.5) {                             // blood: rounded drips hanging off the inner edge
		float dr = texture(n1, vec2(u * 2.6, 0.27)).r;
		rough += smoothstep(0.5, 0.85, dr) * 0.45 * smoothstep(0.15, 0.5, u);
	}
	float body = smoothstep(1.0 + rough, 0.86 + rough, d) * smoothstep(-0.04, 0.015, d);

	float tail = smoothstep(0.03, 0.5, u);
	float dt = smoothstep(0.32, 1.0, t) * 1.15;           // dissolve front: tail first, torn into streaks along the swing
	float fs = texture(n1, vec2(u * 2.4 - t * 0.7, v * 6.5 + 0.11)).r;
	float val = fs * 0.6 + u * 0.5 + (1.0 - clamp(d, 0.0, 1.0)) * 0.1;
	float diss = smoothstep(dt - 0.06, dt + 0.02, val);
	float burn = diss * (1.0 - smoothstep(dt + 0.02, dt + 0.1, val)) * step(0.01, dt);   // lit rim on the tearing edge
	float a = body * tail * diss;

	// five-tone ramp from the white-hot edge inward
	vec3 col = mix(c4.rgb, c3.rgb, smoothstep(0.0, 0.13, d));
	col = mix(col, c2.rgb, smoothstep(0.1, 0.38, d));
	col = mix(col, c1.rgb, smoothstep(0.36, 0.8, d));
	col = mix(col, c0.rgb, smoothstep(0.8, 1.08, d) * 0.75);

	// energy streaks running toward the head
	float st = smoothstep(0.58, 0.86, texture(n1, vec2(u * 1.1 - t * 2.2, v * 8.0)).r);
	col = mix(col, c3.rgb, st * 0.42 * clamp(1.0 - d, 0.0, 1.0));
	if (kind > 3.5) {                                    // fury: hot core streaks
		float hs = smoothstep(0.55, 0.8, texture(n1, vec2(u * 2.0 - t * 2.0, v * 5.0)).r);
		col = mix(col, c4.rgb, hs * 0.35 * clamp(1.0 - d, 0.0, 1.0));
	} else if (kind > 2.5) {                             // thunder: electric filaments crawling inside, re-drawn every frame
		float rn = texture(n1, vec2(u * 3.0 + floor(t * 15.0) * 0.17, v * 2.5)).r;
		float fil = smoothstep(0.035, 0.0, abs(rn - 0.5));
		col = mix(col, c4.rgb, fil * 0.9 * clamp(1.2 - d, 0.0, 1.0));
	} else if (kind > 1.5) {                             // ice: sharp diagonal facet sheen
		float fct = smoothstep(0.05, 0.0, abs(fract(u * 9.0 + v * 2.2 + cell * 0.3) - 0.5));
		col = mix(col, c4.rgb, fct * 0.35 * clamp(1.0 - d * 0.8, 0.0, 1.0));
	} else if (kind < 0.5) {                             // steel: the axe's rune line, broken into glyph dashes
		float g = texture(n1, vec2(floor(u * 14.0 - t * 3.0) * 0.137, 0.71)).r;            // glyph dashes of uneven length
		float rl = smoothstep(0.035, 0.0, abs(d - 0.33)) * step(0.5, fract(u * 14.0 - t * 3.0) + g * 0.45 - 0.2);
		col = mix(col, c4.rgb, rl * 0.6 * tail);
	} else {                                             // blood: darker clotted inner half
		col = mix(col, c0.rgb, smoothstep(0.55, 1.0, d) * smoothstep(0.4, 0.8, f2) * 0.5);
	}

	col = mix(col, c3.rgb, burn * 0.8);

	// soft light just outside the blade edge (kept low: it turns into a white patch on snow)
	float gl = (1.0 - smoothstep(0.0, 0.5, -d)) * step(d, 0.0) * tail * diss * 0.42 * (0.7 + 0.3 * f1);
	float A = a + gl * (1.0 - a);
	vec3 rgb = (col * a + c3.rgb * gl * (1.0 - a)) / max(A, 0.0001);
	COLOR = vec4(rgb, A);
}
