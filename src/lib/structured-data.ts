import { OFFICES, SITE } from '@/data/site';

export function buildTravelAgencyJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: SITE.legalName,
    alternateName: SITE.brandName,
    url: SITE.url,
    email: SITE.email,
    telephone: OFFICES[0].phoneDisplay,
    slogan: SITE.tagline,
    department: OFFICES.map((office) => ({
      '@type': 'TravelAgency',
      name: `${SITE.brandName} — ${office.label}`,
      telephone: office.phoneDisplay,
      email: SITE.email,
      address: {
        '@type': 'PostalAddress',
        streetAddress: office.addressLines.slice(0, -1).join(', '),
        addressLocality: office.city,
        addressCountry: office.country,
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: office.lat,
        longitude: office.lng,
      },
    })),
  };
}

export function buildBreadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: `${SITE.url}${item.path}`,
    })),
  };
}
