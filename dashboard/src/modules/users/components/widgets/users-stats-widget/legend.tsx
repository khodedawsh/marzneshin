import { FC } from 'react'
import { scaleOrdinal } from '@visx/scale';
import { LegendOrdinal, LegendItem, LegendLabel } from '@visx/legend';

const legendGlyphSize = 15;

const ordinalColorScale = scaleOrdinal({
    domain: ["Active", "Online", "Expired", "On Hold", "Limited"],
    range: ['#3b82f6', '#10b981', '#4b5563', '#A855F7', '#ef4444'],
});

export const UsersStatsLegend: FC = () => {
    return (
        <LegendOrdinal scale={ordinalColorScale}>
            {(labels) => (
                <div className="border border-solid border-[rgba(255, 255, 255, 0.3)] rounded-lg flex flex-row flex-wrap md:flex-col h-full p-3">
                    {labels.map((label, i) => (
                        <LegendItem
                            key={`legend-quantile-${i}`}
                            margin="0 5px"
                        >
                            <svg width={legendGlyphSize} height={legendGlyphSize}>
                                <circle
                                    className="rounded-full"
                                    fill={label.value}
                                    r={legendGlyphSize / 2}
                                    cx={legendGlyphSize / 2}
                                    cy={legendGlyphSize / 2}
                                />
                            </svg>
                            <LegendLabel align="left" margin="0 0 0 4px">
                                {label.text}
                            </LegendLabel>
                        </LegendItem>
                    ))}
                </div>
            )}
        </LegendOrdinal>
    )
}
