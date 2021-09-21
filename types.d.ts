type ObjectId = import('mongodb').ObjectId;

type Partialize<T, K extends string> = Omit<T, K> & Partial<Pick<T, K>>;

type LogMessage = {
	id: string;
	application: string;
	message: string;
	timestamp: string;
	dump: Record<string, any> | null;
};

type DBLogMessage = LogMessage & { _id: ObjectId };

type ApplicationGetResponse = {
	logs: LogMessage[];
};

type ApplicationPostResponse = {
	type: 'success';
};

type IndexPostResponse = {
	type: 'success';
};

type ErrorResponse = {
	reason: string;
};
