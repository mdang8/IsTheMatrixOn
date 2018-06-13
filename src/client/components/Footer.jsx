import React from 'react';

export default function Footer() {
  // @TODO - add name, GitHub icon, etc.
  const githubRepoLink = 'https://github.com/mdang8/IsTheMatrixOn';

  return (
    <div className="row">
      <div className="icons">
        <a href={githubRepoLink} className="icon-link">
          <span className="fab fa-github fa-3x" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
