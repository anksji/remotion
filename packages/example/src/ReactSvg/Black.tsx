import {useVideoConfig} from '@remotion/core';
import React from 'react';

export const Black: React.FC<{
	scale: number;
}> = ({scale}) => {
	const config = useVideoConfig();
	return (
		<svg
			viewBox={`0 0 ${config.width} ${config.height}`}
			style={{
				position: 'absolute',
				transform: `scale(${0.8})`,
				opacity: scale,
			}}
		>
			<circle r={70} cx={config.width / 2} cy={config.height / 2} fill="#000" />
		</svg>
	);
};
