import { View, StyleSheet, Animated, Easing } from 'react-native';
import Svg, { Rect, Circle, Line, G, Path, Text as SvgText } from 'react-native-svg';
import { useEffect, useRef } from 'react';
import { colors } from '../lib/theme';

export function HomeIcon({ size = 20, color = colors.inkLight }) {
  const s = size;
  return (
    <View style={{ width: s, height: s, alignItems: 'center', justifyContent: 'center' }}>
      {/* Roof */}
      <View style={{
        width: 0, height: 0,
        borderLeftWidth: s * 0.45, borderRightWidth: s * 0.45,
        borderBottomWidth: s * 0.35,
        borderLeftColor: 'transparent', borderRightColor: 'transparent',
        borderBottomColor: color,
        marginBottom: -1,
      }} />
      {/* Body */}
      <View style={{
        width: s * 0.65, height: s * 0.45,
        backgroundColor: color,
        borderBottomLeftRadius: 2, borderBottomRightRadius: 2,
      }} />
    </View>
  );
}

export function CalendarIcon({ size = 20, color = colors.inkLight }) {
  const s = size;
  const bw = Math.max(1.5, s * 0.1);
  return (
    <View style={{ width: s, height: s, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{
        width: s * 0.8, height: s * 0.75,
        borderWidth: bw, borderColor: color,
        borderRadius: 3, marginTop: s * 0.1,
      }}>
        <View style={{
          height: s * 0.22, backgroundColor: color,
          borderTopLeftRadius: 1, borderTopRightRadius: 1,
        }} />
      </View>
      {/* Top pins */}
      <View style={{
        position: 'absolute', top: 0,
        flexDirection: 'row', width: s * 0.5, justifyContent: 'space-between',
      }}>
        <View style={{ width: bw, height: s * 0.2, backgroundColor: color, borderRadius: 1 }} />
        <View style={{ width: bw, height: s * 0.2, backgroundColor: color, borderRadius: 1 }} />
      </View>
    </View>
  );
}

export function UserIcon({ size = 20, color = colors.inkLight }) {
  const s = size;
  return (
    <View style={{ width: s, height: s, alignItems: 'center', justifyContent: 'flex-end' }}>
      {/* Head */}
      <View style={{
        width: s * 0.35, height: s * 0.35,
        borderRadius: s * 0.175,
        backgroundColor: color,
        marginBottom: s * 0.06,
      }} />
      {/* Body */}
      <View style={{
        width: s * 0.65, height: s * 0.35,
        backgroundColor: color,
        borderTopLeftRadius: s * 0.3, borderTopRightRadius: s * 0.3,
      }} />
    </View>
  );
}

export function LogoutIcon({ size = 20, color = colors.inkLight }) {
  const s = size;
  const bw = Math.max(1.5, s * 0.1);
  return (
    <View style={{ width: s, height: s, alignItems: 'center', justifyContent: 'center' }}>
      {/* Door frame */}
      <View style={{
        width: s * 0.55, height: s * 0.8,
        borderWidth: bw, borderColor: color,
        borderRadius: 2, borderRightWidth: 0,
        position: 'absolute', left: s * 0.05,
      }} />
      {/* Arrow */}
      <View style={{
        width: s * 0.4, height: bw,
        backgroundColor: color,
        position: 'absolute', right: s * 0.08,
      }} />
      <View style={{
        width: 0, height: 0,
        borderTopWidth: s * 0.15, borderBottomWidth: s * 0.15,
        borderLeftWidth: s * 0.15,
        borderTopColor: 'transparent', borderBottomColor: 'transparent',
        borderLeftColor: color,
        position: 'absolute', right: s * 0.05,
      }} />
    </View>
  );
}

export function CopyIcon({ size = 20, color = colors.inkLight }) {
  const bw = Math.max(1.5, size * 0.09);
  const r = size * 0.12;
  const back = size * 0.65;
  const front = size * 0.6;
  const off = size * 0.25;
  return (
    <View style={{ width: size, height: size }}>
      <View style={{ position: 'absolute', top: 0, left: off, width: back, height: back, borderWidth: bw, borderColor: color, borderRadius: r }} />
      <View style={{ position: 'absolute', top: off, left: 0, width: front, height: front, borderWidth: bw, borderColor: color, borderRadius: r, backgroundColor: 'transparent' }} />
    </View>
  );
}

export function QRIcon({ size = 20, color = '#FFFFFF' }) {
  const s = size;
  const bw = Math.max(1.5, s * 0.12);
  const corner = s * 0.35;
  const gap = s * 0.08;
  return (
    <View style={{ width: s, height: s }}>
      {/* TL */}
      <View style={{ position: 'absolute', top: gap, left: gap, width: corner, height: corner, borderWidth: bw, borderColor: color, borderRadius: 2 }} />
      {/* TR */}
      <View style={{ position: 'absolute', top: gap, right: gap, width: corner, height: corner, borderWidth: bw, borderColor: color, borderRadius: 2 }} />
      {/* BL */}
      <View style={{ position: 'absolute', bottom: gap, left: gap, width: corner, height: corner, borderWidth: bw, borderColor: color, borderRadius: 2 }} />
      {/* Center dot */}
      <View style={{ position: 'absolute', top: s * 0.4, left: s * 0.4, width: s * 0.2, height: s * 0.2, backgroundColor: color, borderRadius: 1 }} />
    </View>
  );
}

const LOADER_EDGES = [
  [256,108,392,128],[256,108,184,190],[256,108,315,198],[184,190,315,198],
  [315,198,392,128],[392,128,522,190],[522,190,656,158],[184,190,140,238],
  [315,198,268,240],[392,128,400,235],[522,190,548,238],[656,158,712,244],
  [213,413,150,345],[213,413,365,445],[365,445,322,348],[365,445,446,392],
  [446,392,430,348],[446,392,561,428],[561,428,598,350],[561,428,692,390],
  [692,390,740,345],
];

const BIG_NODES = [
  { cx:392, cy:128, fill:0, delay:1100, dur:2100 },
  { cx:184, cy:190, fill:0, delay:0,    dur:2300 },
  { cx:315, cy:198, fill:1, delay:600,  dur:2700 },
  { cx:522, cy:190, fill:1, delay:300,  dur:2500 },
  { cx:656, cy:158, fill:0, delay:1400, dur:2400 },
  { cx:213, cy:413, fill:1, delay:800,  dur:2600 },
  { cx:365, cy:445, fill:0, delay:1300, dur:2800 },
  { cx:561, cy:428, fill:1, delay:200,  dur:2200 },
  { cx:692, cy:390, fill:0, delay:500,  dur:2300 },
];

const SMALL_DOTS = [
  { cx:256, cy:108, delay:400, dur:1900 },
  { cx:446, cy:392, delay:900, dur:2000 },
];

function HeartbeatNode({ cx, cy, r, fill, delayMs, durMs, children }) {
  const scale = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const seq = Animated.sequence([
      Animated.delay(delayMs),
      Animated.loop(
        Animated.sequence([
          Animated.timing(scale, { toValue: 1.2, duration: durMs * 0.18, easing: Easing.out(Easing.ease), useNativeDriver: true }),
          Animated.timing(scale, { toValue: 0.95, duration: durMs * 0.16, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(scale, { toValue: 1.13, duration: durMs * 0.18, easing: Easing.out(Easing.ease), useNativeDriver: true }),
          Animated.timing(scale, { toValue: 1, duration: durMs * 0.48, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        ])
      ),
    ]);
    seq.start();
    return () => seq.stop();
  }, []);
  const sz = r * 2;
  return (
    <Animated.View style={{
      position: 'absolute', left: cx - r, top: cy - r,
      width: sz, height: sz, transform: [{ scale }],
    }}>
      <Svg width={sz} height={sz} viewBox={`0 0 ${sz} ${sz}`}>
        <Circle cx={r} cy={r} r={r} fill={fill} />
        {children && <G transform={`translate(${r - 14 * 1.1667} ${r - 14 * 1.1667}) scale(1.1667)`}>{children}</G>}
      </Svg>
    </Animated.View>
  );
}

function PulsingDot({ cx, cy, r, fill, delayMs, durMs }) {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0.9)).current;
  useEffect(() => {
    const seq = Animated.sequence([
      Animated.delay(delayMs),
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(scale, { toValue: 1.56, duration: durMs * 0.5, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
            Animated.timing(opacity, { toValue: 1, duration: durMs * 0.5, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          ]),
          Animated.parallel([
            Animated.timing(scale, { toValue: 1, duration: durMs * 0.5, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
            Animated.timing(opacity, { toValue: 0.9, duration: durMs * 0.5, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          ]),
        ])
      ),
    ]);
    seq.start();
    return () => seq.stop();
  }, []);
  const sz = r * 2;
  return (
    <Animated.View style={{
      position: 'absolute', left: cx - r, top: cy - r,
      width: sz, height: sz, transform: [{ scale }], opacity,
    }}>
      <Svg width={sz} height={sz} viewBox={`0 0 ${sz} ${sz}`}>
        <Circle cx={r} cy={r} r={r} fill={fill} />
      </Svg>
    </Animated.View>
  );
}

function NodeIcon({ type, stroke, fill, accent }) {
  switch(type) {
    case 0: return (<G fill="none" stroke={stroke} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.7-.8 1.7-1.7 0-.4-.2-.8-.4-1.1-.3-.3-.4-.7-.4-1.1 0-.9.8-1.7 1.7-1.7h2c3.1 0 5.6-2.5 5.6-5.6C22 6 17.5 2 12 2z" />
      <Circle cx={13.5} cy={6.5} r={1.4} fill={fill} stroke="none" /><Circle cx={17.5} cy={10.5} r={1.4} fill={fill} stroke="none" />
      <Circle cx={8.5} cy={7.5} r={1.4} fill={fill} stroke="none" /><Circle cx={6.5} cy={12.5} r={1.4} fill={fill} stroke="none" />
    </G>);
    case 1: return (<G fill="none" stroke={stroke} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <Rect x={3} y={7} width={18} height={13} rx={2} /><Path d="M8 7l2-3h4l2 3" /><Circle cx={12} cy={13.5} r={3.5} />
    </G>);
    case 2: return (<G fill="none" stroke={stroke} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <G transform="rotate(12 15 10)"><Path d="M10 4.5c3-1.2 7-1.2 10 0 .4 4.8-.6 9.6-5 11.5-4.4-1.9-5.4-6.7-5-11.5z" />
      <Path d="M11.8 7.6c.8-.5 1.6-.5 2.2.2M16 7.8c.6-.7 1.4-.7 2.2-.2M12.8 12.6c1.3-1 3.1-1 4.4 0" /></G>
      <G transform="rotate(-12 9 13.5)"><Path d="M4 8c3-1.2 7-1.2 10 0 .4 4.8-.6 9.6-5 11.5C4.6 17.6 3.6 12.8 4 8z" fill={fill} />
      <Path d="M5.6 11c.7-.7 1.5-.7 2.2 0M10.2 11c.7-.7 1.5-.7 2.2 0M6.3 14.2c1.4 1.6 3.4 1.6 4.8 0" stroke={accent} strokeWidth={1.5} /></G>
    </G>);
    case 3: return (<G fill="none" stroke={stroke} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M9 18V5l11-2v13" /><Circle cx={6} cy={18} r={3} /><Circle cx={17} cy={16} r={3} />
    </G>);
    case 4: return (<G fill="none" stroke={stroke} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M17 21a1 1 0 0 0 1-1v-5.35c0-.457.316-.844.727-1.041a4 4 0 0 0-2.134-7.589 5 5 0 0 0-9.186 0 4 4 0 0 0-2.134 7.588c.411.198.727.585.727 1.041V20a1 1 0 0 0 1 1z" />
      <Path d="M6 17h12" />
    </G>);
    case 5: return (<G fill="none" stroke={stroke} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx={12} cy={4.2} r={2.3} fill={fill} stroke="none" />
      <Path d="M9.6 7.2c-1 .2-1.6 1-1.9 2L6 14.2c-.2.6.2 1.2.8 1.3.5.1 1-.2 1.2-.7L9.6 10.6 10 13.6h4l.4-3 1.6 4.2c.2.5.7.8 1.2.7.6-.1 1-.7.8-1.3l-1.7-5c-.3-1-.9-1.8-1.9-2z" fill={fill} stroke="none" />
      <Path d="M3 17.6c0-2 4-3.4 9-3.4s9 1.4 9 3.4-4 2.6-9 2.6-9-.6-9-2.6z" fill={fill} stroke="none" />
    </G>);
    case 6: return (<G fill="none" stroke={stroke} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx={13} cy={3.5} r={2.1} fill={fill} stroke="none" />
      <Path d="M12.2 6.3c-.9.2-1.4 1-1.3 1.9l.4 3.3-4.3 6.2c-.3.5 0 1.1.6 1.1h8.9c.6 0 .9-.6.6-1.1L13.9 11.4l.1-3.2c0-1-.7-1.9-1.8-1.9z" fill={fill} stroke="none" />
      <Path d="M11.6 7.8L7 4.4M13.9 8l4.4 1.8M10.6 18.8l-1.4 3M14.2 18.8l3.6 2.4" strokeWidth={1.9} />
    </G>);
    case 7: return (<G fill="none" stroke={stroke} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M15.7 3.3l5 5L18 11l-5-5z" /><Path d="M13 6L6.5 7.6 3 21l13.4-3.5L18 11" />
      <Line x1={3} y1={21} x2={9.5} y2={14.5} /><Circle cx={11} cy={13} r={2} />
    </G>);
    default: return null;
  }
}

const NODE_ICONS = [0,1,2,3,4,5,6,7,null];

export function AntologicoSpinner({ width = 280, theme = 'light' }) {
  const VW = 816, VH = 497;
  const s = width / VW;
  const h = width * (VH / VW);
  const nodeR = 29 * s;
  const dotR = 6 * s;

  const t = theme === 'coral'
    ? { edge:'#FFF', eo:0.85, n:['#FFF','#F5C6BD'], hub:'#FFF', text:'#FFF', istr:'#C4412F', ifil:'#C4412F', accent:'#F5C6BD' }
    : { edge:'#A88C74', eo:1, n:['#E35D4A','#B8923A'], hub:'#B8923A', text:'#221C18', istr:'#FFF', ifil:'#FFF', accent:'#B8923A' };

  return (
    <View style={{ width, height: h }}>
      <Svg width={width} height={h} viewBox={`0 0 ${VW} ${VH}`}>
        <G stroke={t.edge} strokeWidth={2.8} strokeLinecap="round" strokeDasharray="0.1 6.5" fill="none" opacity={t.eo}>
          {LOADER_EDGES.map(([x1,y1,x2,y2], i) => <Line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />)}
        </G>
        <SvgText x="78" y="335" fill={t.text} fontFamily="serif" fontWeight="600" fontSize="134" textLength="672" lengthAdjust="spacing">
          Antológico
        </SvgText>
      </Svg>

      {SMALL_DOTS.map((d, i) => (
        <PulsingDot key={`d${i}`} cx={d.cx * s} cy={d.cy * s} r={dotR} fill={t.hub} delayMs={d.delay} durMs={d.dur} />
      ))}

      {BIG_NODES.map((n, i) => (
        <HeartbeatNode key={`n${i}`} cx={n.cx * s} cy={n.cy * s} r={nodeR} fill={t.n[n.fill]} delayMs={n.delay} durMs={n.dur}>
          {NODE_ICONS[i] !== null
            ? <NodeIcon type={NODE_ICONS[i]} stroke={t.istr} fill={t.ifil} accent={t.accent} />
            : <SvgText x={14} y={20} textAnchor="middle" fontFamily="serif" fontStyle="italic" fontWeight="500" fontSize={15} fill={t.ifil} stroke="none">∫cos(x)</SvgText>
          }
        </HeartbeatNode>
      ))}
    </View>
  );
}

export function AntologicoButtonSpinner({ size = 24 }) {
  const scale = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.2, duration: 380, easing: Easing.out(Easing.ease), useNativeDriver: true }),
        Animated.timing(scale, { toValue: 0.9, duration: 320, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1.15, duration: 360, easing: Easing.out(Easing.ease), useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();
  }, []);
  return (
    <Animated.View style={{ width: size, height: size, transform: [{ scale }] }}>
      <Svg width={size} height={size} viewBox="0 0 48 48">
        <G stroke="#E85D4A" strokeWidth={1.8} strokeLinecap="round">
          <Line x1={13} y1={9} x2={31} y2={18} />
          <Line x1={13} y1={9} x2={10} y2={31} />
          <Line x1={31} y1={18} x2={30} y2={39} />
          <Line x1={10} y1={31} x2={30} y2={39} />
        </G>
        <Circle cx={13} cy={9} r={7} fill="#E85D4A" />
        <Circle cx={31} cy={18} r={9} fill="#B98527" />
        <Circle cx={10} cy={31} r={7} fill="#E85D4A" />
        <Circle cx={30} cy={39} r={5} fill="#E85D4A" />
      </Svg>
    </Animated.View>
  );
}

export function EfectivoIcon({ size = 18, color = '#2B241A' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <Rect x={2} y={6} width={20} height={12} rx={2} />
      <Circle cx={12} cy={12} r={2.5} />
      <Path d="M6 12h.01M18 12h.01" />
    </Svg>
  );
}

export function LinkIcon({ size = 16, color = '#2B241A' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <Path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </Svg>
  );
}

export function MercadoPagoIcon({ size = 18, color = '#2B241A' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <Rect x={2} y={4} width={20} height={16} rx={2} />
      <Path d="M2 10h20" />
      <Path d="M6 14h4M14 14h4" />
    </Svg>
  );
}
