interface ScoreRingProps {
  score: number
  size?: number
  strokeWidth?: number
  className?: string
}

export function ScoreRing({ score, size = 80, strokeWidth = 6, className = '' }: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  const color =
    score >= 80 ? '#34d399' : score >= 60 ? '#3b82f6' : score >= 40 ? '#fbbf24' : '#64748b'

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        aria-label={`Score de compatibilité : ${score}%`}
      >
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      {/* Label */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="font-bold tabular-nums"
          style={{ fontSize: size * 0.2, color }}
        >
          {score}%
        </span>
      </div>
    </div>
  )
}
