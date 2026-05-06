import React from 'react';
import { getPanelShutters } from '../elementTypes';

export default function WindowDrawing({ pos, size = 360, showDims = true }) {
  const PAD_LEFT   = showDims ? 60 : 10;
  const PAD_RIGHT  = showDims ? 30 : 10;
  const PAD_TOP    = showDims ? 20 : 10;
  const PAD_BOTTOM = showDims ? 50 : 10;
  const drawW = size - PAD_LEFT - PAD_RIGHT;
  const drawH = size - PAD_TOP - PAD_BOTTOM;

  const panelShutters = getPanelShutters(pos);
  const anyShutter = panelShutters.some(Boolean);
  const shutterBoxH = anyShutter ? (pos.shutterBoxHeight || 200) : 0;
  const scale = Math.min(drawW / pos.width, drawH / (pos.height + shutterBoxH));
  const w = pos.width * scale;
  const h = pos.height * scale;
  const shutterH = shutterBoxH * scale;
  const x0 = PAD_LEFT + (drawW - w) / 2;
  const y0 = PAD_TOP + (drawH - (h + shutterH)) / 2;
  const winY0 = y0 + shutterH;

  const FRAME_MM = 70;
  const f = FRAME_MM * scale;

  const openingSymbol = (cx, cy, panelW, panelH, opening) => {
    if (opening === 'fixed') return null;
    const lines = [];
    const innerL = cx - panelW / 2;
    const innerR = cx + panelW / 2;
    const innerT = cy - panelH / 2;
    const innerB = cy + panelH / 2;
    if (opening === 'leftTT') {
      lines.push(`M ${innerR} ${innerT} L ${innerL} ${cy} L ${innerR} ${innerB}`);
      lines.push(`M ${innerL} ${innerT} L ${cx} ${innerB} L ${innerR} ${innerT}`);
    } else if (opening === 'rightTT') {
      lines.push(`M ${innerL} ${innerT} L ${innerR} ${cy} L ${innerL} ${innerB}`);
      lines.push(`M ${innerL} ${innerT} L ${cx} ${innerB} L ${innerR} ${innerT}`);
    } else if (opening === 'tilt') {
      lines.push(`M ${innerL} ${innerT} L ${cx} ${innerB} L ${innerR} ${innerT}`);
    } else if (opening === 'leftOpen') {
      lines.push(`M ${innerR} ${innerT} L ${innerL} ${cy} L ${innerR} ${innerB}`);
    } else if (opening === 'rightOpen') {
      lines.push(`M ${innerL} ${innerT} L ${innerR} ${cy} L ${innerL} ${innerB}`);
    } else if (opening === 'bottomHung') {
      lines.push(`M ${innerL} ${innerB} L ${cx} ${innerT} L ${innerR} ${innerB}`);
    } else if (opening === 'topHung') {
      lines.push(`M ${innerL} ${innerT} L ${cx} ${innerB} L ${innerR} ${innerT}`);
    }
    return lines;
  };

  const drawSash = (panelX, panelY, panelW, panelH, opening, key, isSlide = false) => {
    const sashF = 50 * scale;
    const innerX = panelX + sashF;
    const innerY = panelY + sashF;
    const innerW = panelW - 2 * sashF;
    const innerH = panelH - 2 * sashF;
    const cx = panelX + panelW / 2;
    const cy = panelY + panelH / 2;
    const symbols = openingSymbol(cx, cy, innerW * 0.85, innerH * 0.85, opening);
    return (
      <g key={key}>
        <rect x={panelX} y={panelY} width={panelW} height={panelH} fill="none" stroke="#1a1a1a" strokeWidth="0.7" />
        <rect x={innerX} y={innerY} width={innerW} height={innerH} fill="#dbeafe" stroke="#1a1a1a" strokeWidth="0.5" opacity="0.8" />
        {pos.hasMosquitoNet && (
          <rect x={innerX} y={innerY} width={innerW} height={innerH} fill="url(#mosquito-mesh)" opacity="0.4" />
        )}
        {!isSlide && opening !== 'fixed' && opening !== 'tilt' && (
          <circle
            cx={opening === 'leftTT' || opening === 'leftOpen' ? panelX + panelW - sashF / 2 : panelX + sashF / 2}
            cy={cy}
            r="2.5"
            fill="#1a1a1a"
          />
        )}
        {symbols && symbols.map((d, i) => (
          <path key={i} d={d} fill="none" stroke="#1a1a1a" strokeWidth="0.6" />
        ))}
        {isSlide && opening === 'leftSlide' && (
          <g stroke="#1a1a1a" strokeWidth="1" fill="none">
            <line x1={cx + 15} y1={cy} x2={cx - 15} y2={cy} />
            <polyline points={`${cx - 10},${cy - 4} ${cx - 15},${cy} ${cx - 10},${cy + 4}`} />
          </g>
        )}
        {isSlide && opening === 'rightSlide' && (
          <g stroke="#1a1a1a" strokeWidth="1" fill="none">
            <line x1={cx - 15} y1={cy} x2={cx + 15} y2={cy} />
            <polyline points={`${cx + 10},${cy - 4} ${cx + 15},${cy} ${cx + 10},${cy + 4}`} />
          </g>
        )}
      </g>
    );
  };

  const elements = [];

  if (anyShutter) {
    const getPanelBoxes = () => {
      const ratio = pos.divisionRatio || 0.5;
      const divs = pos.divisions || [0.33, 0.33, 0.34];
      if (pos.type === 'double' || pos.type === 'doubleDoor' || pos.type === 'windowDoor' || pos.type === 'sliding') {
        return [{ px: x0, pw: w * ratio }, { px: x0 + w * ratio, pw: w * (1 - ratio) }];
      } else if (pos.type === 'triple' || pos.type === 'sliding3') {
        return [
          { px: x0, pw: w * divs[0] },
          { px: x0 + w * divs[0], pw: w * divs[1] },
          { px: x0 + w * (divs[0] + divs[1]), pw: w * divs[2] },
        ];
      } else if (pos.type === 'sideLight') {
        const slW = Math.min((pos.sideLightWidth || 500) * scale, w - 10 * scale);
        const mainW = w - slW;
        return (pos.sideLightPosition || 'right') === 'right'
          ? [{ px: x0, pw: mainW }, { px: x0 + mainW, pw: slW }]
          : [{ px: x0, pw: slW }, { px: x0 + slW, pw: mainW }];
      }
      return [{ px: x0, pw: w }];
    };
    const boxes = getPanelBoxes();
    const fill = pos.shutterBoxType === 'inside' ? '#f0f0f0' : 'white';
    elements.push(
      <g key="shutter-box">
        {boxes.map(({ px, pw }, i) => panelShutters[i] && (
          <g key={i}>
            <rect x={px} y={y0} width={pw} height={shutterH} fill={fill} stroke="#1a1a1a" strokeWidth="1.2" />
            <line x1={px} y1={y0 + shutterH / 2} x2={px + pw} y2={y0 + shutterH / 2}
              stroke="#1a1a1a" strokeWidth="0.4" strokeDasharray="3,2" />
            <text x={px + pw / 2} y={y0 + shutterH / 2 + 2.5}
              textAnchor="middle" fontSize="7" fill="#1a1a1a">ROL</text>
          </g>
        ))}
      </g>
    );
  }

  elements.push(
    <rect key="frame" x={x0} y={winY0} width={w} height={h} fill="white" stroke="#1a1a1a" strokeWidth="1.2" />
  );
  elements.push(
    <rect key="frame-in" x={x0 + f} y={winY0 + f} width={w - 2 * f} height={h - 2 * f} fill="none" stroke="#1a1a1a" strokeWidth="0.5" opacity="0.4" />
  );

  const innerW = w - 2 * f;
  const innerH = h - 2 * f;
  const innerX = x0 + f;
  const innerY = winY0 + f;

  if (pos.type === 'single' || pos.type === 'door' || pos.type === 'fixed') {
    elements.push(drawSash(innerX, innerY, innerW, innerH, pos.opening, 'panel'));
  } else if (pos.type === 'double') {
    const ratio = pos.divisionRatio || 0.5;
    const w1 = innerW * ratio;
    const w2 = innerW - w1;
    const po = pos.panelOpenings || ['leftTT', 'rightTT'];
    elements.push(drawSash(innerX, innerY, w1, innerH, po[0], 'p1'));
    elements.push(drawSash(innerX + w1, innerY, w2, innerH, po[1], 'p2'));
  } else if (pos.type === 'doubleDoor') {
    const ratio = pos.divisionRatio || 0.5;
    const w1 = innerW * ratio;
    const w2 = innerW - w1;
    const sashF = 50 * scale;
    const cx = innerX + w1;
    const po = pos.panelOpenings || ['leftTT', 'rightTT'];
    elements.push(drawSash(innerX, innerY, w1, innerH, po[0], 'dd-l'));
    elements.push(drawSash(cx, innerY, w2, innerH, po[1], 'dd-r'));
    elements.push(
      <g key="dd-center">
        <rect x={cx - sashF} y={innerY} width={sashF * 2} height={innerH} fill="white" />
        <line x1={cx} y1={innerY} x2={cx} y2={innerY + innerH} stroke="#1a1a1a" strokeWidth="0.7" />
      </g>
    );
  } else if (pos.type === 'windowDoor') {
    const ratio = pos.divisionRatio || 0.5;
    const w1 = innerW * ratio;
    const w2 = innerW - w1;
    const po = pos.panelOpenings || ['leftTT', pos.opening];
    elements.push(drawSash(innerX, innerY, w1, innerH, po[0], 'p1'));
    elements.push(drawSash(innerX + w1, innerY, w2, innerH, po[1], 'p2'));
  } else if (pos.type === 'sliding') {
    const ratio = pos.divisionRatio || 0.5;
    const w1 = innerW * ratio;
    const w2 = innerW - w1;
    if (pos.opening === 'leftSlide') {
      elements.push(drawSash(innerX, innerY, w1, innerH, 'leftSlide', 'p1', true));
      elements.push(drawSash(innerX + w1, innerY, w2, innerH, 'fixed', 'p2'));
    } else {
      elements.push(drawSash(innerX, innerY, w1, innerH, 'fixed', 'p1'));
      elements.push(drawSash(innerX + w1, innerY, w2, innerH, 'rightSlide', 'p2', true));
    }
  } else if (pos.type === 'triple') {
    const divs = pos.divisions || [0.33, 0.33, 0.34];
    const wx1 = innerW * divs[0];
    const wx2 = innerW * divs[1];
    const wx3 = innerW * divs[2];
    const defaultPO = pos.opening === 'allTT' ? ['leftTT', 'rightTT', 'rightTT'] : ['leftTT', 'fixed', 'rightTT'];
    const po = pos.panelOpenings || defaultPO;
    elements.push(drawSash(innerX,             innerY, wx1, innerH, po[0],              'tp1'));
    elements.push(drawSash(innerX + wx1,       innerY, wx2, innerH, po[1],              'tp2'));
    elements.push(drawSash(innerX + wx1 + wx2, innerY, wx3, innerH, po[2] || 'rightTT', 'tp3'));
  } else if (pos.type === 'sideLight') {
    const slW = Math.min((pos.sideLightWidth || 500) * scale, innerW - 10 * scale);
    const mainW = innerW - slW;
    const isRight = (pos.sideLightPosition || 'right') === 'right';
    const defaultPO = isRight ? [pos.opening, 'fixed'] : ['fixed', pos.opening];
    const po = pos.panelOpenings || defaultPO;
    if (isRight) {
      elements.push(drawSash(innerX,         innerY, mainW, innerH, po[0], 'sl-p1'));
      elements.push(drawSash(innerX + mainW, innerY, slW,   innerH, po[1], 'sl-p2'));
    } else {
      elements.push(drawSash(innerX,         innerY, slW,   innerH, po[0], 'sl-p1'));
      elements.push(drawSash(innerX + slW,   innerY, mainW, innerH, po[1], 'sl-p2'));
    }
  } else if (pos.type === 'panelCombo') {
    const pH = (pos.panelHeight || 900) * scale;
    const glassH = innerH - pH;
    const panelY = innerY + glassH;
    elements.push(drawSash(innerX, innerY, innerW, glassH, pos.opening, 'pc-glass'));
    elements.push(
      <g key="pc-panel">
        <rect x={innerX} y={panelY} width={innerW} height={pH} fill="#e8e4dc" stroke="#1a1a1a" strokeWidth="0.7" />
        <line x1={innerX} y1={panelY} x2={innerX + innerW} y2={panelY} stroke="#1a1a1a" strokeWidth="0.9" />
      </g>
    );
  } else if (pos.type === 'sliding3') {
    const divs = pos.divisions || [0.33, 0.34, 0.33];
    const wx1 = innerW * divs[0];
    const wx2 = innerW * divs[1];
    const wx3 = innerW * divs[2];
    const op = pos.opening || 'centerSlide';
    elements.push(drawSash(innerX,             innerY, wx1, innerH, op === 'leftSlide'  ? 'leftSlide'  : 'fixed', 's3p1', op === 'leftSlide'));
    elements.push(drawSash(innerX + wx1,       innerY, wx2, innerH, 'fixed',                                       's3p2', false));
    elements.push(drawSash(innerX + wx1 + wx2, innerY, wx3, innerH, op === 'rightSlide' ? 'rightSlide' : 'fixed', 's3p3', op === 'rightSlide'));
    const slideCx = op === 'leftSlide'  ? innerX + wx1 / 2
                  : op === 'rightSlide' ? innerX + wx1 + wx2 + wx3 / 2
                  : innerX + wx1 + wx2 / 2;
    const slideCy = innerY + innerH / 2;
    elements.push(
      <g key="s3-arr" stroke="#1a1a1a" strokeWidth="1" fill="none">
        <line x1={slideCx - 15} y1={slideCy} x2={slideCx + 15} y2={slideCy} />
        <polyline points={`${slideCx - 10},${slideCy - 4} ${slideCx - 15},${slideCy} ${slideCx - 10},${slideCy + 4}`} />
        <polyline points={`${slideCx + 10},${slideCy - 4} ${slideCx + 15},${slideCy} ${slideCx + 10},${slideCy + 4}`} />
      </g>
    );
  } else if (pos.type === 'entryDoor') {
    const sashF = 50 * scale;
    const doorPanel = pos.doorPanel || 'fullPanel';
    const gx = innerX + sashF;
    const gy = innerY + sashF;
    const gw = innerW - 2 * sashF;
    const gh = innerH - 2 * sashF;
    elements.push(<rect key="ed-frame" x={innerX} y={innerY} width={innerW} height={innerH} fill="none" stroke="#1a1a1a" strokeWidth="0.7" />);
    if (doorPanel === 'fullPanel') {
      elements.push(<rect key="ed-fill" x={gx} y={gy} width={gw} height={gh} fill="#e8e4dc" stroke="#1a1a1a" strokeWidth="0.4" />);
    } else if (doorPanel === 'glassFull') {
      elements.push(<rect key="ed-fill" x={gx} y={gy} width={gw} height={gh} fill="#dbeafe" stroke="#1a1a1a" strokeWidth="0.4" opacity="0.8" />);
    } else if (doorPanel === 'panelGlass') {
      const glassH = Math.min((pos.glassPanelHeight || 600) * scale, gh - 10 * scale);
      elements.push(<rect key="ed-glass" x={gx} y={gy} width={gw} height={glassH} fill="#dbeafe" stroke="#1a1a1a" strokeWidth="0.4" opacity="0.8" />);
      elements.push(<rect key="ed-panel" x={gx} y={gy + glassH} width={gw} height={gh - glassH} fill="#e8e4dc" stroke="#1a1a1a" strokeWidth="0.4" />);
      elements.push(<line key="ed-div" x1={gx} y1={gy + glassH} x2={gx + gw} y2={gy + glassH} stroke="#1a1a1a" strokeWidth="0.7" />);
    }
    const knobY = winY0 + h - 1050 * scale;
    const knobW = 60 * scale;
    const knobH = 10 * scale;
    const knobX = (pos.opening || 'rightDoor') === 'rightDoor' ? innerX + innerW - knobW : innerX;
    elements.push(<rect key="ed-knob" x={knobX} y={knobY - knobH / 2} width={knobW} height={knobH} fill="#1a1a1a" rx="1" />);
  } else if (pos.type === 'transom') {
    const tH = (pos.transomHeight || 400) * scale;
    elements.push(
      <line key="trans" x1={innerX} y1={innerY + tH} x2={innerX + innerW} y2={innerY + tH} stroke="#1a1a1a" strokeWidth="0.7" />
    );
    elements.push(drawSash(innerX, innerY, innerW, tH, 'fixed', 'tr-top'));
    elements.push(drawSash(innerX, innerY + tH, innerW, innerH - tH, pos.opening, 'tr-bot'));
  }

  const dimOffsetX = 32;
  const dimOffsetY = 28;

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full" style={{ fontFamily: 'Geist Mono, ui-monospace, monospace', fontSize: '10px' }}>
      <defs>
        <pattern id="mosquito-mesh" width="8" height="8" patternUnits="userSpaceOnUse">
          <path d="M 0 0 L 8 0" fill="none" stroke="#4a4a4a" strokeWidth="0.5" />
          <path d="M 0 0 L 0 8" fill="none" stroke="#4a4a4a" strokeWidth="0.5" />
        </pattern>
      </defs>
      {elements}

      {showDims && <>
      {/* horizontalna kota */}
      <g stroke="#1a1a1a" strokeWidth="0.4">
        <line x1={x0} y1={winY0 + h + dimOffsetY - 6} x2={x0} y2={winY0 + h + dimOffsetY + 6} />
        <line x1={x0 + w} y1={winY0 + h + dimOffsetY - 6} x2={x0 + w} y2={winY0 + h + dimOffsetY + 6} />
        <line x1={x0} y1={winY0 + h + dimOffsetY} x2={x0 + w} y2={winY0 + h + dimOffsetY} />
        <polygon points={`${x0},${winY0 + h + dimOffsetY} ${x0 + 5},${winY0 + h + dimOffsetY - 2} ${x0 + 5},${winY0 + h + dimOffsetY + 2}`} fill="#1a1a1a" />
        <polygon points={`${x0 + w},${winY0 + h + dimOffsetY} ${x0 + w - 5},${winY0 + h + dimOffsetY - 2} ${x0 + w - 5},${winY0 + h + dimOffsetY + 2}`} fill="#1a1a1a" />
      </g>
      <text x={x0 + w / 2} y={winY0 + h + dimOffsetY + 14} textAnchor="middle" fill="#1a1a1a">{pos.width}</text>

      {/* vertikalna kota */}
      <g stroke="#1a1a1a" strokeWidth="0.4">
        <line x1={x0 - dimOffsetX - 6} y1={y0} x2={x0 - dimOffsetX + 6} y2={y0} />
        <line x1={x0 - dimOffsetX - 6} y1={winY0 + h} x2={x0 - dimOffsetX + 6} y2={winY0 + h} />
        <line x1={x0 - dimOffsetX} y1={y0} x2={x0 - dimOffsetX} y2={winY0 + h} />
        <polygon points={`${x0 - dimOffsetX},${y0} ${x0 - dimOffsetX - 2},${y0 + 5} ${x0 - dimOffsetX + 2},${y0 + 5}`} fill="#1a1a1a" />
        <polygon points={`${x0 - dimOffsetX},${winY0 + h} ${x0 - dimOffsetX - 2},${winY0 + h - 5} ${x0 - dimOffsetX + 2},${winY0 + h - 5}`} fill="#1a1a1a" />
      </g>
      <text x={x0 - dimOffsetX - 8} y={y0 + (shutterH + h) / 2} textAnchor="middle" fill="#1a1a1a" transform={`rotate(-90, ${x0 - dimOffsetX - 8}, ${y0 + (shutterH + h) / 2})`}>{pos.height + shutterBoxH}</text>

      {/* sub-kote za triple i sliding3 */}
      {(pos.type === 'triple' || pos.type === 'sliding3') && (() => {
        const divs = pos.divisions || [0.33, 0.33, 0.34];
        const w1mm = Math.round(pos.width * divs[0]);
        const w2mm = Math.round(pos.width * divs[1]);
        const w3mm = pos.width - w1mm - w2mm;
        const subY = winY0 + h + dimOffsetY - 16;
        const x1 = x0 + w * divs[0];
        const x2 = x0 + w * (divs[0] + divs[1]);
        return (
          <g stroke="#1a1a1a" strokeWidth="0.3" fill="#1a1a1a">
            <line x1={x0} y1={subY - 6} x2={x0} y2={subY + 2} />
            <line x1={x1} y1={subY - 6} x2={x1} y2={subY + 2} />
            <line x1={x2} y1={subY - 6} x2={x2} y2={subY + 2} />
            <line x1={x0 + w} y1={subY - 6} x2={x0 + w} y2={subY + 2} />
            <text x={x0 + w * divs[0] / 2} y={subY} textAnchor="middle" fontSize="8">{w1mm}</text>
            <text x={x1 + w * divs[1] / 2} y={subY} textAnchor="middle" fontSize="8">{w2mm}</text>
            <text x={x2 + w * divs[2] / 2} y={subY} textAnchor="middle" fontSize="8">{w3mm}</text>
          </g>
        );
      })()}

      {/* sub-kote za double/sliding/windowDoor/doubleDoor */}
      {(pos.type === 'double' || pos.type === 'sliding' || pos.type === 'windowDoor' || pos.type === 'doubleDoor') && (() => {
        const ratio = pos.divisionRatio || 0.5;
        const w1mm = Math.round(pos.width * ratio);
        const w2mm = pos.width - w1mm;
        const subY = winY0 + h + dimOffsetY - 16;
        return (
          <g stroke="#1a1a1a" strokeWidth="0.3" fill="#1a1a1a">
            <line x1={x0} y1={subY - 6} x2={x0} y2={subY + 2} />
            <line x1={x0 + w * ratio} y1={subY - 6} x2={x0 + w * ratio} y2={subY + 2} />
            <line x1={x0 + w} y1={subY - 6} x2={x0 + w} y2={subY + 2} />
            <text x={x0 + (w * ratio) / 2} y={subY} textAnchor="middle" fontSize="8">{w1mm}</text>
            <text x={x0 + w * ratio + (w - w * ratio) / 2} y={subY} textAnchor="middle" fontSize="8">{w2mm}</text>
          </g>
        );
      })()}

      {/* sub-kota za nadsvjetlo */}
      {pos.type === 'transom' && (() => {
        const tH = pos.transomHeight || 400;
        const subX = x0 - dimOffsetX + 14;
        const tHscaled = tH * scale;
        return (
          <g stroke="#1a1a1a" strokeWidth="0.3" fill="#1a1a1a">
            <line x1={subX - 4} y1={winY0 + f} x2={subX + 2} y2={winY0 + f} />
            <line x1={subX - 4} y1={winY0 + f + tHscaled} x2={subX + 2} y2={winY0 + f + tHscaled} />
            <text x={subX - 2} y={winY0 + f + tHscaled / 2 + 3} textAnchor="end" fontSize="8">{tH}</text>
            <text x={subX - 2} y={winY0 + f + tHscaled + (h - 2 * f - tHscaled) / 2 + 3} textAnchor="end" fontSize="8">{Math.round((pos.height - 2 * 70 - tH))}</text>
          </g>
        );
      })()}

      {/* sub-kota za panelCombo */}
      {pos.type === 'panelCombo' && (() => {
        const pHmm = pos.panelHeight || 900;
        const pHscaled = pHmm * scale;
        const glassHmm = pos.height - 2 * 70 - pHmm;
        const subX = x0 + w + 6;
        const topY = winY0 + f;
        const midY = winY0 + f + innerH - pHscaled;
        const botY = winY0 + f + innerH;
        return (
          <g stroke="#1a1a1a" strokeWidth="0.3" fill="#1a1a1a">
            <line x1={subX - 2} y1={topY} x2={subX + 6} y2={topY} />
            <line x1={subX - 2} y1={midY} x2={subX + 6} y2={midY} />
            <line x1={subX - 2} y1={botY} x2={subX + 6} y2={botY} />
            <line x1={subX + 2} y1={topY} x2={subX + 2} y2={botY} />
            <text x={subX + 8} y={topY + (midY - topY) / 2 + 3} textAnchor="start" fontSize="8">{glassHmm}</text>
            <text x={subX + 8} y={midY + pHscaled / 2 + 3} textAnchor="start" fontSize="8">{pHmm}</text>
          </g>
        );
      })()}

      {/* sub-kote za sideLight */}
      {pos.type === 'sideLight' && (() => {
        const slWmm  = pos.sideLightWidth || 500;
        const mainWmm = pos.width - slWmm;
        const isRight = (pos.sideLightPosition || 'right') === 'right';
        const subY = winY0 + h + dimOffsetY - 16;
        const divPx = isRight ? x0 + mainWmm * scale : x0 + slWmm * scale;
        const leftWmm  = isRight ? mainWmm : slWmm;
        const rightWmm = isRight ? slWmm   : mainWmm;
        return (
          <g stroke="#1a1a1a" strokeWidth="0.3" fill="#1a1a1a">
            <line x1={x0}     y1={subY - 6} x2={x0}     y2={subY + 2} />
            <line x1={divPx}  y1={subY - 6} x2={divPx}  y2={subY + 2} />
            <line x1={x0 + w} y1={subY - 6} x2={x0 + w} y2={subY + 2} />
            <text x={(x0 + divPx) / 2}     y={subY} textAnchor="middle" fontSize="8">{leftWmm}</text>
            <text x={(divPx + x0 + w) / 2} y={subY} textAnchor="middle" fontSize="8">{rightWmm}</text>
          </g>
        );
      })()}

      {/* sub-kota za roletnu */}
      {anyShutter && shutterH > 0 && (
        <g stroke="#1a1a1a" strokeWidth="0.3" fill="#1a1a1a">
          <line x1={x0 - 8} y1={y0}    x2={x0 - 2} y2={y0} />
          <line x1={x0 - 8} y1={winY0} x2={x0 - 2} y2={winY0} />
          <line x1={x0 - 5} y1={y0}    x2={x0 - 5} y2={winY0} />
          <text x={x0 - 16} y={y0 + shutterH / 2 + 3} textAnchor="middle" fontSize="8">{shutterBoxH}</text>
        </g>
      )}

      </>}
    </svg>
  );
}
