"use client";
import { useEffect, useRef, useState } from "react";
type Props = {
  src: string;
  alt?: string;
  className?: string;
  colors?: [string, string, string, string];
  radius?: number;
  strength?: number;
  distortion?: number;
  hueShift?: number;
  cycleSpeed?: number;
  speed?: number;
  persistence?: number;
  smoothing?: number;
  overflow?: number;
  quality?: "high" | "low";
  fadeIn?: number;
  maxDpr?: number;
};
const VS = `attribute vec2 p;varying vec2 uv;void main(){uv=p*.5+.5;uv.y=1.-uv.y;gl_Position=vec4(p,0.,1.);}`;
const FS = `precision highp float;varying vec2 uv;uniform sampler2D t;uniform vec2 m,v,res,pad;
uniform float time,rad,str,dis,hue,fade,burst,bt,hq;uniform vec3 c0,c1,c2,c3;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
vec2 flow(vec2 p){float e=.02;vec2 g=vec2(n(p+vec2(e,0.))-n(p-vec2(e,0.)),n(p+vec2(0.,e))-n(p-vec2(0.,e)))/(2.*e);
 return hq>.5?vec2(g.y,-g.x):g;}
vec3 rot(vec3 c,float a){float s=sin(a),k=cos(a);vec3 ax=vec3(.57735);return c*k+cross(ax,c)*s+ax*dot(ax,c)*(1.-k);}
void main(){vec2 d=uv-m;d.x*=res.x/res.y;float r=length(d);
 float inf=smoothstep(rad,0.,r)*(.35+min(length(v)*14.,1.));
 float ring=burst*exp(-pow((r-bt)*9.,2.));float k=inf+ring;
 vec2 iuv=(uv-pad)/(1.-2.*pad);
 vec2 w=iuv+flow(uv*3.+time*.15)*dis*.06*k+normalize(d+1e-4)*ring*.04*dis;
 vec4 img=texture2D(t,clamp(w,0.,1.));
 float inside=step(0.,iuv.x)*step(iuv.x,1.)*step(0.,iuv.y)*step(iuv.y,1.);img.a*=inside*fade;
 float a=n(uv*2.5+time*.2),b=n(uv*2.5-time*.17+5.);
 vec3 col=rot(mix(mix(c0,c1,a),mix(c2,c3,a),b),hue);
 float mixv=clamp(k*str,0.,1.);
 gl_FragColor=vec4(mix(img.rgb,col,mixv*.9*(img.a>.02?1.:.0)+mixv*.0),max(img.a,0.)*1.);
 gl_FragColor.rgb=mix(gl_FragColor.rgb,col,mixv*.9*step(.02,img.a));}`;
