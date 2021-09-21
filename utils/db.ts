import { MongoClient } from 'mongodb';

let client: MongoClient;

export async function connect() {
	if (client) {
		return client;
	}

	client = await MongoClient.connect(process.env.MONGODB_URL!).catch(() => connect());

	return client;
}
