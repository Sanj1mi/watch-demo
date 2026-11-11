CREATE INDEX idx_person_type ON person(type);
CREATE INDEX idx_person_department ON person(department);
CREATE INDEX idx_person_name ON person(first_name, last_name);
CREATE INDEX idx_person_age ON person(age);

CREATE INDEX idx_log_patient_id ON hospitalization_log(patient_id);
CREATE INDEX idx_log_timestamp ON hospitalization_log(timestamp DESC);
CREATE INDEX idx_log_action ON hospitalization_log(action);