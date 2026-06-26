-- ============================================================
-- Interspace Indonesia – MySQL → Supabase (PostgreSQL) Migration
-- Run this in Supabase SQL Editor: https://app.supabase.com
-- ============================================================

-- global_setting
CREATE TABLE IF NOT EXISTS global_setting (
  "gsetId"                  SERIAL PRIMARY KEY,
  "gsetAboutId"             TEXT,
  "gsetAboutEn"             TEXT,
  "gsetFb"                  VARCHAR(150),
  "gsetTwitter"             VARCHAR(150),
  "gsetInstagram"           VARCHAR(150),
  "gsetYoutube"             VARCHAR(150),
  "gsetMetaTitleId"         VARCHAR(60),
  "gsetMetaTitleEn"         VARCHAR(60),
  "gsetMetaImage"           VARCHAR(255),
  "gsetMetaDescriptionId"   VARCHAR(160),
  "gsetMetaDescriptionEn"   VARCHAR(160),
  "gsetCreateBy"            INTEGER,
  "gsetCreateTime"          TIMESTAMP,
  "gsetUpdateBy"            INTEGER,
  "gsetUpdateTime"          TIMESTAMP
);

-- master_branch
CREATE TABLE IF NOT EXISTS master_branch (
  "mbraId"          SERIAL PRIMARY KEY,
  "mbraCode"        VARCHAR(3),
  "mbraName"        VARCHAR(160),
  "mbraAddress"     TEXT,
  "mbraPhone"       VARCHAR(15),
  "mbraPhone2"      VARCHAR(15),
  "mbraCountry"     VARCHAR(15),
  "mbraMail"        VARCHAR(150),
  "mbraCreateBy"    INTEGER,
  "mbraCreateTime"  TIMESTAMP,
  "mbraUpdateBy"    INTEGER,
  "mbraUpdateTime"  TIMESTAMP
);

-- menu
CREATE TABLE IF NOT EXISTS menu (
  "menuId"          SERIAL PRIMARY KEY,
  "menuName"        VARCHAR(150),
  "menuLink"        VARCHAR(255),
  "menuChild"       INTEGER DEFAULT 0,
  "menuLevel"       INTEGER DEFAULT 0,
  "menuIconClass"   VARCHAR(200),
  "menuCreateTime"  TIMESTAMP,
  "menuCreateBy"    INTEGER,
  "menuUpdateTime"  TIMESTAMP,
  "menuUpdateBy"    INTEGER
);

-- our_service
CREATE TABLE IF NOT EXISTS our_service (
  "oserId"              SERIAL PRIMARY KEY,
  "oserTitle"           VARCHAR(60),
  "oserSubTitleId"      VARCHAR(60),
  "oserSubTitleEn"      VARCHAR(60),
  "oserDescriptionId"   TEXT,
  "oserDescriptionEn"   TEXT,
  "oserUrl"             VARCHAR(50),
  "oserImage"           VARCHAR(255),
  "oserCreateBy"        INTEGER,
  "oserCreateTime"      TIMESTAMP,
  "oserUpdateBy"        INTEGER,
  "oserUpdateTime"      TIMESTAMP
);

-- our_team
CREATE TABLE IF NOT EXISTS our_team (
  "oteaId"          SERIAL PRIMARY KEY,
  "oteaName"        VARCHAR(50),
  "oteaPosition"    VARCHAR(100),
  "oteaHistoryId"   TEXT,
  "oteaHistoryEn"   TEXT,
  "oteaStatus"      SMALLINT DEFAULT 0,
  "oteaFoto"        VARCHAR(255),
  "oteaAvatar"      VARCHAR(255),
  "oteaCreateBy"    INTEGER,
  "oTeaCreateTime"  TIMESTAMP,
  "oteaUpdateBy"    INTEGER,
  "oteaUpdateTime"  TIMESTAMP
);

-- user
CREATE TABLE IF NOT EXISTS "user" (
  "udafId"              SERIAL PRIMARY KEY,
  "udafName"            VARCHAR(200),
  "udafEmail"           VARCHAR(150),
  "udafPassword"        VARCHAR(255),
  "udafHash"            VARCHAR(100),
  "udafPhone"           VARCHAR(20),
  "udafCompany"         VARCHAR(150),
  "udafAddress"         TEXT,
  "udafAddress2"        TEXT,
  "udafCity"            VARCHAR(255),
  "udafZipcode"         VARCHAR(20),
  "udafImage"           VARCHAR(255),
  "udafType"            INTEGER DEFAULT 0,
  "udafMpubId"          INTEGER,
  "udafUrlCode"         VARCHAR(200),
  "udafActiveSummary"   SMALLINT DEFAULT 0,
  "udafStatus"          INTEGER DEFAULT 0,
  "udafBankId"          INTEGER,
  "udafNoRek"           VARCHAR(50),
  "udafNameRek"         VARCHAR(200),
  "udafCreateTime"      TIMESTAMP,
  "udafCreateBy"        INTEGER,
  "udafUpdateTime"      TIMESTAMP,
  "udafUpdateBy"        INTEGER,
  "udafIsAdmin"         SMALLINT DEFAULT 0
);

