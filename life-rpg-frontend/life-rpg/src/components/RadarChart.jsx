export default function RadarChart({ data, size = 220 }) {
  const center = size / 2;
  const radius = size / 2 - 28;
  const angleStep = (Math.PI * 2) / data.length;

  const pointFor = (i, value) => {
    const angle = angleStep * i - Math.PI / 2;
    const r = (value / 100) * radius;
    return [center + r * Math.cos(angle), center + r * Math.sin(angle)];
  };

  const polygonPoints = data.map((d, i) => pointFor(i, d.value).join(',')).join(' ');
  const rings = [0.25, 0.5, 0.75, 1];

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {rings.map((r) => (
        <polygon
          key={r}
          points={data.map((_, i) => pointFor(i, r * 100).join(',')).join(' ')}
          fill="none"
          stroke="#E2E4F0"
          strokeWidth="1"
        />
      ))}
      {data.map((_, i) => {
        const [x, y] = pointFor(i, 100);
        return <line key={i} x1={center} y1={center} x2={x} y2={y} stroke="#E2E4F0" strokeWidth="1" />;
      })}
      <polygon points={polygonPoints} fill="#6C5CE7" fillOpacity="0.25" stroke="#6C5CE7" strokeWidth="2" />
      {data.map((d, i) => {
        const [x, y] = pointFor(i, d.value);
        return <circle key={i} cx={x} cy={y} r="3" fill="#5341cd" />;
      })}
      {data.map((d, i) => {
        const [x, y] = pointFor(i, 118);
        return (
          <text
            key={d.label}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="10"
            fontWeight="800"
            letterSpacing="0.5"
            fill="#474554"
          >
            {d.label}
          </text>
        );
      })}
    </svg>
  );
}
