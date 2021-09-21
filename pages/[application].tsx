import axios from 'axios';
import { Collection } from 'mongodb';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import { GetServerSideProps, NextPage } from 'next/types';
import useSWR, { Fetcher } from 'swr';
import MessageItem from '../components/MessageItem/MessageItem';
import styles from '../styles/Application.module.scss';
import { connect } from '../utils/db';

interface Props {
	initLogs: LogMessage[];
}

const fetcher: Fetcher<LogMessage[]> = async (url: string) => {
	return await axios
		.get<ApplicationGetResponse>(url)
		.then((res) => res.data.logs)
		.catch(() => fetcher(url));
};

const Application: NextPage<Props> = ({ initLogs }) => {
	const router = useRouter();
	const { data: logs } = useSWR(`/api/${router.query.application}`, fetcher, {
		fallbackData: initLogs,
		revalidateOnFocus: true,
		revalidateOnReconnect: true,
		refreshInterval: 5000
	});

	return (
		<div className={styles.main}>
			<Head>
				<title>Log Tracker | {router.query.application}</title>
			</Head>
			<ul className={styles.list}>
				{logs?.map((log) => (
					<MessageItem message={log} key={log.id} />
				))}
			</ul>
		</div>
	);
};

export const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
	const application = query.application as string;
	const mongoClient = await connect();

	const collections = await mongoClient.db('logs').collections();
	const collection = collections.find((coll) => coll.collectionName === application) as unknown as Collection<DBLogMessage>;

	if (collection) {
		const initLogs = await collection.find({}, { projection: { _id: 0 } }).toArray();

		return {
			props: {
				initLogs
			}
		};
	} else {
		return {
			notFound: true
		};
	}
};

export default Application;