-- user_access
CREATE TABLE IF NOT EXISTS user_access (
  "udacId"          SERIAL PRIMARY KEY,
  "udacUdafId"      INTEGER REFERENCES "user"("udafId"),
  "udacAccess"      INTEGER,
  "udacCreateBy"    INTEGER,
  "udacCreateTime"  TIMESTAMP,
  "udacUpdateBy"    INTEGER,
  "udacUpdateTime"  TIMESTAMP
);

-- variable_language
CREATE TABLE IF NOT EXISTS variable_language (
  "langId"          SERIAL PRIMARY KEY,
  "langWordsId"     VARCHAR(255),
  "langWordsEn"     VARCHAR(255),
  "langVariable"    VARCHAR(60),
  "langCreateBy"    INTEGER,
  "langCreateTime"  TIMESTAMP,
  "langUpdateBy"    INTEGER,
  "langUpdateTime"  TIMESTAMP
);

-- ============================================================
-- SEED DATA
-- Run after creating tables
-- ============================================================

INSERT INTO global_setting
  ("gsetAboutId", "gsetAboutEn", "gsetFb", "gsetTwitter", "gsetInstagram", "gsetYoutube",
   "gsetMetaTitleId", "gsetMetaTitleEn", "gsetMetaImage",
   "gsetMetaDescriptionId", "gsetMetaDescriptionEn",
   "gsetCreateBy", "gsetCreateTime", "gsetUpdateBy", "gsetUpdateTime")
VALUES
  (
    '<p>Interspace Indonesia adalah anak perusahaan dari Interspace Co., Ltd., Jepang. Interspace Co., Ltd. bergerak di bidang Afiliasi Marketing, Aplikasi Mobile dan Platform Data.</p>',
    '<p>Interspace Indonesia is a subsidiary of Interspace Co., Ltd., Japan. Interspace Co., Ltd. operates in Affiliate Marketing, Mobile Applications, and Data Platform.</p>',
    'https://www.facebook.com/InterspaceIndonesia',
    'https://twitter.com/Interspace_Id',
    '',
    '',
    'Interspace Indonesia Platform Afiliasi dan Layanan Situs Web',
    'Interspace Indonesia Affiliate Platform Website Service',
    '',
    'Penyedia layanan afiliasi, optimalisasi datafeed dan website aplikasi mobile di Indonesia',
    'Affiliate service providers, optimizing datafeed mobile application websites in Indonesia',
    1, NOW(), 1, NOW()
  )
ON CONFLICT DO NOTHING;

INSERT INTO variable_language ("langWordsId", "langWordsEn", "langVariable", "langCreateBy", "langCreateTime")
VALUES
  ('Beranda',         'Home',          'menu_home',       1, NOW()),
  ('Tentang Kami',    'About Us',      'menu_about',      1, NOW()),
  ('Layanan',         'Services',      'menu_service',    1, NOW()),
  ('Mitra',           'Partner',       'menu_partner',    1, NOW()),
  ('Tim Kami',        'Our Team',      'menu_ourteam',    1, NOW()),
  ('Tim Kami',        'Our Team',      'menu_ourteams',   1, NOW()),
  ('Hubungi Kami',    'Contact Us',    'contact_us',      1, NOW()),
  ('Platform Afiliasi dan Layanan Situs Web', 'Affiliate Platform and Website Services', 'text_slider_1', 1, NOW()),
  ('Mitra Digital Terbaik Anda',              'Your Best Digital Partner',               'text_slider_2', 1, NOW()),
  ('Layanan kami', 'Our services',   'our_service_desc', 1, NOW()),
  ('Kunjungi Website', 'Visit Website', 'visit_website',  1, NOW())
ON CONFLICT DO NOTHING;

-- NOTE: Import our_service and our_team data manually from your MySQL dump
-- or use a migration tool. The descriptions contain HTML entities that need
-- to be HTML-decoded before inserting (PHP html_entity_decode).

-- ============================================================
-- RLS POLICIES (optional – disable RLS for service role access)
-- ============================================================
-- The app uses the service role key server-side, so RLS is bypassed.
-- If you want to enable RLS for additional security:
-- ALTER TABLE global_setting ENABLE ROW LEVEL SECURITY;
-- etc.
