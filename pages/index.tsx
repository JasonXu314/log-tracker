import Link from 'next/link';
import { GetServerSideProps, NextPage } from 'next/types';
import { connect } from '../utils/db';

interface Props {
	applications: string[];
}

const Index: NextPage<Props> = ({ applications }) => {
	return (
		<div>
			<ul>
				{applications.map((app) => (
					<li key={app}>
						<Link href="/[application]" as={`/${app}`}>
							<a>{app}</a>
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
};

export const getServerSideProps: GetServerSideProps<Props> = async () => {
	const mongoClient = await connect();
	const applications = (await mongoClient.db('logs').collections()).map((coll) => coll.collectionName);

	return {
		props: {
			applications
		}
	};
};

export default Index;
