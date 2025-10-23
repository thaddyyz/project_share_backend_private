export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (error, request) => {
  // Log error for monitoring
  console.error('Error:', {
    message: error.message,
    stack: error.stack,
    url: request.url,
    method: request.method,
    timestamp: new Date().toISOString()
  });

  // Default error response
  let statusCode = 500;
  let message = 'Internal server error';

  // Handle different error types
  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  } else if (error.message.includes('Rate limit')) {
    statusCode = 429;
    message = error.message;
  } else if (error.message.includes('Authentication') || error.message.includes('token')) {
    statusCode = 401;
    message = 'Authentication failed';
  } else if (error.message.includes('Not authorized') || error.message.includes('Forbidden')) {
    statusCode = 403;
    message = 'Access denied';
  } else if (error.message.includes('not found') || error.message.includes('No data')) {
    statusCode = 404;
    message = 'Resource not found';
  } else if (error.message.includes('duplicate key') || error.message.includes('already exists')) {
    statusCode = 409;
    message = 'Resource already exists';
  } else if (error.message.includes('validation') || error.message.includes('invalid')) {
    statusCode = 400;
    message = 'Invalid request data';
  }

  // Don't expose internal errors in production
  if (statusCode === 500 && process.env.NODE_ENV === 'production') {
    message = 'Internal server error';
  }

  return Response.json(
    {
      error: message,
      ...(process.env.NODE_ENV !== 'production' && { 
        stack: error.stack,
        details: error.message 
      })
    },
    { status: statusCode }
  );
};

// Helper function to wrap route handlers with error handling
export const withErrorHandling = (handler) => {
  return async (request, context) => {
    try {
      return await handler(request, context);
    } catch (error) {
      return errorHandler(error, request);
    }
  };
};