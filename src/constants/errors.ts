
export enum AuthErrors {
  UNAUTHORIZED=  'Unauthorized' ,
  MISSING_API_KEY=  'Missing API key',
  INVALID_USER_ID= 'Invalid user',
  INVALID_TOKEN= 'Invalid token',
  EXPIRED_TOKEN= 'jwt expired',
};
  
export enum ServerErrors{
  INTERNAL_SERVER=  'Internal server error',
  INVALID_DB_URL= 'Invalid database URL',
  NO_DOCS_FOUND='No documents found matching the query'
};

export enum JobErrors {
  INVALID_JOB_ID= 'Missing jobId' ,
  JOB_NOT_FOUND=  'Job not found' ,
  JOB_NOT_ADDED= 'Job not added error',
  MISSING_JOB_NAME='Missing job name',
}

export enum ServiceUsageErrors  {
  EXCEEDED_FREE_LIMIT= 'Exceeded free usage limit',  
  EXCEEDED_PLAN_LIMIT= 'Exceeded plan limit',
  FAILED_USAGE_CHECK= 'Unknown error checking usage',
  FAILED_DAILY_USAGE_CHECK= 'Failed to retrieve daily usage count',
  FAILED_MONTHLY_USAGE_CHECK= 'Failed to retrieve monthly usage count',
  FAILED_TOTAL_USAGE_CHECK= 'Failed to retrieve total usage count'
};