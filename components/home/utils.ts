import { v1 as uuidv1, v4 as uuidv4, v7 as uuidv7, NIL as NIL_UUID, validate, version } from 'uuid';

export type UuidVersion = 'v4' | 'v7' | 'v1' | 'nil';
export type CaseType = 'lower' | 'upper';
export type EnclosureType = 'none' | 'braces' | 'quotes' | 'single-quotes' | 'urn';

export interface FormatOptions {
  hasHyphens: boolean;
  caseType: CaseType;
  enclosure: EnclosureType;
}

export const generateRawUuid = (ver: UuidVersion): string => {
  switch (ver) {
    case 'v7':
      return uuidv7();
    case 'v1':
      return uuidv1();
    case 'nil':
      return NIL_UUID;
    case 'v4':
    default:
      return uuidv4();
  }
};

export const formatUuidString = (rawUuid: string, options: FormatOptions): string => {
  if (!rawUuid) return '';

  let clean = rawUuid.trim();

  // Strip existing hyphens if not requested
  if (!options.hasHyphens) {
    clean = clean.replace(/-/g, '');
  } else if (!clean.includes('-') && clean.length === 32) {
    // Re-insert hyphens if string was 32 hex chars
    clean = `${clean.slice(0, 8)}-${clean.slice(8, 12)}-${clean.slice(12, 16)}-${clean.slice(16, 20)}-${clean.slice(20)}`;
  }

  // Casing
  clean = options.caseType === 'upper' ? clean.toUpperCase() : clean.toLowerCase();

  // Enclosure
  switch (options.enclosure) {
    case 'braces':
      return `{${clean}}`;
    case 'quotes':
      return `"${clean}"`;
    case 'single-quotes':
      return `'${clean}'`;
    case 'urn':
      return `urn:uuid:${clean}`;
    case 'none':
    default:
      return clean;
  }
};

export interface UuidInspectionResult {
  isValid: boolean;
  version: number | null;
  versionName: string;
  variant: string;
  decodedTimestamp?: string;
  relativeTime?: string;
  entropyBits?: number;
  explanation: string;
}

