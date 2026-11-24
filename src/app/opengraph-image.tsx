import { ImageResponse } from 'next/og';

export const alt = 'EzyQuick — Travel Made Easy | New Delhi & Dubai';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#081426',
          color: '#F5F7FA',
          padding: '64px 72px',
          fontFamily: 'Georgia, serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 20,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: '#FDBC03',
            fontFamily: 'sans-serif',
          }}
        >
          <span>EZYQUICK TRAVEL SOLUTIONS</span>
          <span>DEL 28.65°N ↔ DXB 25.12°N</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div style={{ fontSize: 82, lineHeight: 1.02, letterSpacing: '-0.02em' }}>
            More world. Less to organise.
          </div>
          <div
            style={{
              fontSize: 26,
              color: '#B7C4D6',
              fontFamily: 'sans-serif',
              maxWidth: 880,
              lineHeight: 1.45,
            }}
          >
            Corporate, medical, and leisure travel, visas, flights, stays, forex, insurance, and
            MICE — through one calm point of contact.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid rgba(255,255,255,0.2)',
            paddingTop: 24,
            fontSize: 20,
            fontFamily: 'sans-serif',
            color: '#D8E1EC',
          }}
        >
          <span>ezyquick.in · info@ezyquick.in</span>
          <div
            style={{
              width: 160,
              height: 4,
              background: 'linear-gradient(90deg, #0059FD, #FDBC03)',
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
