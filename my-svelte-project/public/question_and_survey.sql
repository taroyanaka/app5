-- 既存のテーブルを削除
DROP TABLE IF EXISTS survey_access;
DROP TABLE IF EXISTS responses;
DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS surveys;
DROP TABLE IF EXISTS users;

-- 1. users テーブルを作成
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uid TEXT NOT NULL UNIQUE, -- ユーザー識別子（ユニーク）
    role TEXT NOT NULL CHECK(role IN ('requester', 'respondent', 'admin')) -- ユーザーの種類を指定
);

-- 2. surveys テーブルを作成
CREATE TABLE surveys (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL, -- アンケートの題名
    description TEXT, -- アンケートの説明
    price REAL NOT NULL, -- アンケート実施にかかる価格
    requester_id INTEGER NOT NULL, -- 発注者
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (requester_id) REFERENCES users(id) -- 発注者とのリレーション
);

-- 3. questions テーブルを作成
CREATE TABLE questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    survey_id INTEGER NOT NULL, -- 所属するアンケート
    question_text TEXT NOT NULL, -- 質問内容
    FOREIGN KEY (survey_id) REFERENCES surveys(id) -- アンケートとのリレーション
);

-- 4. responses テーブルを作成
CREATE TABLE responses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question_id INTEGER NOT NULL, -- 回答する質問
    respondent_id INTEGER NOT NULL, -- 回答者
    response_value INTEGER NOT NULL CHECK(response_value BETWEEN 1 AND 5), -- 回答（1から5の範囲）
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (question_id) REFERENCES questions(id), -- 質問とのリレーション
    FOREIGN KEY (respondent_id) REFERENCES users(id) -- 回答者とのリレーション
);

-- 5. survey_access テーブルを作成
CREATE TABLE survey_access (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    survey_id INTEGER NOT NULL, -- アンケートのまとまり
    user_id INTEGER NOT NULL, -- 閲覧権限を持つユーザー
    FOREIGN KEY (survey_id) REFERENCES surveys(id), -- アンケートとのリレーション
    FOREIGN KEY (user_id) REFERENCES users(id) -- ユーザーとのリレーション
);

-- サンプルデータの挿入
-- 1. users テーブルにサンプルデータを挿入
INSERT INTO users (uid, role) VALUES ('user1_uid', 'requester');
INSERT INTO users (uid, role) VALUES ('user2_uid', 'respondent');
INSERT INTO users (uid, role) VALUES ('user3_uid', 'admin');
INSERT INTO users (uid, role) VALUES ('user4_uid', 'respondent');

-- 2. surveys テーブルにサンプルデータを挿入
INSERT INTO surveys (title, description, price, requester_id) VALUES ('Customer Satisfaction Survey', 'A survey to measure customer satisfaction.', 100.00, 1);
INSERT INTO surveys (title, description, price, requester_id) VALUES ('Employee Engagement Survey', 'A survey to gauge employee engagement.', 200.00, 1);

-- 3. questions テーブルにサンプルデータを挿入
INSERT INTO questions (survey_id, question_text) VALUES (1, 'How satisfied are you with our service?');
INSERT INTO questions (survey_id, question_text) VALUES (1, 'How likely are you to recommend us to a friend?');
INSERT INTO questions (survey_id, question_text) VALUES (2, 'How engaged do you feel at work?');
INSERT INTO questions (survey_id, question_text) VALUES (2, 'How satisfied are you with your current role?');

-- 4. responses テーブルにサンプルデータを挿入
INSERT INTO responses (question_id, respondent_id, response_value) VALUES (1, 2, 4); -- user2が質問1に回答
INSERT INTO responses (question_id, respondent_id, response_value) VALUES (2, 2, 5); -- user2が質問2に回答
INSERT INTO responses (question_id, respondent_id, response_value) VALUES (3, 4, 3); -- user4が質問3に回答
INSERT INTO responses (question_id, respondent_id, response_value) VALUES (4, 4, 2); -- user4が質問4に回答

-- 5. survey_access テーブルにサンプルデータを挿入
INSERT INTO survey_access (survey_id, user_id) VALUES (1, 1); -- user1がアンケート1にアクセス可能
INSERT INTO survey_access (survey_id, user_id) VALUES (1, 3); -- user3がアンケート1にアクセス可能（管理者）
INSERT INTO survey_access (survey_id, user_id) VALUES (2, 1); -- user1がアンケート2にアクセス可能
INSERT INTO survey_access (survey_id, user_id) VALUES (2, 3); -- user3がアンケート2にアクセス可能（管理者）
