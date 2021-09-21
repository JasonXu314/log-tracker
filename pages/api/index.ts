import { NextApiRequest, NextApiResponse } from 'next';
import { connect } from '../../utils/db';

export default async (req: NextApiRequest, res: NextApiResponse<IndexPostResponse | ErrorResponse>): Promise<void> => {
	const mongoClient = await connect();

	switch (req.method) {
		case 'POST': {
			const application = req.body.application as string | undefined;

			if (!application) {
				res.status(400).json({ reason: 'Application is required' });
				return;
			}

			await mongoClient.db('logs').createCollection(application);

			res.status(201).json({ type: 'success' });
			return;
		}
		default: {
			res.status(405).json({ reason: 'Method Not Allowed' });
		}
	}
};