export const inspectUuid = (input: string): UuidInspectionResult => {
  const trimmed = input.trim();
  if (!trimmed) {
    return {
      isValid: false,
      version: null,
      versionName: 'Empty',
      variant: 'N/A',
      explanation: 'Please enter a UUID to inspect.',
    };
  }

  // Remove common enclosures like { }, " ", ' ', urn:uuid:
  let normalized = trimmed;
  if (normalized.startsWith('{') && normalized.endsWith('}')) {
    normalized = normalized.slice(1, -1);
  } else if (
    (normalized.startsWith('"') && normalized.endsWith('"')) ||
    (normalized.startsWith("'") && normalized.endsWith("'"))
  ) {
    normalized = normalized.slice(1, -1);
  } else if (normalized.toLowerCase().startsWith('urn:uuid:')) {
    normalized = normalized.slice(9);
  }

  // Handle unhyphenated 32-char hex
  if (!normalized.includes('-') && /^[0-9a-fA-F]{32}$/.test(normalized)) {
    normalized = `${normalized.slice(0, 8)}-${normalized.slice(8, 12)}-${normalized.slice(12, 16)}-${normalized.slice(16, 20)}-${normalized.slice(20)}`;
  }

  const isValid = validate(normalized);

  if (!isValid) {
    return {
      isValid: false,
      version: null,
      versionName: 'Invalid',
      variant: 'N/A',
      explanation: 'Does not conform to the 32-hex digit RFC 4122 / 9562 standard structure.',
    };
  }

  if (normalized.toLowerCase() === NIL_UUID) {
    return {
      isValid: true,
      version: 0,
      versionName: 'Nil UUID',
      variant: 'N/A',
      entropyBits: 0,
      explanation: 'A special UUID that has all 128 bits set to zero (00000000-0000-0000-0000-000000000000).',
    };
  }

  const ver = version(normalized);
  const parts = normalized.split('-');
  const variantHex = parts.length > 3 ? parseInt(parts[3].charAt(0), 16) : 0;

  let variantName = 'RFC 4122 / Leach-Salz';
  if ((variantHex & 0x8) === 0) variantName = 'NCS backward compatibility';
  else if ((variantHex & 0xc) === 0x8) variantName = 'RFC 4122 / RFC 9562 (Standard)';
  else if ((variantHex & 0xe) === 0xc) variantName = 'Microsoft Corporation (GUID)';
  else variantName = 'Reserved for future definition';

  let decodedTimestamp: string | undefined;
  let relativeTime: string | undefined;
  let entropyBits: number | undefined;
  let versionName = `Version ${ver}`;
  let explanation = '';

  if (ver === 4) {
    versionName = 'Version 4 (Random)';
    entropyBits = 122;
    explanation = 'Generated using 122 cryptographically secure pseudo-random bits. Uniqueness probability is 1 in 5.3 × 10³⁶.';
  } else if (ver === 7) {
    versionName = 'Version 7 (Unix Epoch Time-ordered)';
    entropyBits = 74;
    explanation = 'Combines a 48-bit Unix timestamp with 74 random bits. Ideal for database primary keys with B-Tree indexes.';

    try {
      const hexTime = normalized.replace(/-/g, '').slice(0, 12);
      const ms = parseInt(hexTime, 16);
      const date = new Date(ms);
      if (!isNaN(date.getTime())) {
        decodedTimestamp = date.toUTCString();
        const diffSecs = Math.round((Date.now() - ms) / 1000);
        if (Math.abs(diffSecs) < 5) relativeTime = 'Just now';
        else if (diffSecs > 0) {
          if (diffSecs < 60) relativeTime = `${diffSecs}s ago`;
          else if (diffSecs < 3600) relativeTime = `${Math.floor(diffSecs / 60)}m ago`;
          else if (diffSecs < 86400) relativeTime = `${Math.floor(diffSecs / 3600)}h ago`;
          else relativeTime = `${Math.floor(diffSecs / 86400)}d ago`;
        } else {
          relativeTime = 'In the future';
        }
      }
    } catch {
      // Ignore timestamp parsing error
    }
  } else if (ver === 1) {
    versionName = 'Version 1 (Gregorian Time & MAC)';
    explanation = 'Based on the Gregorian calendar timestamp since Oct 15, 1582 and MAC node identifier.';
    try {
      // UUID v1 60-bit timestamp: time_low (32) + time_mid (16) + time_hi (12)
      const clean = normalized.replace(/-/g, '');
      const timeLow = clean.slice(0, 8);
      const timeMid = clean.slice(8, 12);
      const timeHi = clean.slice(13, 16); // skip version nibble at index 12
      const timeHex = timeHi + timeMid + timeLow;
      const count100ns = BigInt('0x' + timeHex);
      // Offset between Oct 15, 1582 and Jan 1, 1970 in 100ns intervals: 122192928000000000
      const unixEpochOffset = BigInt('122192928000000000');
      const unixMs = Number((count100ns - unixEpochOffset) / BigInt(10000));
      const date = new Date(unixMs);
      if (!isNaN(date.getTime())) {
        decodedTimestamp = date.toUTCString();
      }
    } catch {
      // Ignore parsing error
    }
  } else if (ver === 3) {
    versionName = 'Version 3 (MD5 Namespace)';
    explanation = 'Deterministic UUID generated by hashing a namespace and name with MD5.';
  } else if (ver === 5) {
    versionName = 'Version 5 (SHA-1 Namespace)';
    explanation = 'Deterministic UUID generated by hashing a namespace and name with SHA-1.';
  }

  return {
    isValid: true,
    version: ver,
    versionName,
    variant: variantName,
    decodedTimestamp,
    relativeTime,
    entropyBits,
    explanation,
  };
};
