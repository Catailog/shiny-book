export const TEST_ACCOUNT = {
  EMAIL_DOMAIN: 'test.shinybook.local',
  IS_TEST_ACCOUNT_METADATA_KEY: 'isTestAccount',
  PAIR_TOKEN_METADATA_KEY: 'testAccountPairToken',
  IDENTITY_COOKIE_NAME: 'test_identity_token',
  IDENTITY_COOKIE_MAX_AGE: 60 * 60 * 24 * 7,
} as const;

export const TEST_ACCOUNT_ROLE_PREFIX = {
  CONSUMER: 'consumer',
  ADMIN: 'admin',
} as const;

export interface TestSeedAddress {
  label: string;
  postalCode: string;
  addressLine1: string;
  addressLine2: string;
}

export const TEST_METRO_CITY_HALL_ADDRESSES: readonly TestSeedAddress[] = [
  {
    label: '서울특별시청',
    postalCode: '04524',
    addressLine1: '서울특별시 중구 세종대로 110',
    addressLine2: '서울특별시청',
  },
  {
    label: '부산광역시청',
    postalCode: '47545',
    addressLine1: '부산광역시 연제구 중앙대로 1001',
    addressLine2: '부산광역시청',
  },
  {
    label: '대구광역시청',
    postalCode: '41909',
    addressLine1: '대구광역시 중구 공평로 88',
    addressLine2: '대구광역시청',
  },
  {
    label: '인천광역시청',
    postalCode: '21554',
    addressLine1: '인천광역시 남동구 정각로 29',
    addressLine2: '인천광역시청',
  },
  {
    label: '광주광역시청',
    postalCode: '61945',
    addressLine1: '광주광역시 서구 상무중앙로 111',
    addressLine2: '광주광역시청',
  },
  {
    label: '대전광역시청',
    postalCode: '35242',
    addressLine1: '대전광역시 서구 둔산로 100',
    addressLine2: '대전광역시청',
  },
  {
    label: '울산광역시청',
    postalCode: '44675',
    addressLine1: '울산광역시 남구 중앙로 201',
    addressLine2: '울산광역시청',
  },
];
