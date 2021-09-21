interface Props {
	direction: 'down' | 'right';
}

const Arrow: React.FC<Props> = ({ direction }) => {
	switch (direction) {
		case 'down':
			return (
				<svg width={12} height={12}>
					<path d="M 0,0 L 6,12 L 12,0 z" fill="black" />
				</svg>
			);
		case 'right':
			return (
				<svg width={12} height={12}>
					<path d="M 0,0 L 12,6 L 0,12 z" fill="black" />
				</svg>
			);
	}
};

export default Arrow;
