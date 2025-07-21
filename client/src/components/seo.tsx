interface SeoProps {
  title?: string
  description?: string
  image?: string
  link?: string
}

export function Seo({ title, description, image, link }: SeoProps) {
  return (
    <>
      <title>{title ? `${title} | food.app` : "food.app"}</title>
      {description && (
        <meta
          name="description"
          content={description}
        />
      )}

      <meta
        property="og:title"
        content={title ? `${title} | food.app` : "food.app"}
      />
      {description && (
        <meta
          property="og:description"
          content={description}
        />
      )}
      {link && (
        <meta
          property="og:url"
          content={link}
        />
      )}
      {image && (
        <meta
          property="og:image"
          content={image}
        />
      )}

      <meta
        property="twitter:title"
        content={title ? `${title} | food.app` : "food.app"}
      />
      {description && (
        <meta
          property="twitter:description"
          content={description}
        />
      )}
      {link && (
        <meta
          property="twitter:url"
          content={link}
        />
      )}
      {image && (
        <meta
          property="twitter:image"
          content={image}
        />
      )}
    </>
  )
}
