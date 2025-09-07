CREATE TABLE "user"
(
    id         SERIAL PRIMARY KEY,
    username   VARCHAR(255)             NOT NULL UNIQUE,
    password   TEXT                     NOT NULL,
    email      VARCHAR(255)             NOT NULL UNIQUE,
    role       VARCHAR(255)             NOT NULL DEFAULT ('GUEST'),
    version    BIGINT                   NOT NULL DEFAULT (0),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (NOW()),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (NOW())
);

CREATE TABLE program
(
    id          SERIAL PRIMARY KEY,
    code        VARCHAR(255)             NOT NULL,
    name        VARCHAR(255)             NOT NULL,
    degree      VARCHAR(255)             NOT NULL,
    version     BIGINT                   NOT NULL DEFAULT (0),
    created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (NOW()),
    updated_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (NOW()),
    updated_by  INT,
    outdated_at TIMESTAMP WITH TIME ZONE,
    outdated_by INT,
    UNIQUE (code, degree),
    FOREIGN KEY (updated_by) REFERENCES "user" (id),
    FOREIGN KEY (outdated_by) REFERENCES "user" (id)
);

CREATE TABLE course
(
    id              SERIAL PRIMARY KEY,
    code            VARCHAR(255)             NOT NULL UNIQUE,
    name            VARCHAR(255)             NOT NULL,
    credit_hours    INT                      NOT NULL,
    ects            INT,
    lecture_hours   INT,
    practical_hours INT,
    type            VARCHAR(255),
    is_remedial     BOOLEAN                           DEFAULT (FALSE),
    version         BIGINT                   NOT NULL DEFAULT (0),
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (NOW()),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (NOW()),
    updated_by      INT,
    outdated_at     TIMESTAMP WITH TIME ZONE,
    outdated_by     INT,
    FOREIGN KEY (updated_by) REFERENCES "user" (id),
    FOREIGN KEY (outdated_by) REFERENCES "user" (id)
);

CREATE TABLE study_plan
(
    id                  SERIAL PRIMARY KEY,
    year                INT                      NOT NULL,
    duration            INT                      NOT NULL DEFAULT (1),
    track               VARCHAR(255)             NOT NULL,
    program             INT                      NOT NULL,
    approved_study_plan JSONB,
    version             BIGINT                   NOT NULL DEFAULT (0),
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (NOW()),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (NOW()),
    updated_by          INT,
    archived_at         TIMESTAMP WITH TIME ZONE,
    archived_by         INT,
    FOREIGN KEY (program) REFERENCES program (id),
    FOREIGN KEY (updated_by) REFERENCES "user" (id),
    FOREIGN KEY (archived_by) REFERENCES "user" (id)
);

CREATE TABLE section
(
    id                    SERIAL PRIMARY KEY,
    level                 VARCHAR(255) NOT NULL,
    type                  VARCHAR(255) NOT NULL,
    required_credit_hours INT          NOT NULL,
    name                  VARCHAR(255) NOT NULL,
    position              INT          NOT NULL DEFAULT (0),
    study_plan            INT          NOT NULL,
    UNIQUE (level, type, position, study_plan)
);

CREATE TABLE section_course
(
    section INT NOT NULL,
    course  INT NOT NULL,
    PRIMARY KEY (section, course),
    FOREIGN KEY (section) REFERENCES section (id),
    FOREIGN KEY (course) REFERENCES course (id)
);

CREATE TABLE course_prerequisite
(
    study_plan   INT          NOT NULL,
    course       INT          NOT NULL,
    prerequisite INT          NOT NULL,
    relation     VARCHAR(255) NOT NULL,
    PRIMARY KEY (study_plan, course, prerequisite),
    FOREIGN KEY (course) REFERENCES course (id),
    FOREIGN KEY (prerequisite) REFERENCES course (id)
);

CREATE TABLE course_corequisite
(
    study_plan  INT NOT NULL,
    course      INT NOT NULL,
    corequisite INT NOT NULL,
    PRIMARY KEY (study_plan, course, corequisite),
    FOREIGN KEY (course) REFERENCES course (id),
    FOREIGN KEY (corequisite) REFERENCES course (id)
);

CREATE TABLE course_placement
(
    study_plan INT NOT NULL,
    course     INT NOT NULL,
    year       INT NOT NULL,
    semester   INT NOT NULL,
    position   INT NOT NULL DEFAULT (1),
    span       INT NOT NULL DEFAULT (1),
    PRIMARY KEY (study_plan, course),
    FOREIGN KEY (course) REFERENCES course (id)
);

INSERT INTO "user" (username, email, role, password)
VALUES ('flowstruct', 'admin@flowstruct.com', 'ADMIN', '$2a$12$Pny61LESAXFDjnkgczhJ8eIC3HbEnlQyvW8FQ5mpoJc5ODks1zG.i');