import { useState } from 'react';
import Arrow from '../Arrow/Arrow';
import styles from './MessageItem.module.scss';

interface Props {
	message: LogMessage;
}

const MessageItem: React.FC<Props> = ({ message }) => {
	const [open, setOpen] = useState<boolean>(false);

	return (
		<li className={styles.main}>
			<div onClick={() => setOpen(!open)} className={styles['control-bar']}>
				<Arrow direction={open ? 'down' : 'right'} />
				{!open && <span className={styles.short}>{message.message}</span>}
			</div>
			{open && (
				<div className={styles.details}>
					<span>
						<h4>Message:</h4> {message.message}
					</span>
					<span>
						<h4>Time:</h4> {message.timestamp}
					</span>
					<br />
					{message.dump && (
						<>
							<h4>Dump:</h4>
							<pre className={styles.dump}>{JSON.stringify(message.dump, null, 2)}</pre>
						</>
					)}
				</div>
			)}
		</li>
	);
};

export default MessageItem;