const rgb = (hex: string): [number, number, number] => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};
export default function FluidImage({
  src,
  alt = "",
  className,
  colors = ["#5d7f6c", "#c9b79c", "#d98f6f", "#8fb3c4"],
  radius = 0.22,
  strength = 1,
  distortion = 1,
  hueShift = 0,
  cycleSpeed = 0.4,
  speed = 1,
  persistence = 0.95,
  smoothing = 0.12,
  overflow = 0,
  quality = "high",
  fadeIn = 0.8,
  maxDpr = 2,
}: Props) {
  const wrap = useRef<HTMLDivElement>(null),
    cv = useRef<HTMLCanvasElement>(null);
  const api = useRef<{ load: (s: string) => void } | null>(null);
  const opts = useRef({
    radius,
    strength,
    distortion,
    hueShift,
    cycleSpeed,
    speed,
    persistence,
    smoothing,
    quality,
    colors,
  });
  opts.current = {
    radius,
    strength,
    distortion,
    hueShift,
    cycleSpeed,
    speed,
    persistence,
    smoothing,
    quality,
    colors,
  };
  const [live, setLive] = useState(false);
  useEffect(() => {
    const canvas = cv.current!,
      box = wrap.current!;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return; // fallback statis
    const gl = canvas.getContext("webgl", {
      alpha: true,
      premultipliedAlpha: false,
    });
    if (!gl) return;
    const mk = (type: number, s: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, s);
      gl.compileShader(sh);
      return sh;
    };
    const pr = gl.createProgram()!;
    gl.attachShader(pr, mk(gl.VERTEX_SHADER, VS));
    gl.attachShader(pr, mk(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(pr);
    gl.useProgram(pr);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const loc = gl.getAttribLocation(pr, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    const U = (n: string) => gl.getUniformLocation(pr, n);
    const tex = gl.createTexture();
    let alive = true,
      raf = 0,
      running = false,
      t0 = performance.now(),
      loaded = 0;
    const pt = {
      x: 0.5,
      y: 0.5,
      tx: 0.5,
      ty: 0.5,
      vx: 0,
      vy: 0,
      inside: false,
    };
    let energy = 0,
      burst = 0,
      bt = 0;
    const load = (s: string) => {
      const im = new Image();
      im.crossOrigin = "anonymous";
      im.onload = () => {
        if (!alive) return;
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, im);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        loaded = performance.now();
        setLive(true);
        start();
      };
      im.src = s;
    };
    api.current = { load };
    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, maxDpr),
        r = canvas.getBoundingClientRect();
      canvas.width = r.width * dpr;
      canvas.height = r.height * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
      draw();
    };
    const draw = () => {
      const o = opts.current,
        now = ((performance.now() - t0) / 1000) * o.speed;
      const px = overflow / (box.clientWidth + overflow * 2 || 1),
        py = overflow / (box.clientHeight + overflow * 2 || 1);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(U("m"), pt.x, pt.y);
      gl.uniform2f(U("v"), pt.vx, pt.vy);
      gl.uniform2f(U("res"), canvas.width, canvas.height);
      gl.uniform2f(U("pad"), px, py);
      gl.uniform1f(U("time"), now * o.cycleSpeed);
      gl.uniform1f(U("rad"), o.radius);
      gl.uniform1f(U("str"), o.strength * Math.min(1, energy));
      gl.uniform1f(U("dis"), o.distortion);
      gl.uniform1f(U("hue"), o.hueShift + now * o.cycleSpeed * 0.5);
      gl.uniform1f(U("burst"), burst);
      gl.uniform1f(U("bt"), bt);
      gl.uniform1f(U("hq"), o.quality === "high" ? 1 : 0);
      gl.uniform1f(
        U("fade"),
        Math.min(1, (performance.now() - loaded) / (fadeIn * 1000)),
      );
      o.colors.forEach((c, i) => gl.uniform3fv(U("c" + i), rgb(c)));
      gl.uniform1i(U("t"), 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    const loop = () => {
      const o = opts.current;
      const px = pt.x,
        py = pt.y;
      pt.x += (pt.tx - pt.x) * o.smoothing;
      pt.y += (pt.ty - pt.y) * o.smoothing;
      pt.vx = pt.x - px;
      pt.vy = pt.y - py;
      energy = pt.inside ? 1 : energy * o.persistence;
      if (burst > 0) {
        burst *= 0.955;
        bt += 0.012;
      }
      draw();
      const fading = performance.now() - loaded < fadeIn * 1000;
      if (!pt.inside && energy < 0.003 && burst < 0.003 && !fading) {
        running = false;
        return;
      } // RAF berhenti saat semua efek reda
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (!running && alive) {
        running = true;
        raf = requestAnimationFrame(loop);
      }
    };
    const move = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pt.tx = (e.clientX - r.left) / r.width;
      pt.ty = (e.clientY - r.top) / r.height;
      pt.inside = true;
      start();
    };
    const leave = () => {
      pt.inside = false;
      start();
    };
    const click = (e: PointerEvent) => {
      move(e);
      burst = 1;
      bt = 0;
      start();
    };
    box.addEventListener("pointermove", move);
    box.addEventListener("pointerleave", leave);
    box.addEventListener("pointerdown", click);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    load(src);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      box.removeEventListener("pointermove", move);
      box.removeEventListener("pointerleave", leave);
      box.removeEventListener("pointerdown", click);
      api.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    api.current?.load(src);
  }, [src]); // ganti gambar tanpa membuat ulang konteks GL
  return (
    <div ref={wrap} className={`relative ${className ?? ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="block h-full w-full object-contain"
        style={{ opacity: live ? 0 : 1 }}
      />
      <canvas
        ref={cv}
        aria-hidden
        className="absolute"
        style={{
          inset: -overflow,
          width: `calc(100% + ${overflow * 2}px)`,
          height: `calc(100% + ${overflow * 2}px)`,
          opacity: live ? 1 : 0,
        }}
      />
    </div>
  );
}
