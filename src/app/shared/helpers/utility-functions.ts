
/** Custom function for to constrcut HTTP Error message with status code */
export const constrcutCustomeError = (error: any): any => {
  switch (error.status) {
    case 404:
      return `Method Not Found: ${error.message}`;
    default:
      return error.message;
  }
};
