import libTruncateMiddle from 'truncate-middle';

export const dotsToSpaces = (input: string) => input.split('.').join(' ');

export const truncate = (
  input: string,
  options: {
    length: number;
    ellipsis?: string;
  }
) => {
  const { length, ellipsis = '...' } = options;
  return input.slice(0, length) + ellipsis;
};

export const truncateMiddle = (
  input: string,
  options: {
    frontLength: number;
    backLength: number;
    ellipsis?: string;
  }
) => {
  const { frontLength, backLength, ellipsis = '...' } = options;
  return libTruncateMiddle(input, frontLength, backLength, ellipsis);
};
