DROP DATABASE IF EXISTS loaderapp;
CREATE DATABASE loaderapp;

\c loaderapp;

CREATE TABLE IF NOT EXISTS "account" (
    "id" SERIAL PRIMARY KEY,
    "account_name" VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS "user" (
    "id" SERIAL PRIMARY KEY,
    "user_name" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "accountId" INT REFERENCES "account"("id")
);

CREATE TABLE IF NOT EXISTS "run" (
    "id" VARCHAR(255) PRIMARY KEY,
    "start_time" TIMESTAMP NOT NULL,
    "location" VARCHAR(255) NOT NULL,
    "assigned_driver" VARCHAR(255) NOT NULL,
    "assigned_vehicle" VARCHAR(255) NOT NULL,
    "status" VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS "run_users_user" (
    "runId" VARCHAR(255) REFERENCES "run"("id"),
    "userId" INT REFERENCES "user"("id"),
    PRIMARY KEY ("runId", "userId")
);

CREATE TABLE IF NOT EXISTS "item" (
    "id" VARCHAR(255) PRIMARY KEY,
    "item_name" VARCHAR(255) NOT NULL,
    "stop" INT NOT NULL,
    "checked" BOOLEAN NOT NULL,
    "runId" VARCHAR(255) REFERENCES "run"("id")
);

CREATE TABLE IF NOT EXISTS "code" (
    "id" SERIAL PRIMARY KEY,
    "code" VARCHAR(255) NOT NULL,
    "scanned" BOOLEAN NOT NULL,
    "itemId" VARCHAR(255) REFERENCES "item"("id")
);

-- Insert account
INSERT INTO "account" ("account_name")
VALUES ('DemoAccount');

-- Insert user
INSERT INTO "user" ("user_name", "password_hash", "accountId")
VALUES ('demo_user', '$2a$10$boWddGFk7lCDwjv/H6dneebxatn.9mSZX472xxY5L9q.8urwArD1.', 1);

-- Insert runs
INSERT INTO "run" ("id", "start_time", "location", "assigned_driver", "assigned_vehicle", "status")
VALUES
  ('MlwZthNlO', '2024-04-24 08:00:00', 'Kersland St, Glasgow, Lanarkshire', 'Harry Potter', '2023 Ford Transit 350', 'LOADER_RUN_CHANGE_TYPE_RUN_CREATED'),
  ('DKPJPuohH', '2024-04-25 09:00:00', '3 The Green NEWPORT NP86 7ZY', 'Frodo Baggins', '2023 Ford Transit 350', 'LOADER_RUN_CHANGE_TYPE_RUN_CREATED'),
  ('ORnuIyNdN', '2024-04-26 10:00:00', '67 Springfield Road TWICKENHAM TW95 7TJ', 'Anakin Skywalker', '2023 Ford Transit 350', 'LOADER_RUN_CHANGE_TYPE_RUN_CREATED');

INSERT INTO "run_users_user" ("runId","userId")
VALUES
    ('MlwZthNlO', 1),
    ('DKPJPuohH', 1),
    ('ORnuIyNdN', 1);

INSERT INTO "item" ("id", "item_name", "stop", "checked", "runId")
VALUES
  ('wFoEMmw', 'Item_A', 1, false, 'MlwZthNlO'),
  ('pZXHNmH', 'Item_B', 2, false, 'MlwZthNlO'),
  ('NLKnYDF', 'Item_C', 3, false, 'MlwZthNlO'),
  ('TlhwBWH', 'Item_D', 1, false, 'DKPJPuohH'),
  ('mrAIEtf', 'Item_E', 2, false, 'DKPJPuohH'),
  ('ypkEasK', 'Item_F', 3, false, 'DKPJPuohH'),
  ('pWMusUe', 'Item_G', 1, false, 'ORnuIyNdN'),
  ('CRDaeEE', 'Item_H', 2, false, 'ORnuIyNdN'),
  ('dQMlbJC', 'Item_I', 3, false, 'ORnuIyNdN');

-- Insert codes for item 1
INSERT INTO "code" ("code", "scanned", "itemId")
VALUES 
    ('85095295', false, 'wFoEMmw'), ('11892507', false, 'wFoEMmw'),
    ('09548189', false, 'pZXHNmH'), ('91546830', false, 'pZXHNmH'),
    ('87617453', false, 'NLKnYDF'), ('57048692', false, 'NLKnYDF'),
    ('81148628', false, 'TlhwBWH'), ('04565816', false, 'TlhwBWH'),
    ('85473002', false, 'mrAIEtf'), ('55267460', false, 'mrAIEtf'),
    ('63211023', false, 'ypkEasK'), ('94306526', false, 'ypkEasK'),
    ('70728966', false, 'pWMusUe'), ('69608901', false, 'pWMusUe'),
    ('30940322', false, 'CRDaeEE'), ('04268934', false, 'CRDaeEE'),
    ('51950993', false, 'dQMlbJC'), ('60897619', false, 'dQMlbJC');