import { Helmet } from 'react-helmet-async';

const Meta = ({ title, description, keywords, image, url }) => {
  const siteName = 'Bosona Portfolio';
  const siteUrl = 'https://bosonag.vercel.app';
  const fullTitle = title ? `${title} | ${siteName}` : `${siteName} - Full Stack Developer`;
  const pageUrl = url ? `${siteUrl}${url}` : siteUrl;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Bosona" />
      <link rel="canonical" href={pageUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={siteName} />
      {image && <meta property="og:image" content={image} />}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={pageUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}
    </Helmet>
  );
};

Meta.defaultProps = {
  description: 'Bosona - Professional Full Stack Developer specializing in React, Node.js, MongoDB, and modern web technologies. Explore my portfolio, projects, and technical blog.',
  keywords: 'Bosona, bosona portfolio, bosona developer, full stack developer, web developer, react developer, nodejs developer, mongodb, javascript, typescript, portfolio, web development, software engineer, frontend developer, backend developer',
};

export default Meta;
