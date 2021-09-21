import crypto from 'crypto';
import { Collection } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { connect } from '../../utils/db';

export default async (req: NextApiRequest, res: NextApiResponse<ApplicationGetResponse | ApplicationPostResponse | ErrorResponse>): Promise<void> => {
	const mongoClient = await connect();
	const application = req.query.application as string;

	switch (req.method) {
		case 'GET': {
			const collections = await mongoClient.db('logs').collections();
			const collection = collections.find((coll) => coll.collectionName === application) as unknown as Collection<DBLogMessage>;

			if (collection) {
				res.status(200).json({ logs: await collection.find({}, { projection: { _id: 0 } }).toArray() });
			} else {
				res.status(404).json({ reason: 'No application with that name found' });
			}
			return;
		}
		case 'POST': {
			const collections = await mongoClient.db('logs').collections();
			const collection = collections.find((coll) => coll.collectionName === application) as unknown as Collection<DBLogMessage>;

			const newMsg = req.body as Partialize<LogMessage, 'id' | 'timestamp' | 'dump'>;

			if (!newMsg.message) {
				res.status(400).json({ reason: 'Message is required' });
				return;
			}

			if (newMsg.application !== application) {
				if (!newMsg.application) {
					newMsg.application = application;
				} else {
					res.status(400).json({ reason: 'Application in message object and application in request message do not match' });
					return;
				}
			}

			if (!newMsg.id) {
				newMsg.id = crypto.randomUUID();
			}
			if (!newMsg.timestamp) {
				newMsg.timestamp = new Date().toUTCString();
			}
			if (!newMsg.dump) {
				newMsg.dump = null;
			}

			if (collection) {
				await collection.insertOne(newMsg as DBLogMessage);

				res.status(201).json({ type: 'success' });
			} else {
				res.status(404).json({ reason: 'No application with that name found' });
			}
			return;
		}
		default: {
			res.status(405).json({ reason: 'Method Not Allowed' });
		}
	}
};
