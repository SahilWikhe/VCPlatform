import { css } from '@emotion/react';

const globalStyles = css`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Roboto', 'Arial', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #f5f5f5;
    color: rgba(0, 0, 0, 0.87);
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  ul, ol {
    list-style: none;
  }

  button {
    cursor: pointer;
    border: none;
    background: none;
    font-family: inherit;
  }

  input, textarea, select {
    font-family: inherit;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 16px;
  }

  .page-container {
    padding: 24px 0;
  }

  .section {
    margin-bottom: 32px;
  }

  .text-center {
    text-align: center;
  }

  .mb-1 {
    margin-bottom: 8px;
  }

  .mb-2 {
    margin-bottom: 16px;
  }

  .mb-3 {
    margin-bottom: 24px;
  }

  .mb-4 {
    margin-bottom: 32px;
  }

  .mt-1 {
    margin-top: 8px;
  }

  .mt-2 {
    margin-top: 16px;
  }

  .mt-3 {
    margin-top: 24px;
  }

  .mt-4 {
    margin-top: 32px;
  }
`;

export default globalStyles; 