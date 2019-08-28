import styled, { keyframes, css } from 'styled-components';
import { FaSpinner } from 'react-icons/fa';

const rotate = keyframes`
from {
  transform: rotate(0deg);
}

to {
  transform: rotate(360deg)
}
`;

const Loader = styled(FaSpinner)`
  color: #fff;

  ${css`
    animation: ${rotate} 2s linear infinite;
  `}
`;

export default Loader;
