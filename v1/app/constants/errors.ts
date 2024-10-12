export enum AuthErrors  {
    MISSING_API_KEY = 'API key not provided',
    UNAUTHORIZED = 'Unauthorized access',
    MISSING_JWT_TOKEN = 'missing JWT token ',
    EXPIRED_TOKEN = 'jwt expired',
    INVALID_USER_ID = 'Invalid user',
    INVALID_LOGIN_CRED='Invalid login credentials'
  }

  export enum JobErrors {
    JOB_NOT_FOUND = 'Job not found',
    INVALID_JOB_ID = 'Invalid job ID',
    INVALID_JOB_RESULTS = 'Invalid job results'
  }

  export enum RequestErrors  {
    REQUEST_ERROR = 'Failed to make request',
    POLLING_ERROR = 'Failed to poll',
    MISSING_IMAGE = 'Missing image',
    NO_DOCS_FOUND = 'No documents found matching the query'

  }

  export enum ServiceUsageErrors {
    EXCEEDED_FREE_LIMIT = 'Exceeded free usage limit',  
    EXCEEDED_PLAN_LIMIT ='Exceeded plan limit',
    FAILED_USAGE_CHECK ='Unknown error checking usage',
    FAILED_DAILY_USAGE_CHECK= 'Failed to retrieve daily usage count',
    FAILED_MONTHLY_USAGE_CHECK='Failed to retrieve monthly usage count',
    FAILED_TOTAL_USAGE_CHECK='Failed to retrieve total usage count'
  };

  export enum MiscErrors  {
    EXCEEDED_FREE_LIMIT= 'Exceeded free usage limit',
    EXCEEDED_PLAN_LIMIT= 'Exceeded plan limit',
    UNKNOWN_ERROR= 'An unknown error occurred'
  }

  export enum ToolErrors {
    CHART_ANALYSIS ='Failed to analyse chart',
    SHARED_ANALYSIS = 'Failed to get shared analysis',
    SAVE_ANALYSIS = 'Failed to save analysis'
  }

  export enum ServerErrors{
    INTERNAL_SERVER=  'Internal server error',
    INVALID_DB_URL= 'Invalid database URL',
    NO_DOCS_FOUND='No documents found matching the query'
  };

  export const DEFAULT_ERROR_MESSAGE = 'Sorry, an error occurred. Please report the issue if it persists.'
