/* eslint-disable @typescript-eslint/no-explicit-any */

const handleDuplicateError = (error: any) => {
  const match = error.message.match(/"([^"]*)"/);
  const extrated_msg = match && match[1];

  const errorSources = `Duplicate Information. ${extrated_msg} is already exists!`;

  const statusCode = 400;

  return {
    statusCode,
    message: 'Validation Error',
    errorSources,
  };
};

export default handleDuplicateError;
